import GLib from "gi://GLib";
import Gio from "gi://Gio";

interface Disk {
  size?: string;
  used?: string;
  avail?: string;
  use?: string;
  mount_on?: string;
}

export const disk = Variable(
  {},
  {
    listen: [
      App.configDir + "/scripts/disk.sh 2",
      (out) => JSON.parse(out) as Disk,
    ],
  },
);

export const cpu = Variable(0, {
  listen: [App.configDir + "/scripts/cpu.sh 2", (out) => parseFloat(out)],
});

export const ram = Variable(0, {
  listen: [App.configDir + "/scripts/ram.sh 2", (out) => parseFloat(out)],
});

interface Temp {
  cpu?: string;
}

export const temp = Variable(
  {},
  {
    listen: [
      App.configDir + "/scripts/temp.sh 2",
      (out) => JSON.parse(out) as Temp,
    ],
  },
);

interface Traffic {
  rx_bps: number;
  tx_bps: number;
}

export const traffic = Variable(
  { rx_bps: 0, tx_bps: 0 },
  {
    listen: [
      App.configDir + "/scripts/traffic.sh 2",
      (out) => JSON.parse(out) as Traffic,
    ],
  },
);

interface Updates {
  count: number;
  packages: {
    name: string;
    old_version: string;
    new_version: string;
    aur?: boolean;
  }[];
}

export const updates = Variable(
  { count: 0, packages: [] },
  {
    listen: [
      App.configDir + "/scripts/updates.sh",
      (out) => JSON.parse(out) as Updates,
    ],
  },
);

interface Secret {
  weather_key: string;
  tencent_map: {
    key: string;
    secret_key: string;
  };
}

const filepath = GLib.get_user_data_dir() + "/ags/.secret.json";
const readSecret = (file?: Gio.File): Secret =>
  JSON.parse(Utils.readFile(file ? file : filepath) || "{}");
Utils.monitorFile(filepath, (file, event) => {
  if (event === 0) {
    secret.value = readSecret(file);
  }
});

export const secret = Variable(readSecret());

interface Location {
  ip: string;
  location: {
    lat: number;
    lng: number;
  };
  ad_info: {
    nation: string;
    province: string;
    city: string;
    district: string;
    adcode: number;
    nation_code: number;
  };
}

const { key, secret_key } = secret.value.tencent_map;
const url = "https://apis.map.qq.com";
const api = `/ws/location/v1/ip?key=${key}`;
const sig = Utils.exec([
  "bash",
  "-c",
  `echo -n "${api}${secret_key}" | md5sum | awk '{print $1}'`,
]);
const fetchLocation = () =>
  Utils.fetch(`${url}${api}&sig=${sig}`)
    .then((res) => res.json())
    .then((res) => (location.value = res.result as Location))
    .catch((error) => console.log(error));
const network = await Service.import("network");
let lastConnectivity = network.connectivity;
network.connect("changed", ({ connectivity }) => {
  if (connectivity !== lastConnectivity && connectivity === "full") {
    fetchLocation();
  }
  lastConnectivity = connectivity;
});
fetchLocation();

export const location = Variable({} as Location);
