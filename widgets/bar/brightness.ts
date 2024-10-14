import brightness from "../../services/brightness.js";

const icons = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];
const icon = (v: number, icons: string[]) =>
  icons[Math.round((v / 100) * (icons.length - 1))];

export default Widget.EventBox({
  className: "brightness",
  onScrollUp: () => (brightness.screen_value += 0.01),
  onScrollDown: () => (brightness.screen_value -= 0.01),
  child: Widget.Label({
    label: brightness
      .bind("screen_value")
      .as((v) => `${icon(v * 100, icons)}  ${Math.round(v * 100)}%`),
  }),
});
