import Bluetooth from "gi://AstalBluetooth";
import { bind, subprocess } from "astal";

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

const actions: Record<number, () => void> = {
  1: () => bluetooth.toggle(),
  2: () => subprocess("blueman-manager"),
};

export default () => (
  <box onButtonReleased={(_, state) => actions[state.get_button()]?.()}>
    <image
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
      iconName={bind(bluetooth, "isPowered").as(
        (b) => `bluetooth-${b ? "active" : "disabled"}-symbolic`,
      )}
    />
  </box>
);
