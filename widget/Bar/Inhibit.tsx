import { exec, subprocess, Variable } from "astal";
import { App, Astal } from "astal/gtk3";

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
  >
    <icon icon={inhibit(({ what }) => `coffee-${what}`)} />
  </eventbox>
);
