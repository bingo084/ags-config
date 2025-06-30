import { createComputed, createState } from "ags";
import { Gtk } from "ags/gtk4";
import { createPoll } from "ags/time";
import GLib from "gi://GLib";

const [format, setFormat] = createState("R");
const dateTime = createPoll(null, 1000, () => GLib.DateTime.new_now_local());
const dateTimeStr = createComputed(
  [dateTime, format],
  (time, format) => time?.format(` %a, %b %d, %${format}`) || "",
);

export default () => {
  const calendar = new Gtk.Calendar();
  const actions: Record<number, () => void> = {
    1: () => calendar.select_day(GLib.DateTime.new_now_local()),
    2: () => setFormat(format.get() === "R" ? "T" : "R"),
  };

  return (
    <menubutton
    // onButtonReleased={(_, state) => actions[state.get_button()]?.()}
    >
      <box>
        <image iconName="x-office-calendar-symbolic" />
        <label label={dateTimeStr} />
      </box>
      <popover hasArrow={false}>{calendar}</popover>
    </menubutton>
  );
};
