import { disk } from "variables";

export default Widget.Box({
  spacing: 8,
  tooltipText: disk
    .bind()
    .as(
      ({ size, used, use, mount_on }) =>
        `${used} used out of ${size} on ${mount_on} (${use})`,
    ),
  children: [
    Widget.Icon("drive-harddisk-symbolic"),
    Widget.Label({
      label: disk.bind().as(({ use }) => {
        return use || "";
      }),
    }),
  ],
});
