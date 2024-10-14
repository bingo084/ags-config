const date = Variable("", {
  poll: [1000, "date '+%a, %b %d  %H:%M'"],
});

export default Widget.EventBox({
  onPrimaryClickRelease: () => App.toggleWindow("calendar"),
  child: Widget.Label({
    className: "clock",
    label: date.bind(),
  }),
});
