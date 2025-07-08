import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import GLib from "gi://GLib";
import { Dialog } from "../../components/dialog";

const items = [
  {
    icon: "system-lock-screen-symbolic",
    label: "Lock",
    onClicked: () => execAsync(["loginctl", "lock-session"]),
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
    icon: "system-log-out-symbolic",
    label: "Log Out",
    onClicked: () =>
      Dialog({
        title: "Log Out",
        content: "Are you sure you want to log out?",
        confirm: {
          label: "Log Out",
          class: "danger",
          action: ["loginctl", "kill-session", GLib.get_user_name()],
        },
        timeout: {
          action: "confirm",
          seconds: 10,
        },
      }),
  },
  {
    icon: "system-reboot-symbolic",
    label: "Reboot",
    onClicked: () =>
      Dialog({
        title: "Reboot",
        content: "Are you sure you want to reboot?",
        confirm: {
          label: "Reboot",
          class: "danger",
          action: ["systemctl", "reboot"],
        },
        timeout: {
          action: "confirm",
          seconds: 10,
        },
      }),
  },
  {
    icon: "system-shutdown-symbolic",
    label: "Shutdown",
    onClicked: () =>
      Dialog({
        title: "Shutdown",
        content: "Are you sure you want to shut down?",
        confirm: {
          label: "Shutdown",
          class: "danger",
          action: ["systemctl", "poweroff"],
        },
        timeout: {
          action: "confirm",
          seconds: 10,
        },
      }),
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
              onClicked?.();
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
