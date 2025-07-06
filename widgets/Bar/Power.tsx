import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import GLib from "gi://GLib";

const items = [
  {
    icon: "system-lock-screen-symbolic",
    label: "Lock",
    onClicked: () => execAsync(["loginctl", "lock-session"]),
  },
  {
    icon: "system-log-out-symbolic",
    label: "Log Out",
    onClicked: () =>
      execAsync(["loginctl", "terminate-user", GLib.get_user_name()]),
  },
  {
    type: "separator",
  },
  {
    icon: "weather-clear-night-symbolic",
    label: "Suspend",
    onClicked: () => execAsync(["systemctl", "suspend"]),
  },
  {
    icon: "drive-harddisk-symbolic",
    label: "Hibernate",
    onClicked: () => execAsync(["systemctl", "hibernate"]),
  },
  {
    type: "separator",
  },
  {
    icon: "system-reboot-symbolic",
    label: "Reboot",
    onClicked: () => execAsync(["systemctl", "reboot"]),
  },
  {
    icon: "system-shutdown-symbolic",
    label: "Shutdown",
    onClicked: () => execAsync(["systemctl", "poweroff"]),
  },
];

const popover = (
  <popover hasArrow={false}>
    <box orientation={Gtk.Orientation.VERTICAL}>
      {items.map(({ type, icon, label, onClicked }) =>
        type === "separator" ? (
          <Gtk.Separator />
        ) : (
          <button
            onClicked={() => {
              onClicked?.().catch((e) => {
                "message" in e ? console.error(e.message) : console.error(e);
              });
              popover.popdown();
            }}
          >
            <box spacing={8}>
              <image iconName={icon} />
              <label label={label} />
            </box>
          </button>
        ),
      )}
    </box>
  </popover>
) as Gtk.Popover;

export default () => (
  <emenubutton>
    <image iconName={GLib.get_os_info("LOGO") || "missing-symbolic"} />
    {popover}
  </emenubutton>
);
