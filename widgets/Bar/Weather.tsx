import { execAsync } from "ags/process";
import Weather, { Location } from "../../libs/weather";
import { createBinding } from "ags";

const weather = Weather.get_default();

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
const trans = (icon: string = "qweather") =>
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
  })[icon] || `weather-${icon}-symbolic`;

export default () => (
  <emenubutton
    visible={createBinding(weather, "now")(Boolean)}
    onMiddleUp={() => execAsync(`xdg-open "${weather.now?.fxLink}"`)}
    onRightUp={() => weather.refresh()}
  >
    <box spacing={4}>
      <image iconName={createBinding(weather, "now")((v) => trans(v?.icon))} />
      <label label={createBinding(weather, "now")((v) => `${v?.temp}°C`)} />
    </box>
    <popover hasArrow={false}>
      <label
        useMarkup={true}
        label={createBinding(weather, "now").as((v) =>
          v
            ? `当前位置：${formatLocation(v.location.ad_info)}
观测时间：${formatTime(v.obsTime)}
实时温度：${v.temp}°C
体感温度：${v.feelsLike}°C
天气状况：${v.text}
风向风力：${v.windDir}，${v.windScale}级，${v.windSpeed}公里/小时
相对湿度：${v.humidity}%
小时降水：${v.precip}毫米
大气压强：${v.pressure}百帕
能  见  度：${v.vis}公里
云         量：${v.cloud}%
露点温度：${v.dew}°C`
            : "未获取到天气信息",
        )}
      />
    </popover>
  </emenubutton>
);
