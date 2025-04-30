import Hyprland from "gi://AstalHyprland";
import { bind } from "astal";
import { Gdk } from "astal/gtk4";

const hyprland = Hyprland.get_default();

const dispatch = (ws: string | number) =>
  hyprland.message(`dispatch workspace ${ws}`);

const fw = bind(hyprland, "focusedWorkspace");

export default (gdkmonitor: Gdk.Monitor) => (
  <box onScroll={(_, __, dy) => dispatch(dy)}>
    {bind(hyprland, "workspaces").as((wss) =>
      wss
        .filter(
          ({ monitor }) =>
            monitor.model === gdkmonitor.model &&
            monitor.x === gdkmonitor.geometry.x &&
            monitor.y === gdkmonitor.geometry.y,
        )
        .filter(({ id }) => id > 0)
        .sort((w1, w2) => w1.id - w2.id)
        .map((ws) => (
          <button
            cssClasses={fw.as((fw) => [`${fw === ws && "focused"}`])}
            onClicked={() => ws.focus()}
          >
            {ws.id}
          </button>
        )),
    )}
  </box>
);
