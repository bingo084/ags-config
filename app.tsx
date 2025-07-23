import app from "ags/gtk4/app";
import style from "./style.scss";
import Bar from "./widgets/Bar";
import { monitorFile } from "ags/file";
import { execAsync, subprocess } from "ags/process";
import GLib from "gi://GLib";
import { createBinding, For } from "ags";
import { Gtk } from "ags/gtk4";
import "./components/emenubutton";
import "./components/ebutton";
import "./components/ebox";
import "./components/popupmenu";

app.start({
  css: style,
  icons: `${GLib.get_user_config_dir()}/ags/icons`,
  main() {
    const monitors = createBinding(app, "monitors");
    <For each={monitors} cleanup={(win) => (win as Gtk.Window).destroy()}>
      {(monitor) => <Bar gdkmonitor={monitor} />}
    </For>;
  },
  requestHandler(js, res) {
    app.eval(js).then(res).catch(res);
  },
});

monitorFile(`./style.scss`, () => app.apply_css("./style.scss", true));

const proc = subprocess(
  ["journalctl", "--user-unit", "ags.service", "-n", "0", "-f", "-o", "json"],
  (out) => {
    const log = JSON.parse(out);
    const warning = log.PRIORITY === "4";
    const critical = log.PRIORITY === "3";
    if (!warning && !critical) return;
    execAsync([
      "notify-send",
      "-a",
      "AGS",
      "-u",
      warning ? "normal" : "critical",
      "-i",
      `${GLib.get_user_config_dir()}/ags/icons/hicolor/scalable/apps/ags.svg`,
      `${warning ? "⚠️ AGS Warning" : "❌ AGS Critical"}`,
      log.MESSAGE,
    ]).catch((e) => print("notify-send error:", e));
  },
);
app.connect("shutdown", () => proc.kill());
