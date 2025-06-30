import { Gdk, Gtk } from "ags/gtk4";
import Brightness from "../../lib/brightness";
import { createBinding } from "ags";

const brightness = Brightness.get_default();

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

export default (gdkmonitor: Gdk.Monitor) => (
  <button visible={gdkmonitor.connector === "eDP-1"}>
    <Gtk.EventControllerScroll
      flags={Gtk.EventControllerScrollFlags.VERTICAL}
      onScroll={(_, __, dy) => {
        brightness.screen = brightness.screen - dy / 100;
      }}
    />
    <label
      label={createBinding(brightness, "screen").as(
        (v) => `${getIcon(v)}  ${Math.round(v * 100)}%`,
      )}
    />
  </button>
);
