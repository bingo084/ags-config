import Hyprland from "gi://AstalHyprland";
import { Label } from "astal/gtk3/widget";

const hyprland = Hyprland.get_default();

export default () => (
  <box
    spacing={8}
    visible={false}
    setup={(self) =>
      self.hook(hyprland, "submap", (_, name) => {
        (self.children[1] as Label).label = name || "";
        name ? self.show() : self.hide();
      })
    }
  >
    <icon icon="input-keyboard-symbolic" />
    <label />
  </box>
);
