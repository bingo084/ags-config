import { subprocess, Variable } from "astal";
import { Gtk } from "astal/gtk4";

interface Updates {
  count: number;
  packages: {
    name: string;
    description: string;
    old_version: string;
    new_version: string;
    aur: boolean;
    url: string;
    install_reason: string;
    dependency: boolean;
  }[];
}

const important_pkgs = ["linux", "nvidia-open-dkms", "mesa"];

const level = (v: number, l1: number, l2: number, l3: number) => [
  v < l1 ? "none" : v < l2 ? "updatable" : v < l3 ? "warning" : "critical",
];

const actions: Record<number, () => void> = {
  2: () => subprocess("kitty ./script/installupdates.sh"),
  3: () => refresh(),
};

const updates = Variable({ count: 0, packages: [] } as Updates).poll(
  3600_000,
  "./script/updates.sh",
  (out) => (classNames.set([]), JSON.parse(out)),
);
const classNames = Variable(["spin"]);

const refresh = () => (
  spin(), updates.isPolling() && updates.stopPoll(), updates.startPoll()
);
const spin = () => classNames.set(["spin"]);
Object.assign(globalThis, { updates: { spin, refresh } });

const packages = updates((v) =>
  v.packages
    .map((pkg) => {
      const { name, old_version, new_version, aur, dependency } = pkg;
      const [oldMajor, oldMinor] = old_version.split(".").map(Number);
      const [newMajor, newMinor] = new_version.split(".").map(Number);
      const majorUpdate = !dependency && newMajor > oldMajor;
      const minorUpdate = !dependency && !majorUpdate && newMinor > oldMinor;
      const important = important_pkgs.includes(name);
      const sort =
        (majorUpdate ? 10 : minorUpdate ? 20 : !dependency ? 30 : 40) +
        (aur ? 40 : 0) +
        (!important ? 1 : 0);
      return {
        ...pkg,
        majorUpdate,
        minorUpdate,
        important,
        sort,
      };
    })
    .sort((a, b) => a.sort - b.sort),
);

export default () => (
  <menubutton
    cssClasses={["updates"]} /* visible={updates(({ count }) => count > 0)} */
  >
    <box
      onButtonReleased={(_, state) => actions[state.get_button()]?.()}
      cssClasses={updates(({ count }) => level(count, 1, 25, 50))}
      spacing={8}
    >
      <image cssClasses={classNames()} iconName="synchronizing-symbolic" />
      <label label={updates(({ count }) => `${count}`)} />
    </box>
    <popover hasArrow={false}>
      <box orientation={Gtk.Orientation.VERTICAL}>
        {packages.as((pkgs) => {
          const maxName = Math.max(...pkgs.map((p) => p.name.length));
          const maxOld = Math.max(...pkgs.map((p) => p.old_version.length));
          return pkgs.map((pkg) => (
            <box spacing={8}>
              <Gtk.LinkButton
                uri={pkg.url}
                tooltipMarkup={`<b>${pkg.description}</b>`}
              >
                <box spacing={8}>
                  <image iconName="package-x-generic-symbolic" />
                  <label
                    cssClasses={[
                      pkg.majorUpdate ? "critical" : "",
                      pkg.minorUpdate ? "warning" : "",
                      pkg.important ? "important" : "",
                      pkg.aur ? "aur" : "",
                      pkg.dependency ? "dependency" : "",
                    ]}
                    widthChars={maxName * 0.8}
                    xalign={0}
                    label={pkg.name}
                  />
                </box>
              </Gtk.LinkButton>
              <label
                cssClasses={["critical"]}
                widthChars={maxOld * 0.85}
                xalign={0}
                label={pkg.old_version}
              />
              <label
                cssClasses={["newVersion"]}
                xalign={0}
                label={pkg.new_version}
              />
            </box>
          ));
        })}
      </box>
    </popover>
  </menubutton>
);
