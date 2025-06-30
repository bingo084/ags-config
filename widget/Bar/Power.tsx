import { subprocess } from "ags/process";
import GLib from "gi://GLib";

export default () => (
  <button onClicked={() => subprocess("wlogout")}>
    <image iconName={GLib.get_os_info("LOGO") || "missing-symbolic"} />
  </button>
);
