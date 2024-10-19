import GLib from "gi://GLib";

interface Secret {
  weather_key: string;
  tencent_map: {
    key: string;
    secret_key: string;
  };
}
interface Location {
  ip: string;
  location: {
    lat: number;
    lng: number;
  };
  ad_info: {
    nation: string;
    province: string;
    city: string;
    district: string;
    adcode: number;
    nation_code: number;
  };
}
interface Weather {
  code: string;
  updateTime: string;
  fxLink: string;
  now: {
    obsTime: string;
    temp: string;
    feelsLike: string;
    icon: string;
    text: string;
    wind360: string;
    windDir: string;
    windScale: string;
    windSpeed: string;
    humidity: string;
    precip: string;
    pressure: string;
    vis: string;
    cloud?: string;
    dew?: string;
  };
}

class WeatherService extends Service {
  static {
    Service.register(
      this,
      {},
      {
        fx_link: ["string"],
        now: ["jsobject"],
      },
    );
  }

  private _fxLink = "";
  private _now = {} as Weather["now"];

  get fx_link() {
    return this._fxLink;
  }

  get now() {
    return this._now;
  }

  constructor() {
    super();
    this.sync();
    setInterval(() => this.sync(), 10 * 60 * 1000);
  }

  async sync() {
    const { weather_key, tencent_map } = this._secret();
    const location = await this._location(tencent_map);
    if (!location) return;
    const { lat, lng } = location.location;
    const url = `https://devapi.qweather.com/v7/weather/now?key=${weather_key}&location=${lng},${lat}`;
    const res = await Utils.fetch(url);
    const weather = (await res.json()) as Weather;
    this.updateProperty("fx_link", weather.fxLink);
    this.updateProperty("now", weather.now);
    this.emit("changed");
  }

  private _secret() {
    const path = GLib.get_user_data_dir() + "/ags/.secret.json";
    return JSON.parse(Utils.readFile(path) || "{}") as Secret;
  }

  private async _location({ key, secret_key }: Secret["tencent_map"]) {
    const url = "https://apis.map.qq.com";
    const api = `/ws/location/v1/ip?key=${key}`;
    const sig = Utils.exec([
      "bash",
      "-c",
      `echo -n "${api}${secret_key}" | md5sum | awk '{print $1}'`,
    ]);
    try {
      const res = await Utils.fetch(`${url}${api}&sig=${sig}`);
      const json = await res.json();
      return json.result as Location;
    } catch (e) {
      console.log(e);
    }
  }
}

export const weather = new WeatherService();
export default weather;
