import { App, Astal, astalify, ConstructProps, Gdk, Gtk } from "astal/gtk3";
import GObject from "gi://GObject";

class Calendar extends astalify(Gtk.Calendar) {
  static {
    GObject.registerClass(this);
  }

  constructor(
    props: ConstructProps<Calendar, Gtk.ColorButton.ConstructorProps, {}>,
  ) {
    super(props as any);
  }
}

export default () => (
  <window
    name="calendar"
    anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    visible={false}
    keymode={Astal.Keymode.EXCLUSIVE}
    onKeyReleaseEvent={(_, event) =>
      event.get_keyval()[1] == Gdk.KEY_Escape && App.toggle_window("calendar")
    }
    application={App}
  >
    <Calendar
      setup={(self) =>
        App.connect("window-toggled", (_, { name, visible }) => {
          if (visible && name == "calendar") {
            const d = new Date();
            self.select_day(d.getDate());
            self.select_month(d.getMonth(), d.getFullYear());
          }
        })
      }
    />
  </window>
);
