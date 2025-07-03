import { Gdk, Gtk } from "ags/gtk4";
import Brightness from "../../libs/brightness";
import { createBinding } from "ags";
import { MonitorProps } from ".";

const brightness = Brightness.get_default();
const screen = createBinding(brightness, "screen");

const icons = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];
const getIcon = (v: number) => icons[Math.round(v * (icons.length - 1))];

export default ({ gdkmonitor }: MonitorProps) => (
  <menubutton visible={gdkmonitor.connector === "eDP-1"}>
    <Gtk.EventControllerScroll
      flags={Gtk.EventControllerScrollFlags.VERTICAL}
      onScroll={(_, __, dy) => {
        brightness.screen = brightness.screen - dy / 100;
      }}
    />
    <label label={screen((v) => `${getIcon(v)}  ${Math.round(v * 100)}%`)} />
    <popover hasArrow={false}>
      <slider
        widthRequest={260}
        onChangeValue={(_, __, value) => {
          brightness.screen = value;
        }}
        value={screen}
      />
    </popover>
  </menubutton>
);
