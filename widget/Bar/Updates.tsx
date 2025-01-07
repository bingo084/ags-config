import { subprocess, Variable } from "astal";
import Astal from "gi://Astal";

interface Updates {
  count: number;
  packages: {
    name: string;
    old_version: string;
    new_version: string;
    aur?: boolean;
  }[];
}

const important_pkgs = ["linux", "nvidia-open-dkms", "mesa"];

const level = (v: number, l1: number, l2: number, l3: number) =>
  v < l1 ? "" : v < l2 ? "updatable" : v < l3 ? "warning" : "critical";

const actions = {
  [Astal.MouseButton.PRIMARY]: () => refresh(),
  [Astal.MouseButton.MIDDLE]: () =>
    subprocess("kitty ./script/installupdates.sh"),
};

const updates = Variable({ count: 0, packages: [] } as Updates).poll(
  60 * 60 * 1000,
  "./script/updates.sh",
  (out) => (className.set(""), JSON.parse(out)),
);
const className = Variable("spin");

const refresh = () => (
  spin(), updates.isPolling() && updates.stopPoll(), updates.startPoll()
);
const spin = () => className.set("spin");
Object.assign(globalThis, { updates: { spin, refresh } });

export default () => (
  <eventbox
    visible={updates(({ count }) => count > 0)}
    onClickRelease={(_, { button }) => actions[button]?.()}
  >
    <box
      className={updates(({ count }) => level(count, 1, 25, 50))}
      spacing={8}
      tooltipMarkup={updates(({ packages }) => {
        const maxName = Math.max(...packages.map(({ name }) => name.length));
        const maxOld = Math.max(
          ...packages.map(({ old_version }) => old_version.length),
        );
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
      })}
    >
      <icon className={className()} icon="emblem-synchronizing-symbolic" />
      <label label={updates(({ count }) => `${count}`)} />
    </box>
  </eventbox>
);
