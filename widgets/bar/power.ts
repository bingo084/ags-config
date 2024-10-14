export default Widget.Button({
  onClicked: () => Utils.subprocess("wlogout"),
  child: Widget.Icon("system-shutdown"),
});
