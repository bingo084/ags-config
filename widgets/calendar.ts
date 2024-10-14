export default Widget.Window({
  name: "calendar",
  anchor: ["top", "right"],
  visible: false,
  keymode: "on-demand",
  child: Widget.Calendar({}),
  setup: (self) => {
    self.keybind("Escape", () => App.closeWindow("calendar"));
  },
});
