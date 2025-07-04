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

const dispatch = (dispatcher: string, address: string) =>
  hyprland.dispatch(dispatcher, `address:0x${address}`);

const iconMap: Record<string, string> = {
  Feishu: "bytedance-feishu",
  QQ: "qq",
  "com.gabm.satty": "satty",
  "code-oss": "com.visualstudio.code.oss",
  Electron: "electron34",
  "org.pulseaudio.pavucontrol": "multimedia-volume-control",
  "blueman-manager": "blueman",
};

const trans = (clazz: string) => iconMap[clazz] ?? clazz;

const fc = createBinding(hyprland, "focusedClient");

export default ({ gdkmonitor }: MonitorProps) => (
  <box class="clients">
    <For each={clients}>
      {(client) => {
        const { address, initialClass, title, xwayland } = client;
        return (
          <ebutton
            cssClasses={createComputed(
              [fc, createBinding(client, "fullscreen")],
              (c, full) => [
                c?.address === address ? "focused" : "",
                full ? "fullscreen" : "",
                xwayland ? "xwayland" : "",
              ],
            )}
            onLeftUp={() => dispatch("focuswindow", address)}
            onMiddleUp={() => dispatch("closewindow", address)}
            tooltipText={title}
            visible={createBinding(client, "monitor").as(
              (m) => m?.name === gdkmonitor.connector,
            )}
          >
            <image iconName={trans(initialClass)} />
          </ebutton>
        );
      }}
    </For>
  </box>
);
