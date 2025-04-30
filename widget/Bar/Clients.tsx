import Hyprland from "gi://AstalHyprland";
import { bind, Variable } from "astal";
import { App } from "astal/gtk4";

const hyprland = Hyprland.get_default();

App.add_icons("./asset/icon/apps");

const addPrefix = (address: string) => `address:0x${address}`;
const actions: Record<number, (address: string) => void> = {
  1: (address) => hyprland.dispatch("focuswindow", addPrefix(address)),
  2: (address) => hyprland.dispatch("closewindow", addPrefix(address)),
};

const trans = (clazz: string) =>
  clazz === "Feishu" ? "bytedance-feishu" : clazz.toLowerCase();

const fc = bind(hyprland, "focusedClient");

export default () => (
  <box cssClasses={["clients"]}>
    {bind(hyprland, "clients").as((clients) =>
      clients
        .filter((client) => client.class)
        .sort(
          (c1, c2) =>
            c1.workspace.id - c2.workspace.id || c1.x - c2.x || c1.y - c2.y,
        )
        .map((client) => {
          const { address, initialClass, title } = client;
          return (
            <button
              cssClasses={Variable.derive(
                [fc, bind(client, "fullscreen")],
                (c, full) => [
                  c.address === address ? "focused" : "",
                  full ? "fullscreen" : "",
                ],
              )()}
              onClicked={() => actions[1]?.(address)}
              onButtonReleased={(_, state) =>
                actions[state.get_button()]?.(address)
              }
              tooltipText={title}
            >
              <image iconName={trans(initialClass)} />
            </button>
          );
        }),
    )}
  </box>
);
