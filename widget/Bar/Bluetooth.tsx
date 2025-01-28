import Astal from "gi://Astal";
import Bluetooth from "gi://AstalBluetooth";
import { subprocess } from "astal/process";
import { bind } from "astal/binding";

const bluetooth = Bluetooth.get_default();

const deviceMap: Record<string, string> = {
  "input-keyboard": "󰌌",
  "input-mouse": "󰍽",
  "audio-headset": "",
  "audio-headphones": "",
};

const icons = ["󰂃", "󰁺", "󰁻", "󰁼", "󰁽", "󰁾", "󰁿", "󰂀", "󰂁", "󰂂", "󰁹"];
const getIcon = (v: number) =>
  icons[Math.round((v / 100) * (icons.length - 1))];

const actions = {
  [Astal.MouseButton.PRIMARY]: () => bluetooth.toggle(),
  [Astal.MouseButton.MIDDLE]: () => subprocess("blueman-manager"),
};

export default () => (
  <eventbox onClickRelease={(_, { button }) => actions[button]?.()}>
    <icon
      tooltipMarkup={bind(bluetooth, "devices").as((devices) => {
        const maxName = Math.max(
          ...bluetooth.get_devices().map(({ name }) => name.length),
        );
        return devices
          .filter(({ connected }) => connected)
          .map(({ icon, name, batteryPercentage }) => {
            // if name contains pods, then it's an airpod
            const deviceIcon = name.toLowerCase().includes("pods")
              ? "󱡏"
              : deviceMap[icon] || "";
            const paddedName = name.padEnd(maxName + 2);
            const batteryColor = 100 <= 20 ? 'color="red"' : "";
            const batteryIcon = getIcon(batteryPercentage);
            return `${deviceIcon} ${paddedName}<span ${batteryColor}>${batteryIcon} ${batteryPercentage}%</span>`;
          })
          .join("\n");
      })}
      icon={bind(bluetooth, "isPowered").as(
        (b) => `bluetooth-${b ? "active" : "disabled"}-symbolic`,
      )}
    />
  </eventbox>
);
