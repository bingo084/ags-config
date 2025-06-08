import { GLib, Variable } from "astal";
import { Gtk } from "astal/gtk4";

const format = Variable("R");
const dateTime = Variable<GLib.DateTime | null>(null).poll(1000, () =>
  GLib.DateTime.new_now_local(),
);
const dateTimeStr = Variable.derive(
  [dateTime, format],
  (time, format) => time?.format(` %a, %b %d, %${format}`) || "",
);

export default () => {
  const calendar = new Gtk.Calendar();
  const actions: Record<number, () => void> = {
    1: () => calendar.select_day(GLib.DateTime.new_now_local()),
    2: () => format.set(format.get() === "R" ? "T" : "R"),
  };

  return (
    <menubutton
      onButtonReleased={(_, state) => actions[state.get_button()]?.()}
    >
      <box>
        <image iconName="x-office-calendar-symbolic" />
        <label label={dateTimeStr()} />
      </box>
      <popover hasArrow={false}>{calendar}</popover>
    </menubutton>
  );
};
