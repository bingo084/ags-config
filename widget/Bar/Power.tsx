import Astal from "gi://Astal";
import { GLib, subprocess } from "astal";

const actions = {
  [Astal.MouseButton.PRIMARY]: () => subprocess("wlogout"),
};

export default () => (
  <button onClickRelease={(_, { button }) => actions[button]?.()}>
    {/* <icon icon="system-shutdown-symbolic" /> */}
    <icon icon={GLib.get_os_info("LOGO") || "missing-symbolic"} />
  </button>
);
