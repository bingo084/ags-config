import { updates } from "variables";

const important_pkgs = ["linux", "nvidia-dkms", "mesa"];

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
          .map(({ name, old_version, new_version, aur }) => {
            const important = important_pkgs.indexOf(name) != -1;
            name = `<span ${important ? 'color="orange"' : aur ? 'color="grey"' : ""}> ${name.padEnd(maxName)}</span>`;
            old_version = `<span color="red">${old_version.padEnd(maxOld)}</span>`;
            new_version = `<span color="green">${new_version}</span>`;
            return `${name}  ${old_version}  ${new_version}`;
          })
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
