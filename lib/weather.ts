import GObject, { register, property, GLib } from "astal/gobject";
import { exec, execAsync, readFile } from "astal";

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
interface Now {
  code: string;
  updateTime: string;
  fxLink: string;
  now: {
    location: Location;
    fxLink: string;
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

@register({ GTypeName: "Weather" })
export default class Weather extends GObject.Object {
  static instance: Weather;
  static get_default() {
    if (!this.instance) this.instance = new Weather();

    return this.instance;
  }

  #now: Now["now"] = {
    location: { ip: "", location: { lat: 0, lng: 0 } },
    fxLink: "",
    obsTime: "",
    temp: "",
    feelsLike: "",
    icon: "",
    text: "",
    wind360: "",
    windDir: "",
    windScale: "",
    windSpeed: "",
    humidity: "",
    precip: "",
    pressure: "",
    vis: "",
  };

  @property(Object)
  get now() {
    return this.#now;
  }

  constructor() {
    super();
    this.refresh(3);
    setInterval(() => this.refresh(3), 10 * 60 * 1000);
  }

  async refresh(retry: number) {
    try {
      this.#now = (await this.#fetchNow()).now;
      this.notify("now");
    } catch (e) {
      if (retry > 0) {
        console.warn(`Retrying weather refresh... attempts left: ${retry}`);
        await this.refresh(retry - 1);
      } else {
        console.error("All retries failed:", e);
      }
    }
  }

  async #fetchNow() {
    const { weather_key, tencent_map } = this.#secret();
    const location = await this.#fetchLocation(tencent_map);
    const { lat, lng } = location.location;
    const url = `https://devapi.qweather.com/v7/weather/now?key=${weather_key}&location=${lng},${lat}`;
    const res = (await this.#fetch(url)) as Now;
    res.now.fxLink = res.fxLink;
    res.now.location = location;
    return res;
  }

  #secret() {
    const path = GLib.get_user_data_dir() + "/ags/.secret.json";
    return JSON.parse(readFile(path) || "{}") as Secret;
  }

  async #fetchLocation({ key, secret_key }: Secret["tencent_map"]) {
    const url = "https://apis.map.qq.com";
    const api = `/ws/location/v1/ip?key=${key}`;
    const sig = exec([
      "bash",
      "-c",
      `echo -n "${api}${secret_key}" | md5sum | awk '{print $1}'`,
    ]);
    const res = await this.#fetch(`${url}${api}&sig=${sig}`);
    return res.result as Location;
  }

  async #fetch(url: string) {
    const res = await execAsync(`curl --compressed ${url}`);
    return JSON.parse(res);
  }
}
