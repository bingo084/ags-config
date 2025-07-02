import { createState } from "ags";
import { Gtk } from "ags/gtk4";
import { exec } from "ags/process";

interface Inhibit {
  pid?: number;
  what: string;
}

const refresh = () => JSON.parse(exec("./script/inhibit.sh")) as Inhibit;
const kill = () => exec(`kill ${inhibit.get().pid}`);
const create = (what: string) =>
  exec(
    `systemd-inhibit --what=${what} --who=Ags --why='Manual inhibit ${what}' sleep infinity`,
  );

const [inhibit, setInhibit] = createState(refresh());

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
    setInhibit(refresh());
    self.popup();
  },
};

export default () => (
  <menubutton
  // onButtonReleased={(self, state) => {
  //   actions[state.get_button()]?.(self);
  // }}
  >
    <image iconName="coffee-symbolic" class={inhibit(({ what }) => what)} />
    <popover hasArrow={false}>
      <label label={inhibit(({ what }) => `Inhibit ${what}`)} />
    </popover>
  </menubutton>
);
