import { Accessor, createBinding, createComputed, For } from "ags";
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
const fc = createBinding(hyprland, "focusedClient");

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

        const items = [
          {
            icon: hidden((h) => `window-${h ? "max" : "min"}imize-symbolic`),
            label: hidden((h) => (h ? "Show Window" : "Hide Window")),
            onClicked: () => (isHidden(client) ? show(client) : hide(client)),
          },
          {
            icon: full((f) => `view-${f ? "restore" : "fullscreen"}-symbolic`),
            label: full((f) => (f ? "Exit Fullscreen" : "Enter Fullscreen")),
            onClicked: () => {
              isHidden(client) ? show(client) : client.focus();
              hyprland.dispatch("fullscreen", "1");
            },
          },
          {
            icon: floating((f) => `view-${f ? "dual" : "paged"}-symbolic`),
            label: floating((f) => `${f ? "Disable" : "Enable"} Floating`),
            onClicked: () => client.toggle_floating(),
          },
          {
            icon: "view-pin-symbolic",
            label: pinned((p) => (p ? "Unpin Window" : "Pin Window")),
            onClicked: () => {
              dispatch("setfloating", address);
              dispatch("pin", address);
            },
          },
          {
            icon: "window-close-symbolic",
            label: "Close Window",
            onClicked: () => client.kill(),
          },
        ];

        const popover = (
          <popover hasArrow={false}>
            <box orientation={Gtk.Orientation.VERTICAL}>
              {items.map(({ icon, label, onClicked }) => (
                <button
                  onClicked={() => {
                    onClicked?.();
                    popover.popdown();
                  }}
                >
                  <box spacing={8}>
                    <image iconName={icon} />
                    <label label={label} />
                  </box>
                </button>
              ))}
            </box>
          </popover>
        ) as Gtk.Popover;

        return (
          <emenubutton
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
            {popover}
          </emenubutton>
        );
      }}
    </For>
  </box>
);
