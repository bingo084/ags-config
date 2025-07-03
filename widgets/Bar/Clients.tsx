import { createBinding, createComputed, For } from "ags";
import { Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Hyprland from "gi://AstalHyprland";
import { MonitorProps } from ".";

const hyprland = Hyprland.get_default();
const clients = createBinding(hyprland, "clients").as((clients) =>
  clients
    .filter((c) => c.class && c.workspace)
    .sort(
      (c1, c2) =>
        c1.workspace.id - c2.workspace.id || c1.x - c2.x || c1.y - c2.y,
    ),
);

app.add_icons("./asset/icon/apps");

const addPrefix = (address: string) => `address:0x${address}`;
const actions: Record<number, (address: string) => void> = {
  1: (address) => hyprland.dispatch("focuswindow", addPrefix(address)),
  2: (address) => hyprland.dispatch("closewindow", addPrefix(address)),
};

const iconMap: Record<string, string> = {
  Feishu: "bytedance-feishu",
  QQ: "qq",
  "com.gabm.satty": "satty",
  "code-oss": "com.visualstudio.code.oss",
  Electron: "electron34",
  "org.pulseaudio.pavucontrol": "multimedia-volume-control",
};

const trans = (clazz: string) => iconMap[clazz] ?? clazz;

const fc = createBinding(hyprland, "focusedClient");

export default ({ gdkmonitor }: MonitorProps) => (
  <box class="clients">
    <For each={clients}>
      {(client) => {
        const { address, initialClass, title, xwayland } = client;
        return (
          <button
            cssClasses={createComputed(
              [fc, createBinding(client, "fullscreen")],
              (c, full) => [
                c?.address === address ? "focused" : "",
                full ? "fullscreen" : "",
                xwayland ? "xwayland" : "",
              ],
            )}
            onClicked={() => actions[1]?.(address)}
            // onButtonReleased={(_, state) =>
            //   actions[state.get_button()]?.(address)
            // }
            tooltipText={title}
            visible={createBinding(client, "monitor").as(
              (m) => m?.name === gdkmonitor.connector,
            )}
          >
            <image iconName={trans(initialClass)} />
          </button>
        );
      }}
    </For>
  </box>
);
