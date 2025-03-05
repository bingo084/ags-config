import { Variable } from "astal";
import GTop from "gi://GTop";

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

const isValidInterface = (interfaceName: string) =>
  !/^$|lo|veth|tun|tap|docker|br-|meta/.test(interfaceName.toLowerCase());

const traffic = Variable.derive(
  [
    Variable({
      in: 0,
      out: 0,
      traffic: {
        icon: "network-idle-symbolic",
        value: 0,
        unit: "",
        visible: false,
      },
    }).poll(2000, ({ in: lastIn, out: lastOut }) => {
      const netlist = GTop.glibtop_get_netlist(new GTop.glibtop_netlist());
      let totalIn = 0;
      let totalOut = 0;
      netlist.filter(isValidInterface).forEach((_interface) => {
        const netload = new GTop.glibtop_netload();
        GTop.glibtop_get_netload(netload, _interface);
        totalIn += netload.bytes_in;
        totalOut += netload.bytes_out;
      });

      const diffIn = lastIn === 0 ? 0 : (totalIn - lastIn) / 2;
      const diffOut = lastOut === 0 ? 0 : (totalOut - lastOut) / 2;
      const maxBps = Math.max(diffIn, diffOut);

      return {
        in: totalIn,
        out: totalOut,
        traffic: {
          icon: getIcon(diffIn, diffOut),
          ...format(maxBps),
          visible: maxBps >= 102400,
        },
      };
    }),
  ],
  ({ traffic }) => traffic,
);

export default () => (
  <box className="traffic" visible={traffic(({ visible }) => visible)}>
    <icon className="icon" icon={traffic(({ icon }) => icon)} />
    <label label={traffic(({ value }) => ` ${value}`)} />
    <label className="unit" label={traffic(({ unit }) => ` ${unit}`)} />
  </box>
);
