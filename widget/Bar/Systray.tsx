import { createBinding, For } from "ags";
import { Gtk } from "ags/gtk4";
import AstalTray from "gi://AstalTray";

const tray = AstalTray.get_default();
const items = createBinding(tray, "items").as((items) =>
  items.filter((item) => item.menuModel),
);

export default () => (
  <box>
    <For each={items}>
      {(item) => (
        <menubutton
          $={(self) => {
            self.insert_action_group("dbusmenu", item.actionGroup);
            item.connect("notify::action-group", () => {
              self.insert_action_group("dbusmenu", item.actionGroup);
            });
            self.popover.set_has_arrow(false);
          }}
          tooltipMarkup={createBinding(item, "tooltipMarkup")}
          popover={Gtk.PopoverMenu.new_from_model_full(
            item.menuModel,
            Gtk.PopoverMenuFlags.NESTED,
          )}
          // onButtonReleased={(self, state) => {
          //   const [_, x, y] = state.get_position();
          //   const button = state.get_button();
          //   if (button === 1) {
          //     self.popdown();
          //     item.activate(x, y);
          //   } else if (button === 3) {
          //     self.popup();
          //   }
          // }}
        >
          <image gicon={createBinding(item, "gicon")} />
        </menubutton>
      )}
    </For>
  </box>
);
