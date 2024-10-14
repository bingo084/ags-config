const bluetooth = await Service.import("bluetooth");
const deviceMap = {
  "input-keyboard": "󰌌",
  "input-mouse": "󰍽",
  "audio-headset": "󱡏",
};
const icons = ["󰂃", "󰁺", "󰁻", "󰁼", "󰁽", "󰁾", "󰁿", "󰂀", "󰂁", "󰂂", "󰁹"];
const icon = (v: number, icons: string[]) =>
  icons[Math.round((v / 100) * (icons.length - 1))];

export default Widget.EventBox({
  onPrimaryClickRelease: () => (bluetooth.enabled = !bluetooth.enabled),
  onMiddleClickRelease: () => Utils.subprocess("blueman-manager"),
  child: Widget.Icon().hook(bluetooth, (self) => {
    const maxName = Math.max(
      ...bluetooth.connected_devices.map(({ name }) => name.length),
    );
    self.tooltipMarkup = bluetooth.connected_devices
      .map(({ icon_name, name, battery_percentage }) => {
        const deviceIcon = deviceMap[icon_name] || "";
        const paddedName = name.padEnd(maxName + 2);
        const batteryColor = battery_percentage <= 20 ? 'color="red"' : "";
        const batteryIcon = icon(battery_percentage, icons);
        return `${deviceIcon} ${paddedName}<span ${batteryColor}>${batteryIcon} ${battery_percentage}%</span>`;
      })
      .join("\n");
    self.icon = `bluetooth-${bluetooth.enabled ? "active" : "disabled"}-symbolic`;
  }),
});
