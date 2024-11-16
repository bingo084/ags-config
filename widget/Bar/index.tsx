import { App, Astal, Gdk } from "astal/gtk3";
import Audio from "./Audio";

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
      <box></box>
      <box />
      <box>
        <Audio />
      </box>
    </centerbox>
  </window>
);
