import Hyprland from "gi://AstalHyprland";
import { bind } from "astal";

const hyprland = Hyprland.get_default();

const dispatch = (ws: string | number) =>
  hyprland.message(`dispatch workspace ${ws}`);

const fw = bind(hyprland, "focusedWorkspace");

export default () => (
  <eventbox
    onScroll={(_, { delta_y }) =>
      delta_y != 0 && dispatch(delta_y > 0 ? "+1" : "-1")
    }
  >
    <box>
      {bind(hyprland, "workspaces").as((wss) =>
        wss
          .filter(({ id }) => id > 0)
          .sort((w1, w2) => w1.id - w2.id)
          .map((ws) => (
            <button
              className={fw.as((fw) => `${fw === ws && "focused"}`)}
              onClickRelease={() => ws.focus()}
            >
              {ws.id}
            </button>
          )),
      )}
    </box>
  </eventbox>
);
