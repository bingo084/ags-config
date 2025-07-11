import { Accessor, createRoot, onCleanup } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { execAsync } from "ags/process";
import { createPoll } from "ags/time";

interface ActionConfig {
  label?: string;
  action?: string | string[];
  class?: "danger" | "primary" | "secondary";
}

interface DialogProps {
  title: string;
  content?: string;
  confirm: ActionConfig | string | string[];
  cancel?: ActionConfig;
  timeout?: {
    seconds: number;
    action: "confirm" | "cancel";
  };
}

function fillDefaults(
  config: DialogProps["confirm"] | DialogProps["cancel"],
  defaults: { label: string; class: string },
) {
  return {
    label: defaults.label,
    class: defaults.class,
    ...(typeof config === "string" || Array.isArray(config)
      ? { action: config }
      : config),
  };
}

export function Dialog({ timeout, ...props }: DialogProps) {
  createRoot((dispose) => {
    const confirm = fillDefaults(props.confirm, {
      label: "Confirm",
      class: "primary",
    });
    const cancel = fillDefaults(props.cancel, {
      label: "Cancel",
      class: "secondary",
    });
    const closeWith = (action: ActionConfig["action"]) => {
      if (action) {
        execAsync(action).catch((e) =>
          console.error("message" in e ? e.message : e),
        );
      }
      dispose();
    };
    const timer = timeout
      ? createPoll(timeout.seconds, 1000, (prev) => {
          if (prev > 0) return prev - 1;
          closeWith(
            timeout.action === "confirm" ? confirm.action : cancel.action,
          );
          return 0;
        })
      : null;
    const button = (type: "confirm" | "cancel") => {
      const config = type === "confirm" ? confirm : cancel;
      const label =
        timeout?.action === type && timer ? timer((t) => ` (${t})`) : "";
      return (
        <button onClicked={() => closeWith(config.action)} class={config.class}>
          <box halign={Gtk.Align.CENTER}>
            <label label={config.label} />
            {label && <label widthRequest={25} label={label} />}
          </box>
        </button>
      );
    };
    const dialog = (
      <window
        name="dialog"
        title={props.title}
        visible
        keymode={Astal.Keymode.EXCLUSIVE}
        anchor={
          Astal.WindowAnchor.TOP |
          Astal.WindowAnchor.BOTTOM |
          Astal.WindowAnchor.LEFT |
          Astal.WindowAnchor.RIGHT
        }
        application={app}
      >
        <Gtk.EventControllerKey
          onKeyPressed={(_, keyval: number) => {
            if (keyval === Gdk.KEY_Escape) {
              closeWith(cancel.action);
            } else if (keyval === Gdk.KEY_Return) {
              closeWith(confirm.action);
            }
          }}
        />
        <box
          orientation={Gtk.Orientation.VERTICAL}
          valign={Gtk.Align.CENTER}
          halign={Gtk.Align.CENTER}
        >
          <label label={props.title} class="title" />
          <label
            visible={!!props.content}
            label={props.content}
            wrap
            justify={Gtk.Justification.CENTER}
            class="content"
          />
          <box spacing={10} halign={Gtk.Align.END} homogeneous>
            {button("cancel")}
            {button("confirm")}
          </box>
        </box>
      </window>
    ) as Gtk.Window;
    onCleanup(() => dialog.destroy());
  });
}
