import { FCProps } from "ags";
import GObject from "ags/gobject";
import { Gtk } from "ags/gtk4";
import { intrinsicElements } from "ags/gtk4/jsx-runtime";

type EMenuButtonProps = FCProps<
  Gtk.MenuButton,
  {
    onLeftUp?: () => void;
    onRightUp?: () => void;
    onMiddleUp?: () => void;
    onScroll?: (dy: number) => void;
    children?: Array<GObject.Object>;
  } & Partial<Gtk.MenuButton.ConstructorProps>
>;

function EMenuButton({
  onLeftUp,
  onRightUp,
  onMiddleUp,
  onScroll,
  children,
  ...rest
}: EMenuButtonProps) {
  return (
    <menubutton {...rest}>
      <Gtk.EventControllerScroll
        flags={Gtk.EventControllerScrollFlags.VERTICAL}
        onScroll={(_, __, dy) => onScroll?.(dy)}
      />
      <Gtk.GestureClick
        button={0}
        propagationPhase={Gtk.PropagationPhase.CAPTURE}
        onReleased={(self) => {
          if (onLeftUp) self.set_state(Gtk.EventSequenceState.CLAIMED);
          if (self.get_current_button() === 1) {
            onLeftUp?.();
          } else if (self.get_current_button() === 2) {
            onMiddleUp?.();
          } else if (self.get_current_button() === 3) {
            onRightUp?.();
          }
        }}
      />
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
