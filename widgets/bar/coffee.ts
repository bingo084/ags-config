const hypridle = Variable(Utils.exec("pidof hypridle"));

export default Widget.EventBox({
  className: "coffee",
  onPrimaryClick: () => {
    hypridle.value
      ? Utils.exec("killall hypridle")
      : Utils.subprocess("hypridle");
    hypridle.value = Utils.exec("pidof hypridle");
  },
  child: Widget.Icon({
    css: hypridle.bind().as((p) => (p ? " " : "color: red")),
    icon: "preferences-desktop-screensaver-symbolic",
  }),
});
