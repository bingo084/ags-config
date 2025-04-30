import Network from "gi://AstalNetwork";
import { bind, subprocess, Variable } from "astal";

const { wifi, wired, primary } = Network.get_default();

const icons = ["󰢿", "󰢼", "󰢽", "󰢾"];
const getIcon = (v: number) =>
  icons[Math.round((v / 100) * (icons.length - 1))];

const actions: Record<number, () => void> = {
  2: () => subprocess("nm-applet"),
};

const iconName = Variable.derive(
  [bind(wifi, "iconName"), bind(wired, "iconName")],
  (wifi, wired) => (primary == Network.Primary.WIRED ? wired : wifi),
);
const tooltipText = Variable.derive(
  [bind(wifi, "ssid"), bind(wifi, "strength")],
  (ssid, strength) => ssid && `${ssid}  ${getIcon(strength)} ${strength}%`,
);

export default () => (
  <box onButtonReleased={(_, state) => actions[state.get_button()]?.()}>
    <image iconName={iconName()} tooltipText={tooltipText()} />
  </box>
);
