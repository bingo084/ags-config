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
