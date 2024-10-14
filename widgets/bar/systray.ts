const systemtray = await Service.import("systemtray");

export default Widget.Box({
  children: systemtray.bind("items").as((items) =>
    items.map((item) =>
      Widget.Button({
        child: Widget.Icon({ icon: item.bind("icon") }),
        onPrimaryClick: (_, event) => item.activate(event),
        onSecondaryClick: (_, event) => item.openMenu(event),
        tooltipMarkup: item.bind("tooltip_markup"),
      }),
    ),
  ),
});
