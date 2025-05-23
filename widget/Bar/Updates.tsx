import { subprocess, Variable } from "astal";
import { astalify, Gtk } from "astal/gtk4";

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

const Grid = astalify<Gtk.Grid, Gtk.Grid.ConstructorProps>(Gtk.Grid);

export default () => (
  <menubutton
    cssClasses={["updates"]}
    visible={updates(({ count }) => count > 0)}
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
      {packages.as((pkgs) => (
        <Gtk.ScrolledWindow
          hscrollbarPolicy={Gtk.PolicyType.NEVER}
          vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
          heightRequest={Math.min(pkgs.length * 24 + 1, 900)}
        >
          <Grid
            setup={(self) => {
              self.set_column_spacing(8);
              pkgs.forEach((pkg, row) => {
                const name = (
                  <Gtk.LinkButton uri={pkg.url} tooltipText={pkg.description}>
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
                        label={pkg.name}
                      />
                    </box>
                  </Gtk.LinkButton>
                );
                const oldVersion = (
                  <label
                    cssClasses={["critical"]}
                    xalign={0}
                    label={pkg.old_version}
                  />
                );
                const newVersion = (
                  <label
                    cssClasses={["newVersion"]}
                    xalign={0}
                    label={pkg.new_version}
                  />
                );
                [name, oldVersion, newVersion].forEach((widget, col) => {
                  self.attach(widget, col, row, 1, 1);
                });
              });
            }}
          />
        </Gtk.ScrolledWindow>
      ))}
    </popover>
  </menubutton>
);
