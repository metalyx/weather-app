import './styles/reset.scss';
import './styles/global.scss';
import './index.scss';
import weatherContainerBCImage from'./assets/weather-bg.jpg';

const weatherContainer = document.getElementsByClassName('weather-container')[0];

if (weatherContainer) {
    weatherContainer.style.backgroundImage = `url(${weatherContainerBCImage})`;
}
