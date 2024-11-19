import Tray from "gi://AstalTray";
import Astal from "gi://Astal";
import { bind } from "astal";
import { App, Gdk } from "astal/gtk3";

const tray = Tray.get_default();

export default () => (
  <box>
    {bind(tray, "items").as((items) =>
      items
        .filter((item) => item.gicon)
        .map((item) => {
          item.iconThemePath && App.add_icons(item.iconThemePath);
          const menu = item.create_menu();
          return (
            <button
              onClickRelease={(self, { button, x, y }) => {
                if (button === Astal.MouseButton.PRIMARY) {
                  item.activate(x, y);
                } else if (button === Astal.MouseButton.SECONDARY) {
                  menu?.popup_at_widget(
                    self,
                    Gdk.Gravity.SOUTH,
                    Gdk.Gravity.NORTH,
                    null,
                  );
                }
              }}
              onDestroy={() => menu?.destroy()}
              tooltipMarkup={bind(item, "tooltipMarkup")}
            >
              <icon gIcon={bind(item, "gicon")} />
            </button>
          );
        }),
    )}
  </box>
);
