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
        <emenubutton
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
          onLeftUp={(_, x, y) => item.activate(x, y)}
          onRightUp={(self) => self.popup()}
        >
          <image gicon={createBinding(item, "gicon")} />
        </emenubutton>
      )}
    </For>
  </box>
);
