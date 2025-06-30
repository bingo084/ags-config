import { createComputed } from "ags";
import { Gtk } from "ags/gtk4";
import { subprocess } from "ags/process";
import { createPoll } from "ags/time";
import GTop from "gi://GTop";

const ram = createPoll(0, 2000, () => {
  const memory = new GTop.glibtop_mem();
  GTop.glibtop_get_mem(memory);
  return (memory.user / memory.total) * 100;
});

const cpu = createComputed(
  [
    createPoll(
      { used: 0, total: 0, load: 0 },
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
const cpuTemp = createPoll(0, 2000, ["sensors", "-A"], (out) => {
  const match = out.match(/Package id 0:\s+\+?([\d\.]+)/);
  return match?.[1] ? Math.round(parseFloat(match[1])) : 0;
});
const gpuTemp = createPoll("", 2000, [
  "nvidia-smi",
  "--query-gpu=temperature.gpu",
  "--format=csv,noheader,nounits",
]);
const disk = createPoll(
  {
    size: "0G",
    used: "0G",
    use: "0%",
    mount_on: "?",
  },
  2000,
  () => {
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
  },
);

const actions: Record<number, () => void> = {
  2: () => subprocess("missioncenter"),
};

export default () => (
  <menubutton
  // onButtonReleased={(_, state) => actions[state.get_button()]?.()}
  >
    <box spacing={8}>
      <image iconName="preferences-desktop-display-symbolic" />
      <box orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.CENTER}>
        {[
          { value: cpu, offsets: [50, 80] },
          { value: ram, offsets: [70, 90] },
          { value: cpuTemp, offsets: [70, 90] },
          { value: disk(({ use }) => parseInt(use)), offsets: [80, 90] },
        ].map(({ value, offsets }) => (
          <levelbar
            minValue={0}
            maxValue={100}
            value={value}
            $={(self) => {
              ["normal", "warning", "critical"].forEach((state, idx) =>
                self.add_offset_value(state, [...offsets, 100][idx]),
              );
            }}
          />
        ))}
      </box>
    </box>
    <popover hasArrow={false}>
      <label
        useMarkup={true}
        class="nerd-font"
        label={createComputed(
          [cpu, ram, cpuTemp, gpuTemp, disk],
          (
            cpu,
            ram,
            cpuTemp,
            gpuTemp,
            { used, size, mount_on, use },
          ) => ` CPU : ${cpu.toFixed(1)}%
 RAM : ${ram.toFixed(1)}%
 TEMP: ${cpuTemp}°C(CPU) / ${gpuTemp}°C(GPU)
 DISK: ${used} used out of ${size} on ${mount_on} (${use})`,
        )}
      />
    </popover>
  </menubutton>
);
