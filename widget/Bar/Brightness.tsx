import Brightness from "../../lib/brightness";
import Hyprland from "gi://AstalHyprland";
import { bind } from "astal/binding";
import { Gdk } from "astal/gtk3";

const brightness = Brightness.get_default();
const hyprland = Hyprland.get_default();

const chageBrightness = (deltaY: number) => {
  const step = deltaY == 0 ? 0 : deltaY < 0 ? 0.01 : -0.01;
  brightness.screen = brightness.screen + step;
};

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
  <eventbox
    onScroll={(_, { delta_y }) => chageBrightness(delta_y)}
    visible={gdkmonitor.manufacturer === "BOE"}
  >
    <label
      label={bind(brightness, "screen").as(
        (v) => `${getIcon(v)}  ${Math.round(v * 100)}%`,
      )}
    />
  </eventbox>
);
