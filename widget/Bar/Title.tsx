import { createBinding } from "ags";
import AstalHyprland from "gi://AstalHyprland";
import Pango from "gi://Pango";

const hyprland = AstalHyprland.get_default();
const focused = createBinding(hyprland, "focusedClient");

export default () => (
  <box class="title">
    <label
      label={focused((client) => client?.title || "")}
      ellipsize={Pango.EllipsizeMode.END}
    />
  </box>
);
