import Tray from "gi://AstalTray";
import { bind } from "astal";

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
            actionGroup={bind(item, "action-group").as((ag) => [
              "dbusmenu",
              ag,
            ])}
            menuModel={bind(item, "menu-model")}
          >
            <icon gicon={bind(item, "gicon")} />
          </menubutton>
        )),
    )}
  </box>
);
