const audio = await Service.import("audio");
const changeVolume = (n: number) =>
  (audio.speaker.volume = Math.min(audio.speaker.volume + n / 100, 1));

export default Widget.EventBox({
  className: "volume",
  onPrimaryClickRelease: () =>
    (audio.speaker.is_muted = !audio.speaker.is_muted),
  onMiddleClickRelease: () => Utils.subprocess("pavucontrol"),
  onScrollUp: () => changeVolume(1),
  onScrollDown: () => changeVolume(-1),
  child: Widget.Box({
    tooltipText: audio.speaker.bind("description").as((d) => `${d}`),
    children: [
      Widget.Icon().hook(audio.speaker, (self) => {
        const volume = audio.speaker.volume * 100;
        const icon = audio.speaker.is_muted
          ? "muted"
          : (
              [
                [101, "overamplified"],
                [67, "high"],
                [34, "medium"],
                [1, "low"],
                [0, "muted"],
              ] as [number, string][]
            ).find(([threshold]) => threshold <= volume)?.[1];
        self.icon = `audio-volume-${icon}-symbolic`;
      }),
      Widget.Label({
        label: audio.speaker
          .bind("volume")
          .as((volume) => ` ${Math.round(volume * 100)}%`),
      }),
    ],
  }),
});
