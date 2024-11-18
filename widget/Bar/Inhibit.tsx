import { exec, GLib, subprocess, Variable } from "astal";
import Astal from "gi://Astal";

interface Inhibit {
  pid?: number;
  what?: string;
}

const configDir = GLib.get_user_config_dir() + "/ags";
const refresh = () =>
  JSON.parse(exec(`${configDir}/script/inhibit.sh`) || "{}") as Inhibit;
const kill = () => exec(`kill ${inhibit.get().pid}`);
const create = (what: string) =>
  subprocess(
    `systemd-inhibit --what=${what} --who=Ags --why='Manual inhibit ${what}' sleep infinity`,
  );

const inhibit = Variable(refresh());

const actions = {
  [Astal.MouseButton.PRIMARY]: () => {
    if (inhibit.get().what === "idle") {
      kill();
    } else if (inhibit.get().what === "sleep") {
      kill();
      create("idle");
    } else {
      create("sleep");
    }
    exec("sleep 0.1");
    inhibit.set(refresh());
  },
};

export default () => (
  <eventbox
    onClickRelease={(_, { button }) => actions[button]?.()}
    tooltipText={inhibit(({ what }) => `Inhibit ${what || "off"}`)}
    className={inhibit(({ what }) => what || "")}
  >
    <icon icon="preferences-desktop-screensaver-symbolic" />
  </eventbox>
);
