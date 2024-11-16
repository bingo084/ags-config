import Astal from "gi://Astal";
import AstalWp from "gi://AstalWp";
import { subprocess } from "astal/process";
import { bind } from "astal/binding";

const speaker = AstalWp.get_default()?.get_audio()?.defaultSpeaker;

const actions = {
  [Astal.MouseButton.PRIMARY]: () => speaker?.set_mute(!speaker.mute),
  [Astal.MouseButton.MIDDLE]: () => subprocess("pavucontrol"),
};

const chageVolume = (deltaY: number) => {
  const step = deltaY == 0 ? 0 : deltaY > 0 ? 0.01 : -0.01;
  speaker?.set_volume(speaker.volume + step);
};

const icon = ({ volume, mute }: AstalWp.Endpoint) => {
  const icon = mute
    ? "muted"
    : (
        [
          [101, "overamplified"],
          [67, "high"],
          [34, "medium"],
          [1, "low"],
          [0, "muted"],
        ] as [number, string][]
      ).find(([threshold]) => threshold <= volume * 100)?.[1];
  return `audio-volume-${icon}-symbolic`;
};

export default () => {
  if (!speaker) return null;
  return (
    <eventbox
      onClickRelease={(_, { button }) => actions[button]?.()}
      onScroll={(_, { delta_y }) => chageVolume(delta_y)}
    >
      <box tooltipText={bind(speaker, "description")}>
        <icon
          setup={(self) =>
            self.hook(speaker, "notify", () => (self.icon = icon(speaker)))
          }
        />
        <label
          label={bind(speaker, "volume").as(
            (volume) => ` ${Math.round(volume * 100)}%`,
          )}
        />
      </box>
    </eventbox>
  );
};
