const refresh = () => {
  const pid = Utils.exec("pidof hypridle");
  const suspend = pid
    ? !Utils.exec(["bash", "-c", `ps -p ${pid} -o cmd | grep nosuspend`])
    : false;
  return { pid, suspend };
};
const status = Variable(refresh());

export default Widget.EventBox({
  className: "coffee",
  onPrimaryClickRelease: () => {
    const { pid, suspend } = status.value;
    if (pid) {
      Utils.exec("killall hypridle");
      if (suspend) {
        Utils.subprocess(
          "bash -c 'hypridle -c ~/.config/hypr/hypridle-nosuspend.conf'",
        );
      }
    } else {
      Utils.subprocess("hypridle");
    }
    status.value = refresh();
  },
  tooltipText: status
    .bind()
    .as(({ pid, suspend }) =>
      pid ? (suspend ? "Auto suspend" : "No suspend") : "Always on",
    ),
  child: Widget.Icon({
    css: status
      .bind()
      .as(({ pid, suspend }) =>
        pid ? (suspend ? " " : "color: blue") : "color: red",
      ),
    icon: "preferences-desktop-screensaver-symbolic",
  }),
});
