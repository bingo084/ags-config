import weather, { Location } from "services/weather";

App.addIcons(`${App.configDir}/assets/icons/weather`);

const formatLocation = (ad_info: Location["ad_info"]) => {
  if (!ad_info) return "";
  const { province, city, district } = ad_info;
  return district ? `${city}/${district}` : `${province}/${city}`;
};
const formatTime = (time: string) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default Widget.EventBox({
  onPrimaryClickRelease: () => weather.refresh(),
  onMiddleClickRelease: () => Utils.exec(`xdg-open "${weather.now.fx_link}"`),
  child: Widget.Box({
    spacing: 8,
    tooltipMarkup: weather.bind("now").as(
      ({
        location: { ad_info },
        obs_time,
        temp,
        feels_like,
        text,
        wind_dir,
        wind_scale,
        wind_speed,
        humidity,
        precip,
        pressure,
        vis,
        cloud,
        dew,
      }) => `当前位置：${formatLocation(ad_info)}
观测时间：${formatTime(obs_time)}
实时温度：${temp}°C
体感温度：${feels_like}°C
天气状况：${text}
风向风力：${wind_dir}，${wind_scale}级，${wind_speed}公里/小时
相对湿度：${humidity}%
小时降水：${precip}毫米
大气压强：${pressure}百帕
能   见  度：${vis}公里
云          量：${cloud}%
露点温度：${dew}°C`,
    ),
    children: [
      Widget.Icon({
        icon: weather.now.bind("icon"),
      }),
      Widget.Label({
        label: weather.now.bind("temp").as((temp) => (temp ? `${temp}°C` : "")),
      }),
    ],
  }),
});
