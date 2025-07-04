import { CCProps } from "ags";
import { Gtk } from "ags/gtk4";
import { intrinsicElements } from "ags/gtk4/jsx-runtime";

type EBoxProps = {
  onLeftUp?: (self: Gtk.Box, x: number, y: number) => void;
  onRightUp?: (self: Gtk.Box, x: number, y: number) => void;
  onMiddleUp?: (self: Gtk.Box, x: number, y: number) => void;
  onScroll?: (dy: number) => void;
} & CCProps<Gtk.Box, Partial<Gtk.Box.ConstructorProps>>;

function EBox({
  onLeftUp,
  onRightUp,
  onMiddleUp,
  onScroll,
  ...rest
}: EBoxProps) {
  return (
    <box
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
        click.connect("released", (gesture, _, x, y) => {
          if (onLeftUp) gesture.set_state(Gtk.EventSequenceState.CLAIMED);
          if (gesture.get_current_button() === 1) {
            onLeftUp?.(self, x, y);
          } else if (gesture.get_current_button() === 2) {
            onMiddleUp?.(self, x, y);
          } else if (gesture.get_current_button() === 3) {
            onRightUp?.(self, x, y);
          }
        });
        self.add_controller(click);
      }}
    />
  );
}

intrinsicElements["ebox"] = EBox;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ebox: EBoxProps;
    }
  }
}
