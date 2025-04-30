import Hyprland from "gi://AstalHyprland";
import { bind } from "astal";
import Pango from "gi://Pango?version=1.0";

const hyprland = Hyprland.get_default();
const focused = bind(hyprland, "focusedClient");

export default () => (
  <box cssClasses={["title"]} visible={focused.as(Boolean)}>
    {focused.as(
      (client) =>
        client && (
          <label
            label={bind(client, "title").as(String)}
            ellipsize={Pango.EllipsizeMode.END}
          />
        ),
    )}
  </box>
);
