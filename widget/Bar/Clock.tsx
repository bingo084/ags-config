import Astal from "gi://Astal";
import { Variable } from "astal";
import { App } from "astal/gtk3";

const date = Variable(new Date()).poll(1000, () => new Date());
const options = Variable({
  weekday: "short",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
} as Intl.DateTimeFormatOptions);
const dateStr = Variable.derive([date, options], (date, options) =>
  date.toLocaleString("en-US", options),
);

const actions = {
  [Astal.MouseButton.PRIMARY]: () => App.toggle_window("calendar"),
  [Astal.MouseButton.MIDDLE]: () =>
    options.set({
      ...options.get(),
      second: options.get().second ? undefined : "2-digit",
    }),
};

export default () => (
  <eventbox onClickRelease={(_, { button }) => actions[button]?.()}>
    <label label={dateStr()} />
  </eventbox>
);
