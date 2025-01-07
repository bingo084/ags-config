import { Variable } from "astal";

const format = (bps: number) => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bps >= 1000 && i < units.length - 1) {
    bps /= 1000;
    i++;
  }
  return {
    value: parseFloat(bps.toFixed(bps >= 100 ? 0 : bps >= 10 ? 1 : 2)),
    unit: `${units[i]}/s`,
  };
};

const getIcon = (rx: number, tx: number) => {
  if (tx === 0 && rx === 0) return "network-idle-symbolic";
  if (tx === rx) return "network-transmit-receive-symbolic";
  return tx > rx ? "network-transmit-symbolic" : "network-receive-symbolic";
};

const traffic = Variable({
  icon: "network-idle-symbolic",
  value: 0,
  unit: "",
  visible: false,
}).watch("./script/traffic.sh 2", (out) => {
  const { rx_bps, tx_bps } = JSON.parse(out);
  const maxBps = Math.max(tx_bps, rx_bps);
  return {
    icon: getIcon(rx_bps, tx_bps),
    ...format(maxBps),
    visible: maxBps >= 102400,
  };
});

export default () => (
  <box className="traffic" visible={traffic(({ visible }) => visible)}>
    <icon className="icon" icon={traffic(({ icon }) => icon)} />
    <label label={traffic(({ value }) => ` ${value}`)} />
    <label className="unit" label={traffic(({ unit }) => ` ${unit}`)} />
  </box>
);
