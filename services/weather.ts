import { location, secret } from "variables";

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
    secret.connect("changed", () => this.sync());
    location.connect("changed", () => this.sync());
    setInterval(() => this.sync(), 10 * 60 * 1000);
  }

  sync() {
    const { weather_key } = secret.value;
    const { lat, lng } = location.value.location;
    if (!weather_key || !lat || !lng) {
      return;
    }
    const url = `https://devapi.qweather.com/v7/weather/now?key=${weather_key}&location=${lng},${lat}`;
    Utils.fetch(url)
      .then((res) => res.json())
      .then((res) => res as Weather)
      .then((res) => {
        this.updateProperty("fx_link", res.fxLink);
        this.updateProperty("now", res.now);
        this.emit("changed");
      })
      .catch((error) => console.log(error));
  }
}

export const weather = new WeatherService();
export default weather;
