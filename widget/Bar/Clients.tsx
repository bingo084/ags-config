import Hyprland from "gi://AstalHyprland";
import { bind, Variable } from "astal";
import { App, Gdk } from "astal/gtk4";

const hyprland = Hyprland.get_default();

App.add_icons("./asset/icon/apps");

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
};

const trans = (clazz: string) => iconMap[clazz] ?? clazz;

const fc = bind(hyprland, "focusedClient");

export default (gdkmonitor: Gdk.Monitor) => (
  <box cssClasses={["clients"]}>
    {bind(hyprland, "clients").as((clients) =>
      clients
        .sort(
          (c1, c2) =>
            c1.workspace.id - c2.workspace.id || c1.x - c2.x || c1.y - c2.y,
        )
        .map((client) => {
          const { address, initialClass, title, xwayland } = client;
          return (
            <button
              cssClasses={Variable.derive(
                [fc, bind(client, "fullscreen")],
                (c, full) => [
                  c?.address === address ? "focused" : "",
                  full ? "fullscreen" : "",
                  xwayland ? "xwayland" : "",
                ],
              )()}
              onClicked={() => actions[1]?.(address)}
              onButtonReleased={(_, state) =>
                actions[state.get_button()]?.(address)
              }
              tooltipText={title}
              visible={bind(client, "monitor").as(
                (m) => m?.name === gdkmonitor.connector,
              )}
            >
              <image iconName={trans(initialClass)} />
            </button>
          );
        }),
    )}
  </box>
);
