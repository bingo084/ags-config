import { Accessor, createState } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { execAsync } from "ags/process";
import { interval } from "ags/time";

interface DialogProps {
  title: string;
  content?: string;
  confirm:
    | {
        label?: string;
        action: string | string[];
        class?: "danger" | "primary" | "secondary";
      }
    | string
    | string[];
  cancel?: {
    label?: string;
    action?: string | string[];
    class?: "danger" | "primary" | "secondary";
  };
  timeout?: {
    seconds: number;
    action: "confirm" | "cancel";
  };
}

export function Dialog(props: DialogProps) {
  const confirm = {
    label: "Confirm",
    class: "primary",
    ...(typeof props.confirm === "string" || Array.isArray(props.confirm)
      ? { action: props.confirm }
      : props.confirm),
  };
  const cancel = {
    label: "Cancel",
    class: "secondary",
    ...props.cancel,
  };
  const closeWith = (action: string | string[] | undefined) => {
    const result = action ? execAsync(action) : undefined;
    if (result instanceof Promise) {
      result.catch((e) => {
        "message" in e ? console.error(e.message) : console.error(e);
      });
    }
    timmer.cancel();
    dialog.destroy();
  };
  const [seconds, setSeconds] = createState(props.timeout?.seconds);
  const timmer = interval(1000, () =>
    setSeconds((prev) => {
      if (prev === undefined) {
        timmer.cancel();
        return prev;
      }
      if (prev <= 0) {
        if (props.timeout?.action === "confirm") {
          closeWith(confirm.action);
        } else {
          closeWith(cancel.action);
        }
        timmer.cancel();
      }
      return prev - 1;
    }),
  );
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
          label={props.content}
          wrap
          justify={Gtk.Justification.CENTER}
          class="content"
        />
        <box>
          <button
            hexpand
            label={
              props.timeout?.action === "cancel"
                ? seconds((s) => `${cancel.label} (${s})`)
                : cancel.label
            }
            onClicked={() => closeWith(cancel.action)}
            class={cancel.class}
          />
          <button
            hexpand
            label={
              props.timeout?.action === "confirm"
                ? seconds((s) => `${confirm.label} (${s})`)
                : confirm.label
            }
            onClicked={() => closeWith(confirm.action)}
            class={confirm.class}
          />
        </box>
      </box>
    </window>
  ) as Gtk.Window;
}
