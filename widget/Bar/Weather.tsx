import { App } from "astal/gtk4";
import Weather, { Location } from "../../lib/weather";
import { bind, exec } from "astal";

const weather = Weather.get_default();

App.add_icons("./asset/icon/weather");

const formatLocation = (ad_info: Location["ad_info"]) => {
  if (!ad_info) return "";
  const { province, city, district } = ad_info;
  return district ? `${city}/${district}` : `${province}/${city}`;
};
const formatTime = (time: string) => {
  const date = new Date(time);
  const outdate = new Date().getTime() - date.getTime() > 1000 * 60 * 60;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `<span ${outdate ? 'color="red"' : ""}>${year}-${month}-${day} ${hours}:${minutes}:${seconds}</span>`;
};
const transIcon = (icon: string) =>
  ({
    "100": "weather-clear-symbolic",
    "101": "weather-few-clouds-symbolic",
    "102": "weather-few-clouds-symbolic",
    "103": "weather-few-clouds-symbolic",
    "104": "weather-overcast-symbolic",
    "150": "weather-clear-night-symbolic",
    "151": "weather-few-clouds-night-symbolic",
    "152": "weather-few-clouds-night-symbolic",
    "153": "weather-few-clouds-night-symbolic",
    "302": "weather-storm-symbolic",
    "303": "weather-storm-symbolic",
    "304": "weather-storm-symbolic",
    "305": "weather-showers-scattered-symbolic",
    "399": "weather-showers-scattered-symbolic",
    "306": "weather-showers-symbolic",
    "307": "weather-showers-symbolic",
    "308": "weather-showers-symbolic",
    "400": "weather-snow-symbolic",
    "401": "weather-snow-symbolic",
    "402": "weather-snow-symbolic",
    "403": "weather-snow-symbolic",
    "499": "weather-snow-symbolic",
    "501": "weather-fog-symbolic",
    "2051": "weather-windy-symbolic",
    "2425": "weather-severe-alert-symbolic",
  })[icon] || icon;

const actions: Record<number, () => void> = {
  1: () => weather.refresh(),
  2: () => exec(`xdg-open "${weather.now?.fxLink}"`),
};

export default () => (
  <box
    onButtonReleased={(_, state) => actions[state.get_button()]?.()}
    spacing={8}
    tooltipMarkup={bind(weather, "now").as(
      ({
        location: { ad_info },
        obsTime,
        temp,
        feelsLike,
        text,
        windDir,
        windScale,
        windSpeed,
        humidity,
        precip,
        pressure,
        vis,
        cloud,
        dew,
      }) => `当前位置：${formatLocation(ad_info)}
观测时间：${formatTime(obsTime)}
实时温度：${temp}°C
体感温度：${feelsLike}°C
天气状况：${text}
风向风力：${windDir}，${windScale}级，${windSpeed}公里/小时
相对湿度：${humidity}%
小时降水：${precip}毫米
大气压强：${pressure}百帕
能   见  度：${vis}公里
云          量：${cloud}%
露点温度：${dew}°C`,
    )}
  >
    <image iconName={bind(weather, "now").as(({ icon }) => transIcon(icon))} />
    <label label={bind(weather, "now").as(({ temp }) => `${temp}°C`)} />
  </box>
);
