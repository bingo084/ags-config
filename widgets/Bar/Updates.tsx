import { createState, With } from "ags";
import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { interval } from "ags/time";

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

const level = (v: number, l1: number, l2: number, l3: number) =>
  v < l1 ? "none" : v < l2 ? "updatable" : v < l3 ? "warning" : "critical";

const [clazz, setClass] = createState("spin");
const [updates, setUpdates] = createState({
  count: 0,
  packages: [],
} as Updates);

const spin = () => setClass("spin");
const refresh = () => {
  spin();
  execAsync("./scripts/updates.sh")
    .then((out) => setUpdates(JSON.parse(out)))
    .finally(() => setClass(""));
};

interval(3600_000, () => refresh());
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
  <emenubutton
    cssClasses={["updates"]}
    visible={updates(({ count }) => count > 0)}
    onMiddleUp={() => execAsync("kitty ./scripts/installupdates.sh")}
    onRightUp={() => refresh()}
  >
    <box class={updates(({ count }) => level(count, 1, 25, 50))} spacing={8}>
      <image class={clazz} iconName="emblem-synchronizing-symbolic" />
      <label label={updates(({ count }) => `${count}`)} />
    </box>
    <popover hasArrow={false}>
      <With value={packages}>
        {(pkgs) => (
          <scrolledwindow
            hscrollbarPolicy={Gtk.PolicyType.NEVER}
            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            heightRequest={Math.min(pkgs.length * 24, 900)}
          >
            <Gtk.Grid
              $={(self) => {
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
                      class="critical"
                      xalign={0}
                      label={pkg.old_version}
                    />
                  );
                  const newVersion = (
                    <label
                      class="newVersion"
                      xalign={0}
                      label={pkg.new_version}
                    />
                  );
                  [name, oldVersion, newVersion].forEach((widget, col) => {
                    self.attach(widget as Gtk.Widget, col, row, 1, 1);
                  });
                });
              }}
            />
          </scrolledwindow>
        )}
      </With>
    </popover>
  </emenubutton>
);
