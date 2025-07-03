import { execAsync } from "ags/process";
import GLib from "gi://GLib";

export default () => (
  <button onClicked={() => execAsync("wlogout")}>
    <image iconName={GLib.get_os_info("LOGO") || "missing-symbolic"} />
  </button>
);
