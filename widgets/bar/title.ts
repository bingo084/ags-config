const hyprland = await Service.import("hyprland");

export default Widget.Label({
  className: "client-title",
  label: hyprland.active.client.bind("title"),
  visible: hyprland.active.client.bind("address").as((addr) => !!addr),
});
