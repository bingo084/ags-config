import { Gtk } from "ags/gtk4";
import Brightness from "../../libs/brightness";
import { createBinding } from "ags";
import { MonitorProps } from ".";

const brightness = Brightness.get_default();
const screen = createBinding(brightness, "screen");

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
const getIcon = (v: number) => icons[Math.round(v * (icons.length - 1))];

export default ({ gdkmonitor }: MonitorProps) => (
  <emenubutton
    visible={gdkmonitor.connector === "eDP-1"}
    onScroll={(dy) => (brightness.screen = brightness.screen - dy / 100)}
  >
    <box spacing={6}>
      <label
        useMarkup
        label={screen((v) => `<span size="120%">${getIcon(v)}</span>`)}
      />
      <label label={screen((v) => `${Math.round(v * 100)}%`)} />
    </box>
    <popover hasArrow={false}>
      <slider
        widthRequest={260}
        onChangeValue={(_, __, value) => {
          brightness.screen = value;
        }}
        value={screen}
      />
    </popover>
  </emenubutton>
);
