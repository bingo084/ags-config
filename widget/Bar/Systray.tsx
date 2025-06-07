import Tray from "gi://AstalTray";
import { bind } from "astal";
import { Gtk } from "astal/gtk4";

const tray = Tray.get_default();

export default () =>
  bind(tray, "items").as((items) =>
    items
      .filter((item) => item.gicon)
      .map((item) => (
        <menubutton
          setup={(self) => {
            self.insert_action_group("dbusmenu", item.actionGroup);
            self.popover.set_has_arrow(false);
          }}
          tooltipMarkup={bind(item, "tooltipMarkup")}
          popover={Gtk.PopoverMenu.new_from_model_full(
            item.menuModel,
            Gtk.PopoverMenuFlags.NESTED,
          )}
          onButtonReleased={(self, state) => {
            const [_, x, y] = state.get_position();
            const button = state.get_button();
            if (button === 1) {
              self.popdown();
              item.activate(x, y);
            } else if (button === 3) {
              self.popup();
            }
          }}
        >
          <image gicon={bind(item, "gicon")} />
        </menubutton>
      )),
  );
