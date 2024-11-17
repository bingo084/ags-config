import Brightness from "../../lib/brightness";
import Hyprland from "gi://AstalHyprland";
import { bind } from "astal/binding";

const brightness = Brightness.get_default();
const hyprland = Hyprland.get_default();

const chageBrightness = (deltaY: number) => {
  const step = deltaY == 0 ? 0 : deltaY > 0 ? 0.01 : -0.01;
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

export default () => (
  <eventbox
    onScroll={(_, { delta_y }) => chageBrightness(delta_y)}
    visible={bind(hyprland, "monitors").as(
      (monitors) => !!monitors.find((monitor) => monitor.name === "eDP-1"),
    )}
  >
    <label
      label={bind(brightness, "screen").as(
        (v) => `${getIcon(v)}  ${Math.round(v * 100)}%`,
      )}
    />
  </eventbox>
);
