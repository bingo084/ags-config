import { createState } from "ags";
import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { exec, execAsync, subprocess } from "ags/process";
import { timeout } from "ags/time";
import AstalIO from "gi://AstalIO?version=0.1";

interface Inhibit {
  process?: AstalIO.Process;
  what: string;
}

const create = (what: string) =>
  subprocess(
    `systemd-inhibit --what=${what} --who=Ags --why='Manual inhibit ${what}' sleep infinity`,
  );

const [inhibit, setInhibit] = createState<Inhibit>({ what: "off" });
app.connect("shutdown", () => inhibit.get().process?.kill());

export default () => (
  <emenubutton
    onRightUp={() => {
      const { what, process } = inhibit.get();
      if (what === "off") {
        setInhibit({ what: "sleep", process: create("sleep") });
      } else if (what === "sleep") {
        process?.kill();
        setInhibit({ what: "idle", process: create("idle") });
      } else {
        process?.kill();
        setInhibit({ what: "off" });
      }
    }}
  >
    <image iconName="coffee-symbolic" class={inhibit(({ what }) => what)} />
    <popover hasArrow={false}>
      <label label={inhibit(({ what }) => `Inhibit ${what}`)} />
    </popover>
  </emenubutton>
);
