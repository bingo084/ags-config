import { GLib, subprocess } from "astal";

export default () => (
  <button onClicked={() => subprocess("wlogout")}>
    <image iconName={GLib.get_os_info("LOGO") || "missing-symbolic"} />
  </button>
);
