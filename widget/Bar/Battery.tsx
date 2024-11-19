import Battery from "gi://AstalBattery";
import { bind } from "astal/binding";
import { Variable } from "astal";

const battery = Battery.get_default();
const charging = bind(battery, "charging");
const percentage = bind(battery, "percentage");

const level = (v: number, l1: number, l2: number) =>
  v < l1 ? "critical" : v < l2 ? "warning" : "";
const className = Variable.derive(
  [charging, percentage],
  (c, p) => `battery ${c ? "charging" : level(p, 0.2, 0.4)}`,
);

const formatTime = (second: number) =>
  `${Math.floor(second / 3600)} h ${Math.floor((second % 3600) / 60)} m`;
const toolTip = Variable.derive(
  [bind(battery, "timeToEmpty"), bind(battery, "timeToFull"), charging],
  (t1, t2, c) => `Time to ${c ? "full" : "empty"}: ${formatTime(c ? t2 : t1)}`,
);

export default () => (
  <box
    className={className()}
    visible={bind(battery, "isPresent")}
    tooltipText={toolTip()}
  >
    <icon icon={bind(battery, "batteryIconName")} />
    <label label={percentage.as((p) => ` ${(p * 100).toFixed(0)}%`)} />
  </box>
);
