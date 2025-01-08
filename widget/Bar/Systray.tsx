import Tray from "gi://AstalTray";
import { bind } from "astal";
import Astal from "gi://Astal";
import Gdk from "gi://Gdk";

const tray = Tray.get_default();

export default () => (
  <box>
    {bind(tray, "items").as((items) =>
      items
        .filter((item) => item.gicon)
        .map((item) => (
          <menubutton
            tooltipMarkup={bind(item, "tooltipMarkup")}
            usePopover={false}
            actionGroup={bind(item, "actionGroup").as((ag) => ["dbusmenu", ag])}
            menuModel={bind(item, "menuModel")}
            onButtonReleaseEvent={(self, event) => {
              const [_, x, y] = event.get_root_coords();
              const button = event.get_button()[1];
              const { PRIMARY, SECONDARY } = Astal.MouseButton;
              const { SOUTH, NORTH } = Gdk.Gravity;
              if (button === PRIMARY) {
                item.activate(x, y);
              } else if (button === SECONDARY) {
                self.get_popup()?.popup_at_widget(self, SOUTH, NORTH, event);
              }
              return true;
            }}
          >
            <icon gicon={bind(item, "gicon")} />
          </menubutton>
        )),
    )}
  </box>
);
