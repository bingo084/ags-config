import { GObject, subprocess, Variable } from "astal";
import { Astal, astalify, ConstructProps, Gtk } from "astal/gtk3";

const level = (v: number, l1: number, l2: number) =>
  v < l1 ? "" : v < l2 ? "warning" : "critical";

const cpu = Variable(0).poll(2000, "./script/cpu.sh", parseFloat);
const ram = Variable(0).poll(2000, "./script/ram.sh", parseFloat);
const temp = Variable({ cpu: 0, gpu: 0 }).poll(
  2000,
  "./script/temp.sh",
  (out) => JSON.parse(out),
);
const disk = Variable({
  size: "0G",
  used: "0G",
  avail: "0G",
  use: "0%",
  mount_on: "?",
}).poll(2000, "./script/disk.sh", (out) => JSON.parse(out));

const actions = {
  [Astal.MouseButton.MIDDLE]: () => subprocess("missioncenter"),
};

class ProgressBar extends astalify(Gtk.ProgressBar) {
  static {
    GObject.registerClass(this);
  }

  constructor(
    props: ConstructProps<ProgressBar, Gtk.ProgressBar.ConstructorProps, {}>,
  ) {
    super(props as any);
  }
}

export default () => (
  <eventbox
    onClickRelease={(_, { button }) => actions[button]?.()}
    tooltipMarkup={Variable.derive(
      [cpu, ram, temp, disk],
      (cpu, ram, temp, { used, size, mount_on, use }) => ` CPU : ${cpu}%
 RAM : ${ram.toFixed(1)}%
 TEMP: ${temp.cpu}°C(CPU) / ${temp.gpu}°C(GPU)
 DISK: ${used} used out of ${size} on ${mount_on} (${use})`,
    )()}
  >
    <box spacing={8}>
      <icon icon="preferences-desktop-display-symbolic" />
      <box vertical={true} valign={Gtk.Align.CENTER}>
        <ProgressBar
          className={cpu((v) => level(v, 50, 80))}
          fraction={cpu((v) => v / 100)}
        />
        <ProgressBar
          className={ram((v) => level(v, 70, 90))}
          fraction={ram((v) => v / 100)}
        />
        <ProgressBar
          className={temp(({ cpu }) => level(cpu, 70, 90))}
          fraction={temp(({ cpu }) => cpu / 100)}
        />
        <ProgressBar
          className={disk(({ use }) => level(parseInt(use), 80, 90))}
          fraction={disk(({ use }) => parseInt(use) / 100)}
        />
      </box>
    </box>
  </eventbox>
);
