import { subprocess, Variable } from "astal";
import { App, Gtk } from "astal/gtk4";

interface Updates {
  count: number;
  packages: {
    name: string;
    old_version: string;
    new_version: string;
    aur?: boolean;
  }[];
}

App.add_icons("./asset/icon/synchronizing");

const important_pkgs = ["linux", "nvidia-open-dkms", "mesa"];

const level = (v: number, l1: number, l2: number, l3: number) => [
  v < l1 ? "none" : v < l2 ? "updatable" : v < l3 ? "warning" : "critical",
];

const actions: Record<number, () => void> = {
  1: () => refresh(),
  2: () => subprocess("kitty ./script/installupdates.sh"),
};

const updates = Variable({ count: 0, packages: [] } as Updates).watch(
  "./script/updates.sh",
  (out) => (classNames.set([]), JSON.parse(out)),
);
const classNames = Variable(["spin"]);

const refresh = () => (
  spin(), updates.isWatching() && updates.stopWatch(), updates.startWatch()
);
const spin = () => classNames.set(["spin"]);
Object.assign(globalThis, { updates: { spin, refresh } });

const tooltipMarkup = (packages: Updates["packages"]) => {
  if (packages.length == 0) return "No updates";
  const maxName = Math.max(...packages.map((p) => p.name.length));
  const maxOld = Math.max(...packages.map((p) => p.old_version.length));
  return packages
    .map(({ name, old_version, new_version, aur }) => {
      const [oldMajor, oldMinor] = old_version.split(".").map(Number);
      const [newMajor, newMinor] = new_version.split(".").map(Number);
      const majorUpdate = newMajor > oldMajor;
      const minorUpdate = !majorUpdate && newMinor > oldMinor;
      const important = important_pkgs.includes(name);

      const nameStyle = [
        majorUpdate ? 'color="red"' : "",
        minorUpdate ? 'color="orange"' : "",
        important ? 'weight="heavy"' : "",
        aur ? 'style="italic"' : "",
      ].join(" ");

      name = `<span ${nameStyle}> ${name.padEnd(maxName)}</span>`;
      old_version = `<span color="red">${old_version.padEnd(maxOld)}</span>`;
      new_version = `<span color="green">${new_version}</span>`;
      return `${name}  ${old_version}  ${new_version}`;
    })
    .join("\n");
};

export default () => (
  <box
    visible={updates(({ count }) => count > 0)}
    onButtonReleased={(_, state) => actions[state.get_button()]?.()}
    cssClasses={updates(({ count }) => level(count, 1, 25, 50))}
    spacing={8}
    setup={(self) => {
      self.set_has_tooltip(true);
      self.connect("query-tooltip", (_, __, ___, ____, tooltip) => {
        const label = new Gtk.Label({
          label: tooltipMarkup(updates().get().packages),
          useMarkup: true,
          wrap: false,
        });
        tooltip.set_custom(label);
        return true;
      });
    }}
  >
    <image
      cssClasses={classNames()}
      iconName={updates(
        ({ count }) => `synchronizing-${level(count, 1, 25, 50)}`,
      )}
    />
    <label label={updates(({ count }) => `${count}`)} />
  </box>
);
