import { updates } from "variables";

const icon = Widget.Icon({
  className: "rotate",
  icon: "emblem-synchronizing-symbolic",
});

globalThis.checkUpdates = () => {
  icon.class_name = "rotate";
};

globalThis.refreshUpdates = () => {
  if (updates.is_listening) {
    updates.stopListen();
  }
  updates.startListen();
};

export default Widget.EventBox({
  onPrimaryClickRelease: () => {
    globalThis.checkUpdates();
    globalThis.refreshUpdates();
  },
  onMiddleClickRelease: () =>
    Utils.subprocess([
      "bash",
      "-c",
      `$TERMINAL -e ${App.configDir}/scripts/installupdates.sh >/dev/null 2>&1`,
    ]),
  child: Widget.Box({
    className: "updates",
    spacing: 8,
    tooltipMarkup: updates.bind().as(({ packages }) => {
      const maxName = Math.max(...packages.map(({ name }) => name.length));
      const maxOld = Math.max(
        ...packages.map(({ old_version }) => old_version.length),
      );
      icon.class_name = "";
      return packages.length == 0
        ? "No updates"
        : packages
            .map(
              ({ name, old_version, new_version }) =>
                ` ${name.padEnd(maxName + 2)}<span color="red">${old_version.padEnd(maxOld + 2)}</span><span color="green">${new_version}</span>`,
            )
            .join("\n");
    }),
    children: [
      icon,
      Widget.Label({
        label: updates.bind().as(({ count }) => `${count}`),
      }),
    ],
  }),
});
