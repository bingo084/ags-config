import Gio from "gi://Gio";

interface Inhibit {
  who: string;
  pid: number;
  what: string;
}

const refresh = () =>
  Utils.exec(
    App.configDir + "/scripts/inhibit.sh",
    (out) => JSON.parse(out) as Inhibit[],
  );
const inhibits = Variable(refresh());

const idle =
  "systemd-inhibit --what=idle --who=Ags --why='Manual Inhibit Idle' sleep infinity";
const sleep =
  "systemd-inhibit --what=sleep --who=Ags --why='Manual Inhibit Sleep' sleep infinity";
let currentInhibit: Gio.Subprocess;

export default Widget.EventBox({
  className: "inhibit",
  onPrimaryClickRelease: () => {
    inhibits.value = refresh();
  },
  tooltipText: inhibits.bind().as((what) => `Inhibit ${what || "off"}`),
  child: Widget.Icon({
    css: inhibits
      .bind()
      .as((what) =>
        what ? (what === "idle" ? "color: red" : "color: blue") : " ",
      ),
    icon: "preferences-desktop-screensaver-symbolic",
  }),
});
