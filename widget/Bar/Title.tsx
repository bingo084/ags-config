import Hyprland from "gi://AstalHyprland";
import { bind } from "astal";

const hyprland = Hyprland.get_default();
const focused = bind(hyprland, "focusedClient");

export default () => (
  <box className="title" visible={focused.as(Boolean)}>
    {focused.as((client) => (
      client && <label label={bind(client, "title").as(String)} truncate />
    ))}
  </box>
);
