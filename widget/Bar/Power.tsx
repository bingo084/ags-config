import Astal from "gi://Astal";
import { subprocess } from "astal";

const actions = {
  [Astal.MouseButton.PRIMARY]: () => subprocess("wlogout"),
};

export default () => (
  <button onClickRelease={(_, { button }) => actions[button]?.()}>
    <icon icon="system-shutdown-symbolic" />
  </button>
);
