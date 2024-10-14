const battery = await Service.import("battery");

export default Widget.Box({
  classNames: battery
    .bind("charging")
    .as((ch) => (ch ? ["battery", "charging"] : ["battery"])),
  visible: battery.bind("available"),
  tooltipText: battery
    .bind("time_remaining")
    .as(
      (s) =>
        `Time to ${battery.charging ? "full" : "empty"}: ${Math.floor(s / 3600)} h ${Math.floor((s % 3600) / 60)} m`,
    ),
  children: [
    Widget.Icon({ icon: battery.bind("icon_name") }),
    Widget.Label({
      label: battery.bind("percent").as((b) => " " + b + "%"),
    }),
  ],
});
