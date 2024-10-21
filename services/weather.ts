import GLib from "gi://GLib";

interface Secret {
  weather_key: string;
  tencent_map: {
    key: string;
    secret_key: string;
  };
}
export interface Location {
  ip: string;
  location: {
    lat: number;
    lng: number;
  };
  ad_info?: {
    nation: string;
    province: string;
    city: string;
    district?: string;
    adcode: number;
    nation_code: number;
  };
}
interface RealTimeResult {
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

class RealTimeWeather extends Service {
  static {
    Service.register(
      this,
      {},
      {
        "fx-link": ["string"],
        "obs-time": ["string"],
        temp: ["string"],
        "feels-like": ["string"],
        icon: ["string"],
        text: ["string"],
        wind360: ["string"],
        "wind-dir": ["string"],
        "wind-scale": ["string"],
        "wind-speed": ["string"],
        humidity: ["string"],
        precip: ["string"],
        pressure: ["string"],
        vis: ["string"],
        cloud: ["string"],
        dew: ["string"],
        location: ["jsobject"],
      },
    );
  }

  private _fxLink = "";
  private _obsTime = "";
  private _temp = "";
  private _feelsLike = "";
  private _icon = "";
  private _text = "";
  private _wind360 = "";
  private _windDir = "";
  private _windScale = "";
  private _windSpeed = "";
  private _humidity = "";
  private _precip = "";
  private _pressure = "";
  private _vis = "";
  private _cloud = "";
  private _dew = "";
  private _location = {} as Location;

  get fx_link() {
    return this._fxLink;
  }

  get obs_time() {
    return this._obsTime;
  }

  get temp() {
    return this._temp;
  }

  get feels_like() {
    return this._feelsLike;
  }

  get icon() {
    return this._icon;
  }

  get text() {
    return this._text;
  }

  get wind360() {
    return this._wind360;
  }

  get wind_dir() {
    return this._windDir;
  }

  get wind_scale() {
    return this._windScale;
  }

  get wind_speed() {
    return this._windSpeed;
  }

  get humidity() {
    return this._humidity;
  }

  get precip() {
    return this._precip;
  }

  get pressure() {
    return this._pressure;
  }

  get vis() {
    return this._vis;
  }

  get cloud() {
    return this._cloud;
  }

  get dew() {
    return this._dew;
  }

  get location() {
    return this._location;
  }

  constructor() {
    super();
    this.refresh();
    setInterval(() => this.refresh(), 10 * 60 * 1000);
  }

  async refresh() {
    const { weather_key, tencent_map } = this._secret();
    const location = await this._fetchLocation(tencent_map);
    if (!location) return;
    this.updateProperty("location", location);
    const { lat, lng } = location.location;
    const url = `https://devapi.qweather.com/v7/weather/now?key=${weather_key}&location=${lng},${lat}`;
    const res = await Utils.fetch(url);
    const weather = (await res.json()) as RealTimeResult;
    this.updateProperty("fx-link", weather.fxLink);
    this.updateProperty("obs-time", weather.now.obsTime);
    this.updateProperty("temp", weather.now.temp);
    this.updateProperty("feels-like", weather.now.feelsLike);
    this.updateProperty("icon", weather.now.icon);
    this.updateProperty("text", weather.now.text);
    this.updateProperty("wind360", weather.now.wind360);
    this.updateProperty("wind-dir", weather.now.windDir);
    this.updateProperty("wind-scale", weather.now.windScale);
    this.updateProperty("wind-speed", weather.now.windSpeed);
    this.updateProperty("humidity", weather.now.humidity);
    this.updateProperty("precip", weather.now.precip);
    this.updateProperty("pressure", weather.now.pressure);
    this.updateProperty("vis", weather.now.vis);
    this.updateProperty("cloud", weather.now.cloud);
    this.updateProperty("dew", weather.now.dew);
    this.emit("changed");
  }

  private _secret() {
    const path = GLib.get_user_data_dir() + "/ags/.secret.json";
    return JSON.parse(Utils.readFile(path) || "{}") as Secret;
  }

  private async _fetchLocation({ key, secret_key }: Secret["tencent_map"]) {
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
      if (json.status == 0) {
        return json.result as Location;
      }
      console.log(`定位api调用失败：${json.message}`);
    } catch (e) {
      console.log(e);
    }
  }
}

class Weather extends Service {
  static {
    Service.register(
      this,
      {},
      {
        now: ["jsobject"],
      },
    );
  }

  now = new RealTimeWeather();

  constructor() {
    super();
    this.now.connect("changed", () => {
      this.notify("now");
      this.emit("changed");
    });
  }

  refresh() {
    this.now.refresh();
  }
}

export const weather = new Weather();
export default weather;
