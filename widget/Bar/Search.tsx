import Astal from "gi://Astal";
import { subprocess } from "astal";

const actions = {
  [Astal.MouseButton.PRIMARY]: () => subprocess("rofi -show"),
};

export default () => (
  <button onClickRelease={(_, { button }) => actions[button]?.()}>
    <icon icon="system-search-symbolic" />
  </button>
);
