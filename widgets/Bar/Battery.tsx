import { createBinding, createComputed } from "ags";
import AstalBattery from "gi://AstalBattery";

const battery = AstalBattery.get_default();
const timeToEmpty = createBinding(battery, "timeToEmpty");
const timeToFull = createBinding(battery, "timeToFull");
const charging = createBinding(battery, "charging");
const isPresent = createBinding(battery, "isPresent");
const icon = createBinding(battery, "batteryIconName");
const percent = createBinding(battery, "percentage");

const formatTime = (second: number) =>
  `${Math.floor(second / 3600)} h ${Math.floor((second % 3600) / 60)} m`;
const toolTip = createComputed(
  [timeToEmpty, timeToFull, charging],
  (t1, t2, c) => `Time to ${c ? "full" : "empty"}: ${formatTime(c ? t2 : t1)}`,
);

export default () => (
  <emenubutton visible={isPresent}>
    <box>
      <image iconName={icon} />
      <label label={percent((p) => ` ${Math.round(p * 100)}%`)} />
    </box>
    <popover hasArrow={false}>
      <label label={toolTip} />
    </popover>
  </emenubutton>
);
