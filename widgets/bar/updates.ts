import { updates } from "variables";

export default Widget.EventBox({
  child: Widget.Box({
    className: "updates",
    spacing: 8,
    tooltipMarkup: updates.bind().as(({ packages }) => {
      const maxName = Math.max(...packages.map(({ name }) => name.length));
      const maxOld = Math.max(
        ...packages.map(({ old_version }) => old_version.length),
      );
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
      Widget.Icon("emblem-synchronizing-symbolic"),
      Widget.Label({
        label: updates.bind().as(({ count }) => `${count}`),
      }),
    ],
  }),
});
