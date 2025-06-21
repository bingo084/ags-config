import { App } from "astal/gtk4";
import style from "./style.scss";
import Bar from "./widget/Bar";
import { exec, execAsync, GLib, monitorFile, Variable } from "astal";

App.add_icons("./asset/icon");

// add icons don't support color symbolic icons, copy them to icon path manually
const target = `${GLib.get_user_data_dir()}/icons/hicolor/symbolic/apps`;
const source = `${GLib.get_user_config_dir()}/ags/asset/icon/*-symbolic.svg`;
exec(["bash", "-c", `mkdir -p ${target} && cp ${source} ${target}`]);

App.start({
  css: style,
  main() {
    App.get_monitors().forEach(Bar);
  },
  requestHandler(js, res) {
    App.eval(js).then(res).catch(res);
  },
});

monitorFile(`./style.scss`, () => App.apply_css("./style.scss", true));

Variable("")
  .watch(["tail", "-n", "0", "-f", `${GLib.get_home_dir()}/.cache/ags/ags.log`])
  .subscribe((out) => {
    const warning = out.includes("Gjs-WARNING");
    const critical = out.includes("Gjs-CRITICAL");
    if (!warning && !critical) return;
    execAsync([
      "notify-send",
      "-a",
      "AGS",
      "-u",
      warning ? "normal" : "critical",
      "-i",
      `${GLib.get_user_config_dir()}/ags/asset/icon/apps/ags.svg`,
      warning ? "⚠️ GJS Warning" : "❌ GJS Critical",
      out.split(" ").slice(4).join(" "),
    ]).catch((e) => print("notify-send error:", e));
  });
