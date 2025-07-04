import { createBinding, For } from "ags";
import AstalHyprland from "gi://AstalHyprland";
import { MonitorProps } from ".";

const hyprland = AstalHyprland.get_default();
const workspaces = createBinding(hyprland, "workspaces").as((wss) =>
  wss.filter(({ id }) => id > 0).sort((w1, w2) => w1.id - w2.id),
);
const fw = createBinding(hyprland, "focusedWorkspace");

export default ({ gdkmonitor }: MonitorProps) => (
  <ebox
    onScroll={(dy) =>
      hyprland.message(`dispatch workspace ${dy < 0 ? "-1" : "+1"}`)
    }
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
  </ebox>
);
