import { GObject, subprocess, Variable } from "astal";
import { Astal, astalify, ConstructProps, Gtk } from "astal/gtk3";
import GTop from "gi://GTop";

const level = (v: number, l1: number, l2: number) =>
  v < l1 ? "" : v < l2 ? "warning" : "critical";

const ram = Variable(0).poll(2000, () => {
  const memory = new GTop.glibtop_mem();
  GTop.glibtop_get_mem(memory);
  return (memory.user / memory.total) * 100;
});

const cpu = Variable.derive(
  [
    Variable({ used: 0, total: 0, load: 0 }).poll(
      2000,
      ({ used: lastUsed, total: lastTotal }) => {
        const cpu = new GTop.glibtop_cpu();
        GTop.glibtop_get_cpu(cpu);

        const used = cpu.user + cpu.sys + cpu.nice + cpu.irq + cpu.softirq;
        const total = used + cpu.idle + cpu.iowait;

        const diffUsed = used - lastUsed;
        const diffTotal = total - lastTotal;

        return {
          used,
          total,
          load: diffTotal > 0 ? (diffUsed / diffTotal) * 100 : 0,
        };
      },
    ),
  ],
  ({ load }) => load,
);

const temp = Variable({ cpu: 0, gpu: 0 }).watch("./script/temp.sh 2", (out) =>
  JSON.parse(out),
);
const disk = Variable({
  size: "0G",
  used: "0G",
  use: "0%",
  mount_on: "?",
}).poll(2000, () => {
  const fsusage = new GTop.glibtop_fsusage();
  GTop.glibtop_get_fsusage(fsusage, "/");

  const size = fsusage.blocks * fsusage.block_size;
  const used = (fsusage.blocks - fsusage.bfree) * fsusage.block_size;
  const use = size > 0 ? (used / size) * 100 : 0;

  return {
    size: `${(size / 1024 ** 3).toFixed(0)}G`,
    used: `${(used / 1024 ** 3).toFixed(0)}G`,
    use: `${use.toFixed(0)}%`,
    mount_on: "/",
  };
});

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
      (
        cpu,
        ram,
        temp,
        { used, size, mount_on, use },
      ) => ` CPU : ${cpu.toFixed(1)}%
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
