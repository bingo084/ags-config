import { createBinding } from "ags";
import { execAsync } from "ags/process";
import Bluetooth from "gi://AstalBluetooth";

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
  2: () => execAsync("blueman-manager"),
  3: () => bluetooth.toggle(),
};

export default () => (
  <menubutton
  // onButtonReleased={(_, state) => actions[state.get_button()]?.()}
  >
    <image
      iconName={createBinding(bluetooth, "isPowered").as(
        (b) => `bluetooth-${b ? "active" : "disabled"}-symbolic`,
      )}
    />
    <popover hasArrow={false}>
      <label
        useMarkup={true}
        class="nerd-font"
        label={createBinding(bluetooth, "devices").as((devices) => {
          const maxName = Math.max(
            ...bluetooth.get_devices().map(({ name }) => name.length),
          );
          return (
            devices
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
              .join("\n") || "No connected devices"
          );
        })}
      />
    </popover>
  </menubutton>
);
