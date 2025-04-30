import Hyprland from "gi://AstalHyprland";
import { Label } from "astal/gtk3/widget";
import { hook } from "astal/gtk4";

const hyprland = Hyprland.get_default();

export default () => (
  <box
    spacing={8}
    visible={false}
    setup={(self) =>
      hook(self, hyprland, "submap", (_, name) => {
        (self.children[1] as unknown as Label).label = name || "";
        name ? self.show() : self.hide();
      })
    }
  >
    <image iconName="input-keyboard-symbolic" />
    <label />
  </box>
);
