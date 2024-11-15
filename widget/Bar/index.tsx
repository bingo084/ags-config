import { App, Astal, Gdk } from "astal/gtk3";

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
    <centerbox></centerbox>
  </window>
);
