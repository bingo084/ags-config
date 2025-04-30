import { subprocess } from "astal";

export default () => (
  <button onClicked={() => subprocess("rofi -show")}>
    <image iconName="system-search-symbolic" />
  </button>
);
