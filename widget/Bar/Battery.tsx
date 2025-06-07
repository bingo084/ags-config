import Battery from "gi://AstalBattery";
import { bind } from "astal/binding";
import { Variable } from "astal";

const battery = Battery.get_default();
const timeToEmpty = bind(battery, "timeToEmpty");
const timeToFull = bind(battery, "timeToFull");
const charging = bind(battery, "charging");
const percentage = bind(battery, "percentage");

const formatTime = (second: number) =>
  `${Math.floor(second / 3600)} h ${Math.floor((second % 3600) / 60)} m`;
const toolTip = Variable.derive(
  [timeToEmpty, timeToFull, charging],
  (t1, t2, c) => `Time to ${c ? "full" : "empty"}: ${formatTime(c ? t2 : t1)}`,
);

export default () => (
  <menubutton visible={bind(battery, "isPresent")}>
    <box>
      <image iconName={bind(battery, "batteryIconName")} />
      <label label={percentage.as((p) => ` ${(p * 100).toFixed(0)}%`)} />
    </box>
    <popover hasArrow={false}>
      <label label={toolTip()} />
    </popover>
  </menubutton>
);
