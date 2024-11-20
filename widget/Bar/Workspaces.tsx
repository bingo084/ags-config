import Hyprland from "gi://AstalHyprland";
import { bind } from "astal";

const hyprland = Hyprland.get_default();

const dispatch = (ws: string | number) =>
  hyprland.message(`dispatch workspace ${ws}`);
const focused = bind(hyprland, "focusedWorkspace");
const defaultIds = [1, 2, 3, 4, 5];

export default () => (
  <eventbox
    className="workspaces"
    onScroll={(_, { delta_y }) => dispatch(delta_y < 0 ? "+1" : "-1")}
  >
    <box>
      {bind(hyprland, "workspaces").as((ws) => {
        const existingIds = new Set(ws.map(({ id }) => id));
        return [
          ...defaultIds
            .filter((id) => !existingIds.has(id))
            .map((id) => ({ id, hasFullscreen: false })),
          ...ws,
        ]
          .filter(({ id }) => id > 0)
          .sort((w1, w2) => w1.id - w2.id)
          .map(({ id, hasFullscreen }) => (
            <button
              className={focused.as(
                ({ id: focusedId }) =>
                  `${focusedId === id && "focused"} ${hasFullscreen && "fullscreen"}`,
              )}
              onClickRelease={() => dispatch(id)}
            >
              <label label={`${id}`} />
            </button>
          ));
      })}
    </box>
  </eventbox>
);
