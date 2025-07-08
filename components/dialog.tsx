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
    const buildLabelWithTimer = (type: "confirm" | "cancel") => {
      const config = type === "confirm" ? confirm : cancel;
      return timeout?.action === type && timer
        ? timer((t) => `${config.label} (${t})`)
        : config.label;
    };
    const dialog = (
      <window
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
        css={"background-color: rgba(0,0,0,0.1);"}
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
          css={`
            min-width: 300px;
            padding: 1.5rem;
            border-radius: 1rem;
            background-color: @theme_bg_color;
            border: 1px solid @theme_fg_color;
          `}
        >
          <label label={props.title} class="title" />
          <label
            visible={!!props.content}
            label={props.content}
            wrap
            justify={Gtk.Justification.CENTER}
            class="content"
          />
          <box>
            <button
              hexpand
              label={buildLabelWithTimer("cancel")}
              onClicked={() => closeWith(cancel.action)}
              class={cancel.class}
            />
            <button
              hexpand
              label={buildLabelWithTimer("confirm")}
              onClicked={() => closeWith(confirm.action)}
              class={confirm.class}
            />
          </box>
        </box>
      </window>
    ) as Gtk.Window;
    onCleanup(() => dialog.destroy());
  });
}
