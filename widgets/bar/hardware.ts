import { cpu, ram } from "variables";

export default Widget.EventBox({
  onMiddleClickRelease: () => Utils.subprocess("missioncenter"),
  child: Widget.Box({
    className: "hardware",
    vertical: true,
    children: [
      Widget.Label({
        className: "cpu",
        label: cpu.bind().as((v) => `${v.toFixed(0).padStart(3)}%`),
      }),
      Widget.Label({
        className: "ram",
        label: ram.bind().as((v) => `${v.toFixed(0).padStart(3)}%`),
      }),
    ],
  }),
});
