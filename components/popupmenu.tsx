import { Accessor } from "ags";
import { Gtk } from "ags/gtk4";
import { intrinsicElements } from "ags/gtk4/jsx-runtime";
import { execAsync } from "ags/process";

export type Item = {
  icon?: Accessor<string> | string;
  label?: Accessor<string> | string;
  onClicked?: (() => any) | string | string[];
  type?: "separator";
};

type PopupMenuProps = {
  items: Item[];
};

function PopupMenu({ items }: PopupMenuProps) {
  const popover = (
    <popover hasArrow={false}>
      <box orientation={Gtk.Orientation.VERTICAL}>
        {items.map(({ type, icon, label, onClicked }) =>
          type === "separator" ? (
            <Gtk.Separator />
          ) : (
            <button
              onClicked={async () => {
                try {
                  if (typeof onClicked === "function") {
                    await onClicked();
                  } else if (onClicked) {
                    await execAsync(onClicked);
                  }
                } catch (e: any) {
                  console.error("message" in e ? e.message : e);
                }
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
  return popover;
}

intrinsicElements["popupmenu"] = PopupMenu;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      popupmenu: PopupMenuProps;
    }
  }
}
