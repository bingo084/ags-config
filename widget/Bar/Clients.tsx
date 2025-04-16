import Astal from "gi://Astal";
import Hyprland from "gi://AstalHyprland";
import { bind, Variable } from "astal";
import { App } from "astal/gtk3";

const hyprland = Hyprland.get_default();

App.add_icons("./asset/icon/apps");

const dispatch = (dispatcher: string, address: string) =>
  hyprland.message(`dispatch ${dispatcher} address:0x${address}`);

const actions = {
  [Astal.MouseButton.PRIMARY]: (address: string) =>
    dispatch("focuswindow", address),
  [Astal.MouseButton.MIDDLE]: (address: string) =>
    dispatch("closewindow", address),
};

const trans = (clazz: string) =>
  clazz === "Feishu" ? "bytedance-feishu" : clazz.toLowerCase();

const fc = bind(hyprland, "focusedClient");

export default () => (
  <box className="clients">
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
              className={Variable.derive(
                [fc, bind(client, "fullscreen")],
                (c, full) =>
                  `${c?.address === address && "focused"} ${full && "fullscreen"}`,
              )()}
              onClickRelease={(_, { button }) => actions[button]?.(address)}
              tooltipText={title}
            >
              <icon icon={trans(initialClass)} />
            </button>
          );
        }),
    )}
  </box>
);
