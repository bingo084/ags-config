import { createBinding } from "ags";
import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import AstalWp from "gi://AstalWp";

const { defaultSpeaker: speaker } = AstalWp.get_default()!;
const icon = createBinding(speaker, "volumeIcon");
const volume = createBinding(speaker, "volume");
const desc = createBinding(speaker, "description");

const actions: Record<number, () => void> = {
  2: () => execAsync("pavucontrol"),
  3: () => speaker.set_mute(!speaker.mute),
};

export default () => (
  <menubutton
  // onButtonReleased={(_, state) => actions[state.get_button()]?.()}
  // onScroll={(_, __, dy) => speaker.set_volume(speaker.volume - dy / 100)}
  >
    <box>
      <image iconName={icon} />
      <label label={volume((v) => ` ${Math.round(v * 100)}%`)} />
    </box>
    <popover hasArrow={false}>
      <box orientation={Gtk.Orientation.VERTICAL}>
        <label label={desc.as((d) => d || "Unknown Device")} />
        <slider
          widthRequest={260}
          onChangeValue={({ value }) => speaker.set_volume(value)}
          value={volume}
        />
      </box>
    </popover>
  </menubutton>
);
