import { App, Astal, Gdk } from "astal/gtk3";
import Audio from "./Audio";
import Battery from "./Battery";
import Bluetooth from "./Bluetooth";
import Brightness from "./Brightness";
import Clients from "./Clients";
import Clock from "./Clock";

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
      <box>
        <Clients />
      </box>
      <box />
      <box>
        <Bluetooth />
        <Audio />
        <Brightness />
        <Battery />
        <Clock />
      </box>
    </centerbox>
  </window>
);
