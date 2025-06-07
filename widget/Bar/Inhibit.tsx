import { exec, subprocess, Variable } from "astal";
import { Gtk } from "astal/gtk4";

interface Inhibit {
  pid?: number;
  what: string;
}

const refresh = () => JSON.parse(exec("./script/inhibit.sh")) as Inhibit;
const kill = () => exec(`kill ${inhibit.get().pid}`);
const create = (what: string) =>
  subprocess(
    `systemd-inhibit --what=${what} --who=Ags --why='Manual inhibit ${what}' sleep infinity`,
  );

const inhibit = Variable(refresh());

const actions: Record<number, (widget: Gtk.MenuButton) => void> = {
  3: (self) => {
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
    self.popup();
  },
};

export default () => (
  <menubutton
    onButtonReleased={(self, state) => {
      actions[state.get_button()]?.(self);
    }}
  >
    <image
      iconName="coffee-symbolic"
      cssClasses={inhibit(({ what }) => [`${what}`])}
    />
    <popover hasArrow={false}>
      <label label={inhibit(({ what }) => `Inhibit ${what}`)} />
    </popover>
  </menubutton>
);
