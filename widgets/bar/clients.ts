const hyprland = await Service.import("hyprland");
const { query } = await Service.import("applications");
const activeClient = hyprland.active.client.bind("address");
const dispatch = (dispatcher: string, ws: string | number) =>
  hyprland.messageAsync(`dispatch ${dispatcher} ${ws}`);

export default Widget.Box({
  className: "clients",
  children: hyprland.bind("clients").as((clients) =>
    clients
      .sort((c1, c2) =>
        c1.workspace.id - c2.workspace.id != 0
          ? c1.workspace.id - c2.workspace.id
          : c1.at[0] - c2.at[0] != 0
            ? c1.at[0] - c2.at[0]
            : c1.at[1] - c2.at[1],
      )
      .map(({ address, class: clazz, title }) =>
        Widget.Button({
          className: activeClient.as((a) => (a === address ? "focused" : "")),
          onClicked: () => dispatch("focuswindow", `address:${address}`),
          onMiddleClick: () => dispatch("closewindow", `address:${address}`),
          child: Widget.Icon(query(clazz)[0]?.icon_name || "image-missing"),
          tooltipText: title,
        }),
      ),
  ),
});
