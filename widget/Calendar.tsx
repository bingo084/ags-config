import { GLib } from "astal";
import { App, Astal, astalify, Gdk, Gtk } from "astal/gtk4";

const Calendar = astalify<Gtk.Calendar, Gtk.Calendar.ConstructorProps>(
  Gtk.Calendar,
);

export default () => (
  <window
    name="calendar"
    anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    visible={false}
    keymode={Astal.Keymode.EXCLUSIVE}
    onKeyReleased={(_, keyval) =>
      keyval == Gdk.KEY_Escape && App.toggle_window("calendar")
    }
    application={App}
  >
    <Calendar
      setup={(self) =>
        App.connect("window-toggled", (_, { name, visible }) => {
          if (visible && name == "calendar") {
            self.select_day(GLib.DateTime.new_now_local());
          }
        })
      }
    />
  </window>
);
