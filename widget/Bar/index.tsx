import { Astal, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
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
    name="bar"
    gdkmonitor={gdkmonitor}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={TOP | LEFT | RIGHT}
    application={app}
  >
    <centerbox>
      <box $type="start">
        <Power />
        <Search />
        {Workspaces(gdkmonitor)}
        {Clients(gdkmonitor)}
        <Submap />
        <Title />
      </box>
      <box $type="end">
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
