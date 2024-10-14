import { temp } from "variables";

export default Widget.Box({
  children: [
    Widget.Label({
      label: temp.bind().as(({ cpu }) => cpu || ""),
    }),
  ],
});
