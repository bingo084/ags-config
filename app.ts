import { App, Gdk, Gtk } from "astal/gtk4";
import style from "./style.scss";
import Bar from "./widget/Bar";
import Calendar from "./widget/Calendar";
import { monitorFile } from "astal";

App.add_icons("./asset/icon");

App.start({
  css: style,
  main() {
    const bars = new Map<Gdk.Monitor, Gtk.Widget>();

    for (const gdkmonitor of App.get_monitors()) {
      bars.set(gdkmonitor, Bar(gdkmonitor));
    }

    App.connect("monitor-added", (_, gdkmonitor) => {
      bars.set(gdkmonitor, Bar(gdkmonitor));
    });

    App.connect("monitor-removed", (_, gdkmonitor) => {
      bars.get(gdkmonitor)?.unparent();
      bars.delete(gdkmonitor);
    });

    Calendar();
  },
  requestHandler(js, res) {
    App.eval(js).then(res).catch(res);
  },
});

monitorFile(`./style.scss`, () => App.apply_css("./style.scss", true));
