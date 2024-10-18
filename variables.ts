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

const home = Utils.exec(["bash", "-c", "echo $HOME"]);
const filepath = home + "/.local/share/ags/.secret.json";
const readSecret = (file?: Gio.File): Secret =>
  JSON.parse(Utils.readFile(file ? file : filepath) || "{}");
const sercet = Variable(readSecret());
Utils.monitorFile(filepath, (file, event) => {
  if (event === 0) {
    sercet.value = readSecret(file);
  }
});

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

export const location = Variable({} as Location);

const { key, secret_key } = sercet.value.tencent_map;
const url = "https://apis.map.qq.com";
const api = `/ws/location/v1/ip?key=${key}`;
const sig = Utils.exec([
  "bash",
  "-c",
  `echo -n "${api}${secret_key}" | md5sum | awk '{print $1}'`,
]);
Utils.fetch(`${url}${api}&sig=${sig}`)
  .then((res) => res.json())
  .then(({ result }) => (location.value = result as Location))
  .catch((error) => console.log(error));
