import './styles/reset.scss';
import './styles/global.scss';
import './index.scss';
import weatherContainerBCImage from './assets/weather-bg.jpg';
import weatherAPI from './api/WeatherAPI';

const unknown = 'unknown';
const cityNameRegExp = /^[a-z- ]+$/i;
const defaultCity = 'Seattle';

setBGForWeatherContainer();

const cityInput = document.getElementById('input-city');

const temperatureSpan = document.getElementById('temperature');
const conditionsSpan = document.getElementById('conditions');
const tempMinSpan = document.getElementById('tempMin');
const tempMaxSpan = document.getElementById('tempMax');
const citySpan = document.getElementById('city');
const countrySpan = document.getElementById('country');

const dayOfWeekSpan = document.getElementById('dayOfWeek');
const monthSpan = document.getElementById('month');
const daySpan = document.getElementById('day');
const yearSpan = document.getElementById('year');

const dateInfo = document.getElementById('date-info');

const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', () => handleCityInputSubmit());

function setBGForWeatherContainer() {
    const weatherContainer =
        document.getElementsByClassName('weather-container')[0];

    if (weatherContainer) {
        weatherContainer.style.backgroundImage = `url(${weatherContainerBCImage})`;
    }
}

handleCityInputSubmit(true);

async function handleCityInputSubmit(skipValidation = false) {
    if (!cityInput) {
        throw new Error("Cannot find 'input-city' element on the page...");
    }

    if (skipValidation === false) {
        if (!checkCityInputLengthIsValid(cityInput)) {
            return;
        }
    }

    const weatherInfo = await weatherAPI.get(cityInput.value || defaultCity);

    const weatherData = {
        temp: weatherInfo?.main?.temp,
        weather: weatherInfo?.weather[0]?.main,
        tempMin: weatherInfo?.main?.temp_min,
        tempMax: weatherInfo?.main?.temp_max,
        cityName: weatherInfo?.name,
        country: weatherInfo?.sys?.country,
        date: convertDate(weatherInfo?.dt, weatherInfo?.timezone),
    };

    renderNewWeatherData(weatherData);
}

function renderNewWeatherData(newData) {
    let { temp, weather, tempMin, tempMax, cityName, country, date } = newData;

    temp = temp ?? unknown;
    weather = weather ?? unknown;
    tempMin = tempMin ?? unknown;
    tempMax = tempMax ?? unknown;
    cityName = cityName ?? unknown;
    country = country ?? unknown;

    if (temperatureSpan) {
        temperatureSpan.innerHTML = '';
        temperatureSpan.innerText = temp;
    } else {
        showConsoleError('Temperature span');
    }

    if (conditionsSpan) {
        conditionsSpan.innerHTML = '';
        conditionsSpan.innerText = weather;
    } else {
        showConsoleError('Weather span');
    }

    if (tempMinSpan) {
        tempMinSpan.innerHTML = '';
        tempMinSpan.innerText = tempMin;
    } else {
        showConsoleError('Temperature minimum span');
    }

    if (tempMaxSpan) {
        tempMaxSpan.innerHTML = '';
        tempMaxSpan.innerText = tempMax;
    } else {
        showConsoleError('Temperature maximum span');
    }

    if (citySpan) {
        citySpan.innerHTML = '';
        citySpan.innerText = cityName;
    } else {
        showConsoleError('City span');
    }

    if (countrySpan) {
        countrySpan.innerHTML = '';
        countrySpan.innerText = country;
    } else {
        showConsoleError('Country span');
    }

    if (dateInfo) {
        dateInfo.innerHTML = '';
        dateInfo.innerText = date;
    }
}

function checkCityInputLengthIsValid(cityInput) {
    if (!cityNameRegExp.test(cityInput.value)) {
        cityInput.classList.add('danger');
        return false;
    } else {
        cityInput.classList.remove('danger');
        return true;
    }
}

function showConsoleError(elementName) {
    console.error(`${elementName} was not found in the DOM...`);
}

function convertDate(unixTimeStamp, timeZone = 0) {
    let date = unixTimeStamp + timeZone;
    date = new Date(date * 1000).toUTCString();
    return date.slice(0, date.length - 13);
}
