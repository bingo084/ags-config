import Apps from "gi://AstalApps";
import Astal from "gi://Astal";
import Hyprland from "gi://AstalHyprland";
import { bind } from "astal/binding";

const hyprland = Hyprland.get_default();
const app = new Apps.Apps();

const dispatch = (dispatcher: string, address: string) =>
  hyprland.message(`dispatch ${dispatcher} address:0x${address}`);

const actions = {
  [Astal.MouseButton.PRIMARY]: (address: string) =>
    dispatch("focuswindow", address),
  [Astal.MouseButton.MIDDLE]: (address: string) =>
    dispatch("closewindow", address),
};

const trans = (clazz: string) =>
  clazz === "org.telegram.desktop" ? "telegram" : clazz;

export default () => (
  <box>
    {bind(hyprland, "clients").as((clients) =>
      clients
        .sort(
          (c1, c2) =>
            c1.workspace.id - c2.workspace.id || c1.x - c2.x || c1.y - c2.y,
        )
        .map(({ address, class: clazz, title }) => (
          <button
            className={bind(hyprland, "focusedClient").as((c) =>
              c.address === address ? "focused" : "",
            )}
            onClickRelease={(_, { button }) => actions[button]?.(address)}
            tooltipText={title}
          >
            <icon
              icon={
                app.fuzzy_query(trans(clazz))[0]?.iconName || "image-missing"
              }
            />
          </button>
        )),
    )}
  </box>
);
