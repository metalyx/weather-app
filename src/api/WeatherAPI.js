class WeatherAPI {
    #BASE_URL = ({ cityName, units }) =>
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${process.env.WEATHER_API_KEY}&units=${units}`;

    #BASE_URL_LAT_LON = ({ lat, lon }, units = 'imperial') =>
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=${units}`;

    #results = {};

    async get(cityName, units = 'imperial') {
        if (!cityName) {
            throw new Error(
                'Unexpected cityName was provided in get method of WeatherAPI class'
            );
        }

        const currentTime = new Date();

        // We haven't yet fetched this city or it's been more than 5 minutes since last api call
        if (
            !this.#results[cityName] ||
            currentTime - this.#results[cityName]?.lastCallTime > 300000
        ) {
            this.#results[cityName] = await this.#sendAPIRequest(
                cityName,
                units
            );
        }

        return this.#results[cityName];
    }

    async getByCords({ lat, lon }, units) {
        if (!lat || !lon) {
            throw new Error(
                'Unexpected lat or lon was provided in getByCords method of WeatherAPI class'
            );
        }

        const currentTime = new Date();

        const sub = lat - lon;

        if (
            !this.#results[sub] ||
            currentTime - this.#results[sub]?.lastCallTime > 300000
        ) {
            this.#results[sub] = await this.#sendAPIRequestByLatLon(
                { lat, lon },
                units
            );
        }

        return this.#results[sub];
    }

    async #sendAPIRequest(cityName, units) {
        try {
            const response = await fetch(
                this.#BASE_URL({
                    cityName,
                    units,
                })
            ).then((res) => res.json());

            if (response.cod == '404') {
                return {
                    error: 'No such city was found',
                    code: 404,
                };
            } else if (response.cod >= 500 && response.cod <= 599) {
                return {
                    error: 'Server error',
                    code: response.cod,
                };
            }

            const jsonData = await response;

            const resultData = {
                ...jsonData,
                lastCallTime: new Date(),
            };

            return resultData;
        } catch (e) {
            return {
                error: 'Internet connection issues...',
                code: null,
            };
        }
    }

    async #sendAPIRequestByLatLon({ lat, lon }, units) {
        try {
            const response = await fetch(
                this.#BASE_URL_LAT_LON({ lat, lon }, units)
            ).then((res) => res.json());

            if (response.cod == '404') {
                return {
                    error: 'No such city was found',
                    code: 404,
                };
            } else if (response.cod >= 500 && response.cod <= 599) {
                return {
                    error: 'Server error',
                    code: response.cod,
                };
            }

            const jsonData = await response;

            const resultData = {
                ...jsonData,
                lastCallTime: new Date(),
            };

            return resultData;
        } catch (e) {
            return {
                error: 'Internet connection issues...',
                code: null,
            };
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
