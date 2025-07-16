import { createComputed, createState } from "ags";
import { Gtk } from "ags/gtk4";
import { createPoll } from "ags/time";
import GLib from "gi://GLib";

const [format, setFormat] = createState("R");
const dateTime = createPoll(null, 1000, () => GLib.DateTime.new_now_local());
const dateTimeStr = createComputed(
  [dateTime, format],
  (time, format) => time?.format(`%a, %b %d, %${format}`) || "",
);

export default () => {
  const calendar = new Gtk.Calendar();

  return (
    <emenubutton
      onLeftUp={(self) => {
        calendar.select_day(GLib.DateTime.new_now_local());
        self.popup();
      }}
      onRightUp={() => setFormat(format.get() === "R" ? "T" : "R")}
    >
      <box spacing={4}>
        <image iconName="x-office-calendar-symbolic" />
        <label label={dateTimeStr} />
      </box>
      <popover hasArrow={false}>{calendar}</popover>
    </emenubutton>
  );
};
