import { createBinding, createComputed } from "ags";
import { execAsync } from "ags/process";
import Network from "gi://AstalNetwork";

const { wifi, wired, primary } = Network.get_default();

const icons = ["󰢿", "󰢼", "󰢽", "󰢾"];
const getIcon = (v: number) =>
  icons[Math.round((v / 100) * (icons.length - 1))];

const iconName = createComputed(
  [createBinding(wifi, "iconName"), createBinding(wired, "iconName")],
  (wifi, wired) => (primary == Network.Primary.WIRED ? wired : wifi),
);

const label = createComputed(
  [
    createBinding(wifi, "ssid"),
    createBinding(wifi, "strength"),
    createBinding(wifi, "device"),
    createBinding(wifi, "activeConnection"),
  ],
  (ssid, strength, device, conn) => `<b>Wi-Fi</b>
  <span color="dimgrey">SSID</span>     ${ssid} ${getIcon(strength)} ${strength}%
  <span color="dimgrey">MAC</span>      ${device.permHwAddress}
  <span color="dimgrey">Driver</span>   ${device.driver}
  <span color="dimgrey">Speed</span>    ${device.bitrate / 1000} Mbps
<b>IPv4</b>
  <span color="dimgrey">IP</span>       ${conn?.ip4Config
    ?.get_addresses()
    .map((a) => a.get_address() + "/" + a.get_prefix())
    .join(", ")}
  <span color="dimgrey">Gateway</span>  ${conn?.ip4Config?.gateway}
  <span color="dimgrey">DNS</span>      ${conn?.ip4Config?.nameservers.join(", ")}
<b>IPv6</b>
  <span color="dimgrey">IP</span>       ${conn?.ip6Config
    ?.get_addresses()
    .map((a) => a.get_address() + "/" + a.get_prefix())
    .join(", ")}`,
);

export default () => (
  <emenubutton onMiddleUp={() => execAsync("nm-applet")}>
    <image pixelSize={14} iconName={iconName} />
    <popover hasArrow={false}>
      <label useMarkup={true} class="nerd-font" label={label} />
    </popover>
  </emenubutton>
);
