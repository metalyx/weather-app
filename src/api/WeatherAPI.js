class WeatherAPI {
    #BASE_URL = ({ cityName, units }) =>
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${process.env.WEATHER_API_KEY}&units=${units}`;

    #results = {};

    async get(cityName, units = 'imperial') {
        if (!cityName) {
            throw new Error(
                'Unexpected cityName was provided in get method of WeatherAPI class'
            );
        }

        console.log(this.#results, cityName);

        if (!this.#results[cityName]) {
            this.#results[cityName] = await this.#sendAPIRequest(
                cityName,
                units
            );
        }

        return this.#results[cityName];
    }

    async #sendAPIRequest(cityName, units) {
        try {
            const response = await fetch(
                this.#BASE_URL({
                    cityName,
                    units,
                })
            ).then((res) => res.json());
            const jsonData = await response;
            return jsonData;
        } catch (e) {
            console.error(e);
        }
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new WeatherAPI();
        }
        return this.instance;
    }
}

const weatherAPIInstance = WeatherAPI.getInstance();

export default weatherAPIInstance;
