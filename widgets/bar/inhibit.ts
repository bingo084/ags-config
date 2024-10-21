interface Inhibit {
  pid: number;
  what: string;
}

const refresh = () =>
  JSON.parse(
    Utils.exec(App.configDir + "/scripts/inhibit.sh") || "{}",
  ) as Inhibit;

const kill = () => Utils.exec(`kill ${inhibit.value.pid}`);

const create = (what: string) =>
  Utils.subprocess(
    `systemd-inhibit --what=${what} --who=Ags --why='Manual inhibit ${what}' sleep infinity`,
  );

const inhibit = Variable(refresh());

export default Widget.EventBox({
  className: "inhibit",
  onPrimaryClickRelease: () => {
    if (inhibit.value.what === "idle") {
      kill();
    } else if (inhibit.value.what === "sleep") {
      kill();
      create("idle");
    } else {
      create("sleep");
    }
    Utils.exec("sleep 0.1")
    inhibit.value = refresh();
  },
  tooltipText: inhibit.bind().as(({ what }) => `Inhibit ${what || "off"}`),
  child: Widget.Icon({
    icon: "preferences-desktop-screensaver-symbolic",
    css: inhibit
      .bind()
      .as(({ what }) =>
        what === "idle" ? "color: red" : what === "sleep" ? "color: blue" : " ",
      ),
  }),
});
