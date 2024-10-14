import bar from "./bar";
import callendar from "./calendar";

App.config({
  style: "./style.css",
  windows: [bar(), callendar],
});

Utils.monitorFile(`${App.configDir}/style.css`, function () {
  App.resetCss();
  App.applyCss(`${App.configDir}/style.css`);
});

export {};
