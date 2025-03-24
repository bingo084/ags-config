import { App, Gdk, Gtk } from "astal/gtk3";
import Bar from "./widget/Bar";
import Calendar from "./widget/Calendar";
import { exec, monitorFile } from "astal";

const scss = "./style.scss";
const css = "/tmp/style.css";
exec(`sass ${scss} ${css}`);

App.add_icons("./asset/icon");

App.start({
  css: css,
  main() {
    const bars = new Map<Gdk.Monitor, Gtk.Widget>();

    for (const gdkmonitor of App.get_monitors()) {
      bars.set(gdkmonitor, Bar(gdkmonitor));
    }

    App.connect("monitor-added", (_, gdkmonitor) => {
      bars.set(gdkmonitor, Bar(gdkmonitor));
    });

    App.connect("monitor-removed", (_, gdkmonitor) => {
      bars.get(gdkmonitor)?.destroy();
      bars.delete(gdkmonitor);
    });

    Calendar();
  },
  requestHandler(js, res) {
    App.eval(js).then(res).catch(res);
  },
});

monitorFile(
  `./style.scss`,
  () => (exec(`sass ${scss} ${css}`), App.apply_css(css, true)),
);
