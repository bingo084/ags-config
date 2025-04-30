import { GLib, Variable } from "astal";
import { App } from "astal/gtk4";

const format = Variable("R");
const dateTime = Variable<GLib.DateTime | null>(null).poll(1000, () =>
  GLib.DateTime.new_now_local(),
);
const dateTimeStr = Variable.derive(
  [dateTime, format],
  (time, format) => time?.format(`%a, %b %d, %${format}`) || "",
);

const actions: Record<number, () => void> = {
  1: () => App.toggle_window("calendar"),
  2: () => format.set(format.get() === "R" ? "T" : "R"),
};

export default () => (
  <box onButtonReleased={(_, state) => actions[state.get_button()]?.()}>
    <label label={dateTimeStr()} />
  </box>
);
