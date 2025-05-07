import { App, Gdk, Gtk } from "astal/gtk4";
import style from "./style.scss";
import Bar from "./widget/Bar";
import Calendar from "./widget/Calendar";
import { monitorFile } from "astal";

App.add_icons("./asset/icon");

App.start({
  css: style,
  main() {
    App.get_monitors().forEach(Bar);

    Calendar();
  },
  requestHandler(js, res) {
    App.eval(js).then(res).catch(res);
  },
});

monitorFile(`./style.scss`, () => App.apply_css("./style.scss", true));
