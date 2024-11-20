import { App, Astal, Gdk, Gtk } from "astal/gtk3";
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

export default (gdkmonitor: Gdk.Monitor) => (
  <window
    name={`bar-${gdkmonitor.display.get_n_monitors()}`}
    className="bar"
    gdkmonitor={gdkmonitor}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.RIGHT
    }
    application={App}
  >
    <centerbox>
      <box className="left">
        <Power />
        <Search />
        <Clients />
        <Submap />
        <Title />
      </box>
      <box />
      <box className="right" halign={Gtk.Align.END} spacing={8}>
        <Traffic />
        <Updates />
        <Hardware />
        <Network />
        <Bluetooth />
        <Inhibit />
        <Audio />
        <Brightness />
        <Battery />
        <Clock />
        <Systray />
      </box>
    </centerbox>
  </window>
);
