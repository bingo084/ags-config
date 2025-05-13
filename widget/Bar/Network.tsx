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

const tooltipMarkup = Variable.derive(
  [
    bind(wifi, "ssid"),
    bind(wifi, "strength"),
    bind(wifi, "device"),
    bind(wifi.device, "bitrate"),
    bind(wifi, "activeConnection"),
  ],
  (ssid, strength, device, bitrate, conn) => `<b>Wi-Fi</b>
  <span color="dimgrey">SSID</span>     ${ssid} ${getIcon(strength)} ${strength}%
  <span color="dimgrey">MAC</span>      ${device.permHwAddress}
  <span color="dimgrey">Driver</span>   ${device.driver}
  <span color="dimgrey">Speed</span>    ${bitrate / 1000} Mbps
<b>IPv4</b>
  <span color="dimgrey">IP</span>       ${conn.ip4Config
    .get_addresses()
    .map((a) => a.get_address() + "/" + a.get_prefix())
    .join(", ")}
  <span color="dimgrey">Gateway</span>  ${conn.ip4Config.gateway}
  <span color="dimgrey">DNS</span>      ${conn.ip4Config.nameservers.join(", ")}
<b>IPv6</b>
  <span color="dimgrey">IP</span>       ${conn.ip6Config
    .get_addresses()
    .map((a) => a.get_address() + "/" + a.get_prefix())
    .join(", ")}`,
);

export default () => (
  <box onButtonReleased={(_, state) => actions[state.get_button()]?.()}>
    <image iconName={iconName()} tooltipMarkup={tooltipMarkup()} />
  </box>
);
