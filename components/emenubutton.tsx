import { CCProps } from "ags";
import GObject from "ags/gobject";
import { Gtk } from "ags/gtk4";
import { intrinsicElements } from "ags/gtk4/jsx-runtime";

type EMenuButtonProps = {
  onLeftUp?: (self: Gtk.MenuButton) => void;
  onRightUp?: (self: Gtk.MenuButton) => void;
  onMiddleUp?: (self: Gtk.MenuButton) => void;
  onScroll?: (dy: number) => void;
  children?: Array<GObject.Object>;
} & CCProps<Gtk.MenuButton, Partial<Gtk.MenuButton.ConstructorProps>>;

function EMenuButton({
  onLeftUp,
  onRightUp,
  onMiddleUp,
  onScroll,
  children,
  ...rest
}: EMenuButtonProps) {
  return (
    <menubutton
      {...rest}
      $={(self) => {
        const scroll = new Gtk.EventControllerScroll({
          flags: Gtk.EventControllerScrollFlags.VERTICAL,
        });
        scroll.connect("scroll", (_, __, dy) => onScroll?.(dy));
        self.add_controller(scroll);
        const click = new Gtk.GestureClick({
          button: 0,
          propagationPhase: Gtk.PropagationPhase.CAPTURE,
        });
        click.connect("released", (gesture) => {
          if (onLeftUp) gesture.set_state(Gtk.EventSequenceState.CLAIMED);
          if (gesture.get_current_button() === 1) {
            onLeftUp?.(self);
          } else if (gesture.get_current_button() === 2) {
            onMiddleUp?.(self);
          } else if (gesture.get_current_button() === 3) {
            onRightUp?.(self);
          }
        });
        self.add_controller(click);
      }}
    >
      {children}
    </menubutton>
  );
}

intrinsicElements["emenubutton"] = EMenuButton;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      emenubutton: EMenuButtonProps;
    }
  }
}
