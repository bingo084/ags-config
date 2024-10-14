const hyprland = await Service.import("hyprland");

const dispatch = (dispatcher: string, ws: string | number) =>
  hyprland.messageAsync(`dispatch ${dispatcher} ${ws}`);
const activeId = hyprland.active.workspace.bind("id");
const defaultIds = [1, 2, 3, 4, 5];

export default Widget.EventBox({
  className: "workspaces",
  onScrollUp: () => dispatch("workspace", "-1"),
  onScrollDown: () => dispatch("workspace", "+1"),
  child: Widget.Box({
    children: hyprland.bind("workspaces").as((ws) =>
      [...new Set([...defaultIds, ...ws.map(({ id }) => id)])]
        .sort((a, b) => a - b)
        .map((id) =>
          Widget.Button({
            className: activeId.as((i) => (i === id ? "focused" : "")),
            onClicked: () => dispatch("workspace", id),
            child: Widget.Label(`${id}`),
          }),
        ),
    ),
  }),
});
