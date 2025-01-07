import Astal from "gi://Astal";
import { GLib, Variable } from "astal";
import { App } from "astal/gtk3";

const format = Variable("R");
const dateTime = Variable<GLib.DateTime | null>(null).poll(1000, () =>
  GLib.DateTime.new_now_local(),
);
const dateTimeStr = Variable.derive(
  [dateTime, format],
  (time, format) => time?.format(`%a, %b %d, %${format}`) || "",
);

const actions = {
  [Astal.MouseButton.PRIMARY]: () => App.toggle_window("calendar"),
  [Astal.MouseButton.MIDDLE]: () =>
    format.set(format.get() === "R" ? "T" : "R"),
};

export default () => (
  <eventbox
    onClickRelease={(_, { button }) => actions[button]?.()}
  >
    <label label={dateTimeStr()} />
  </eventbox>
);
