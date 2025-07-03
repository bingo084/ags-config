import { createBinding, For } from "ags";
import { Gdk } from "ags/gtk4";
import AstalHyprland from "gi://AstalHyprland";
import { MonitorProps } from ".";

const hyprland = AstalHyprland.get_default();
const workspaces = createBinding(hyprland, "workspaces").as((wss) =>
  wss.filter(({ id }) => id > 0).sort((w1, w2) => w1.id - w2.id),
);
const fw = createBinding(hyprland, "focusedWorkspace");

const dispatch = (ws: string | number) =>
  hyprland.message(`dispatch workspace ${ws}`);

export default ({ gdkmonitor }: MonitorProps) => (
  <box
  // onScroll={(_, __, dy) => dispatch(dy)}
  >
    <For each={workspaces}>
      {(ws) => (
        <button
          class={fw((w) => (w === ws ? "focused" : ""))}
          onClicked={() => ws.focus()}
          visible={createBinding(ws, "monitor").as(
            (monitor) => monitor.name === gdkmonitor.connector,
          )}
        >
          {ws.id}
        </button>
      )}
    </For>
  </box>
);
