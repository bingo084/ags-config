import Brightness from "../../lib/brightness";
import { bind } from "astal";
import { Gdk } from "astal/gtk4";

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
  <box
    onScroll={(_, __, dy) => (brightness.screen = brightness.screen - dy / 100)}
    visible={gdkmonitor.manufacturer === "BOE"}
  >
    <label
      label={bind(brightness, "screen").as(
        (v) => `${getIcon(v)}  ${Math.round(v * 100)}%`,
      )}
    />
  </box>
);
