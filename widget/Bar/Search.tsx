import { subprocess } from "ags/process";

export default () => (
  <button onClicked={() => subprocess("rofi -show")}>
    <image iconName="system-search-symbolic" />
  </button>
);
