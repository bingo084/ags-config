import Astal from "gi://Astal";
import AstalWp from "gi://AstalWp";
import { subprocess } from "astal/process";
import { bind } from "astal/binding";

const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;

const actions = {
  [Astal.MouseButton.PRIMARY]: () => speaker.set_mute(!speaker.mute),
  [Astal.MouseButton.MIDDLE]: () => subprocess("pavucontrol"),
};

const chageVolume = (deltaY: number) => {
  const step = deltaY == 0 ? 0 : deltaY < 0 ? 0.01 : -0.01;
  speaker.set_volume(speaker.volume + step);
};

export default () => (
  <eventbox
    onClickRelease={(_, { button }) => actions[button]?.()}
    onScroll={(_, { delta_y }) => chageVolume(delta_y)}
  >
    <box tooltipText={bind(speaker, "description")}>
      <icon icon={bind(speaker, "volumeIcon")} />
      <label
        label={bind(speaker, "volume").as(
          (volume) => ` ${Math.round(volume * 100)}%`,
        )}
      />
    </box>
  </eventbox>
);
