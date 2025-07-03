import { execAsync } from "ags/process";

export default () => (
  <button onClicked={() => execAsync("rofi -show")}>
    <image iconName="system-search-symbolic" />
  </button>
);
