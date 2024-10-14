export default Widget.Button({
  onClicked: () => Utils.subprocess("rofi -show"),
  child: Widget.Icon("system-search"),
});
