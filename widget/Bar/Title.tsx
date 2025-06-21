import Hyprland from "gi://AstalHyprland";
import { bind } from "astal";
import Pango from "gi://Pango?version=1.0";

const hyprland = Hyprland.get_default();
const focused = bind(hyprland, "focusedClient");

export default () => (
  <box cssClasses={["title"]}>
    <label
      label={focused.as((client) => client?.title || "")}
      ellipsize={Pango.EllipsizeMode.END}
    />
  </box>
);
