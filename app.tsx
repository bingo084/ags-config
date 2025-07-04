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
  ["tail", "-n", "0", "-f", `${GLib.get_home_dir()}/.cache/ags/ags.log`],
  (out) => {
    const warning = out.includes("WARNING");
    const critical = out.includes("CRITICAL");
    if (!warning && !critical) return;
    execAsync([
      "notify-send",
      "-a",
      "AGS",
      "-u",
      warning ? "normal" : "critical",
      "-i",
      `${GLib.get_user_config_dir()}/ags/icons/hicolor/scalable/apps/ags.svg`,
      `${warning ? "⚠️" : "❌"} ${out.split(" ")[1]}`,
      out.split(" ").slice(4).join(" "),
    ]).catch((e) => print("notify-send error:", e));
  },
);
app.connect("shutdown", () => proc.kill());
