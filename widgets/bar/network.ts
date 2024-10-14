const network = await Service.import("network");
const icons = ["󰢿", "󰢼", "󰢽", "󰢾"];
const signalIcon = (v: number, icons: string[]) =>
  icons[Math.round((v / 100) * (icons.length - 1))];

export default Widget.EventBox({
  onMiddleClickRelease: () => Utils.subprocess("nm-applet"),
  child: Widget.Icon().hook(network, (self) => {
    const icon = network[network.primary || "wifi"]?.icon_name;
    self.icon = icon || "";
    self.visible = !!icon;
    const { ssid, strength } = network.wifi;
    self.tooltip_text = ssid
      ? `${ssid}  ${signalIcon(strength, icons)} ${strength}%`
      : "";
  }),
});
