import { Astal, Gdk, Gtk } from "astal/gtk4";
import Audio from "./Audio";
import Battery from "./Battery";
import Bluetooth from "./Bluetooth";
import Brightness from "./Brightness";
import Clients from "./Clients";
import Clock from "./Clock";
import Hardware from "./Hardware";
import Inhibit from "./Inhibit";
import Network from "./Network";
import Power from "./Power";
import Search from "./Search";
import Submap from "./Submap";
import Systray from "./Systray";
import Title from "./Title";
import Traffic from "./Traffic";
import Updates from "./Updates";
import Weather from "./Weather";
import Workspaces from "./Workspaces";

const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

export default (gdkmonitor: Gdk.Monitor) => (
  <window
    visible
    cssClasses={["bar"]}
    gdkmonitor={gdkmonitor}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={TOP | LEFT | RIGHT}
  >
    <centerbox>
      <box>
        <Power />
        <Search />
        {Workspaces(gdkmonitor)}
        <Clients />
        <Submap />
        <Title />
      </box>
      <box />
      <box halign={Gtk.Align.END} spacing={8}>
        <Traffic />
        <Weather />
        <Updates />
        <Hardware />
        <Network />
        <Bluetooth />
        <Inhibit />
        <Audio />
        {Brightness(gdkmonitor)}
        <Battery />
        <Clock />
        <Systray />
      </box>
    </centerbox>
  </window>
);
