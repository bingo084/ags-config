import { Gtk } from "ags/gtk4";
import Hyprland from "gi://AstalHyprland";

const hyprland = Hyprland.get_default();

export default () => (
  <box
    spacing={8}
    visible={false}
    $={(self) =>
      hyprland.connect("submap", (_, name) => {
        (self.get_last_child() as Gtk.Label).label = name || "";
        name ? self.show() : self.hide();
      })
    }
  >
    <image iconName="input-keyboard-symbolic" />
    <label />
  </box>
);
