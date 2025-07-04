import { CCProps } from "ags";
import { Gtk } from "ags/gtk4";
import { intrinsicElements } from "ags/gtk4/jsx-runtime";

type EButtonProps = {
  onLeftUp?: (self: Gtk.Button, x: number, y: number) => void;
  onRightUp?: (self: Gtk.Button, x: number, y: number) => void;
  onMiddleUp?: (self: Gtk.Button, x: number, y: number) => void;
  onScroll?: (dy: number) => void;
} & CCProps<Gtk.Button, Partial<Gtk.Button.ConstructorProps>>;

function EButton({
  onLeftUp,
  onRightUp,
  onMiddleUp,
  onScroll,
  ...rest
}: EButtonProps) {
  return (
    <button
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

intrinsicElements["ebutton"] = EButton;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ebutton: EButtonProps;
    }
  }
}
