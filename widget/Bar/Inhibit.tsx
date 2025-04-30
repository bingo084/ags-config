import { exec, subprocess, Variable } from "astal";
import { App } from "astal/gtk4";

interface Inhibit {
  pid?: number;
  what?: string;
}

App.add_icons("./asset/icon/coffee");

const refresh = () => JSON.parse(exec("./script/inhibit.sh")) as Inhibit;
const kill = () => exec(`kill ${inhibit.get().pid}`);
const create = (what: string) =>
  subprocess(
    `systemd-inhibit --what=${what} --who=Ags --why='Manual inhibit ${what}' sleep infinity`,
  );

const inhibit = Variable(refresh());

const actions: Record<number, () => void> = {
  1: () => {
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
  <box
    onButtonReleased={(_, state) => actions[state.get_button()]?.()}
    tooltipText={inhibit(({ what }) => `Inhibit ${what || "off"}`)}
  >
    <image iconName={inhibit(({ what }) => `coffee-${what}`)} />
  </box>
);
