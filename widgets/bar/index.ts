import audio from "./audio";
import brightness from "./brightness";
import bluetooth from "./bluetooth";
import clients from "./clients";
import coffee from "./coffee";
import disk from "./disk";
import hardware from "./hardware";
import network from "./network";
import power from "./power";
import search from "./search";
import temp from "./temp";
import title from "./title";
import traffic from "./traffic";
import updates from "./updates";
import workspaces from "./workspaces";
import battery from "./battery";
import clock from "./clock";
import systray from "./systray";

const Left = Widget.Box({
  spacing: 8,
  children: [power, search, workspaces, clients, title],
});

const Center = Widget.Box({
  spacing: 8,
  children: [],
});

const Right = Widget.Box({
  hpack: "end",
  spacing: 8,
  children: [
    traffic,
    updates,
    disk,
    hardware,
    temp,
    network,
    bluetooth,
    coffee,
    audio,
    brightness,
    battery,
    clock,
    systray,
  ],
});

export default (monitor = 0) =>
  Widget.Window({
    name: `bar-${monitor}`,
    className: "bar",
    monitor,
    anchor: ["top", "left", "right"],
    exclusivity: "exclusive",
    child: Widget.CenterBox({
      startWidget: Left,
      centerWidget: Center,
      endWidget: Right,
    }),
  });
