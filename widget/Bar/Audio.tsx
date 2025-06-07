import AstalWp from "gi://AstalWp";
import { bind, subprocess } from "astal";

const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;

const actions: Record<number, () => void> = {
  2: () => subprocess("pavucontrol"),
  3: () => speaker.set_mute(!speaker.mute),
};

export default () => (
  <menubutton
    onButtonReleased={(_, state) => actions[state.get_button()]?.()}
    onScroll={(_, __, dy) => speaker.set_volume(speaker.volume - dy / 100)}
  >
    <box>
      <image iconName={bind(speaker, "volumeIcon")} />
      <label
        label={bind(speaker, "volume").as(
          (volume) => ` ${Math.round(volume * 100)}%`,
        )}
      />
    </box>
    <popover hasArrow={false}>
      <label label={bind(speaker, "description")} />
    </popover>
  </menubutton>
);
