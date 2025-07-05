import { Accessor, createBinding, createComputed, createState, For } from "ags";
import app from "ags/gtk4/app";
import Hyprland from "gi://AstalHyprland";
import { MonitorProps } from ".";
import { Gtk } from "ags/gtk4";

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

function dispatch(dispatcher: string, address: string) {
  hyprland.dispatch(dispatcher, `address:0x${address}`);
}

function isHidden(client: Hyprland.Client) {
  return client.workspace.name === "special:scratchpad";
}

function show(client: Hyprland.Client) {
  hyprland.dispatch(
    "movetoworkspace",
    `${hyprland.focusedWorkspace.id},address:0x${client.address}`,
  );
  client.focus();
}

function hide(client: Hyprland.Client) {
  hyprland.dispatch(
    "movetoworkspacesilent",
    `special:scratchpad,address:0x${client.address}`,
  );
}

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

interface IconLabelButtonProps {
  icon?: string | Accessor<string>;
  label?: string | Accessor<string>;
  onClicked?: () => void;
  menu?: Accessor<Gtk.MenuButton | null>;
}

function IconLabelButton({
  icon,
  label,
  onClicked,
  menu,
}: IconLabelButtonProps) {
  return (
    <button
      onClicked={() => {
        onClicked?.();
        menu?.get()?.popdown();
      }}
    >
      <box spacing={8}>
        <image iconName={icon} />
        <label label={label} />
      </box>
    </button>
  );
}

export default ({ gdkmonitor }: MonitorProps) => (
  <box>
    <For each={clients}>
      {(client) => {
        const { address, initialClass, title, xwayland } = client;
        const hidden = createBinding(client, "workspace").as(
          (ws) => ws.name === "special:scratchpad",
        );
        const full = createBinding(client, "fullscreen").as(
          (f) => f === Hyprland.Fullscreen.MAXIMIZED,
        );
        const floating = createBinding(client, "floating");
        const pinned = createBinding(client, "pinned");
        const [menu, setMenu] = createState<Gtk.MenuButton | null>(null);

        return (
          <emenubutton
            $={(self) => setMenu(self)}
            cssClasses={createComputed(
              [
                fc,
                createBinding(client, "fullscreen"),
                createBinding(client, "workspace"),
                createBinding(client, "pinned"),
              ],
              (c, full, ws, pinned) => [
                c?.address === address ? "focused" : "",
                full ? "fullscreen" : "",
                xwayland ? "xwayland" : "",
                ws.name === "special:scratchpad" ? "hidden" : "",
                pinned ? "pinned" : "",
              ],
            )}
            onLeftUp={() => (isHidden(client) ? show(client) : client.focus())}
            onMiddleUp={() => client.kill()}
            onRightUp={(self) => self.popup()}
            tooltipText={title}
            visible={createBinding(client, "monitor").as(
              (m) => m?.name === gdkmonitor.connector,
            )}
          >
            <image iconName={trans(initialClass)} />
            <popover hasArrow={false}>
              <box orientation={Gtk.Orientation.VERTICAL}>
                <IconLabelButton
                  icon={hidden((h) =>
                    h ? "window-maximize-symbolic" : "window-minimize-symbolic",
                  )}
                  label={hidden((h) => (h ? "Show Window" : "Hide Window"))}
                  onClicked={() =>
                    isHidden(client) ? show(client) : hide(client)
                  }
                  menu={menu}
                />
                <IconLabelButton
                  icon={full((f) =>
                    f ? "view-restore-symbolic" : "view-fullscreen-symbolic",
                  )}
                  label={full((f) =>
                    f ? "Exit Fullscreen" : "Enter Fullscreen",
                  )}
                  onClicked={() => {
                    isHidden(client) ? show(client) : client.focus();
                    hyprland.dispatch("fullscreen", "1");
                  }}
                  menu={menu}
                />
                <IconLabelButton
                  icon={floating((f) =>
                    f ? "view-dual-symbolic" : "view-paged-symbolic",
                  )}
                  label={floating((f) =>
                    f ? "Disable Floating" : "Enable Floating",
                  )}
                  onClicked={() => client.toggle_floating()}
                  menu={menu}
                />
                <IconLabelButton
                  icon="view-pin-symbolic"
                  label={pinned((p) => (p ? "Unpin Window" : "Pin Window"))}
                  onClicked={() => {
                    dispatch("setfloating", address);
                    dispatch("pin", address);
                  }}
                  menu={menu}
                />
                <IconLabelButton
                  icon="window-close-symbolic"
                  label="Close Window"
                  onClicked={() => client.kill()}
                  menu={menu}
                />
              </box>
            </popover>
          </emenubutton>
        );
      }}
    </For>
  </box>
);
