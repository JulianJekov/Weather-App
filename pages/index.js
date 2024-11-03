import React, { useEffect } from 'react';
import Head from 'next/head';

const Home = () => {
    useEffect(() => {
        const cityInput = document.querySelector('.city-input');
        const searchBtn = document.querySelector('.search-btn');
        const notFoundSection = document.querySelector('.not-found');
        const searchCitySection = document.querySelector('.search-city');
        const weatherInfoSection = document.querySelector('.weather-info');
        const forecastItemsContainer = document.querySelector('.forecast-items-container');

        searchBtn.addEventListener('click', () => {
            if (cityInput.value.trim() !== '') {
                updateWeatherInfo(cityInput.value);
                cityInput.value = '';
                cityInput.blur();
            }
        });

        cityInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && cityInput.value.trim() !== '') {
                updateWeatherInfo(cityInput.value);
                cityInput.value = '';
                cityInput.blur();
            }
        });

        async function getFetchData(endpoint, city) {
            const response = await fetch(`/api/${endpoint}?city=${city}`);
            return response.json();
        }

        async function updateWeatherInfo(city) {
            const weatherData = await getFetchData('weather', city);
            if (weatherData.cod !== 200) {
                showDisplaySection(notFoundSection);
                return;
            }

            const forecastData = await getFetchData('forecast', city);
            displayCurrentWeather(weatherData);
            displayForecast(forecastData);

            showDisplaySection(weatherInfoSection);
        }

        function displayCurrentWeather(weatherData) {
            const {
                name: country,
                main: { temp, humidity },
                weather: [{ id, main }],
                wind: { speed },
            } = weatherData;

            document.querySelector('.country-txt').textContent = country;
            document.querySelector('.temp-txt').textContent = Math.round(temp) + ' °C';
            document.querySelector('.humidity-value-txt').textContent = humidity + ' %';
            document.querySelector('.condition-txt').textContent = main;
            document.querySelector('.wind-value-txt').textContent = speed + ' M/s';
            document.querySelector('.current-date-txt').textContent = getCurrentDate();
            document.querySelector('.weather-summary-img').src = `/assets/weather/${getWeatherIcon(id)}`;
        }

        function displayForecast(forecastData) {
            const timeTaken = '12:00:00';
            const todayDate = new Date().toISOString().split('T')[0];
            forecastItemsContainer.innerHTML = '';

            forecastData.list.forEach(forecastWeather => {
                if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
                    updateForecastItems(forecastWeather);
                }
            });
        }

        function updateForecastItems(weatherData) {
            const {
                dt_txt: date,
                weather: [{ id }],
                main: { temp },
            } = weatherData;

            const dateTaken = new Date(date);
            const dateOption = { day: '2-digit', month: 'short' };
            const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

            const forecastItem = `
                <div class="forecast-item">
                    <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                    <img src="/assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
                    <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
                </div>
            `;
            forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
        }

        function getWeatherIcon(id) {
            if (id <= 232) return 'thunderstorm.svg';
            if (id <= 321) return 'drizzle.svg';
            if (id <= 531) return 'rain.svg';
            if (id <= 622) return 'snow.svg';
            if (id <= 781) return 'atmosphere.svg';
            if (id <= 800) return 'clear.svg';
            return 'clouds.svg';
        }

        function getCurrentDate() {
            const currentDate = new Date();
            const options = {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
            };
            return currentDate.toLocaleDateString('en-GB', options);
        }

        function showDisplaySection(section) {
            [weatherInfoSection, searchCitySection, notFoundSection].forEach(
                (sec) => (sec.style.display = 'none')
            );
            section.style.display = 'flex';
        }
    }, []);

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Weather App</title>
                <link rel="stylesheet" href="/style.css" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
            </Head>
            <main className="main-container">
                <header className="input-container">
                    <input type="text" className="city-input" placeholder="Search City" />
                    <button className="search-btn">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                </header>

                <section className="weather-info" style={{ display: 'none' }}>
                    <div className="location-date-container">
                        <div className="location">
                            <span className="material-symbols-outlined">location_on</span>
                            <h4 className="country-txt">Shumen</h4>
                        </div>
                        <h4 className="current-date-txt regular-txt">Sun, 03 Nov</h4>
                    </div>
                    <div className="weather-summary-container">
                        <img src="/assets/weather/clouds.svg" alt="" className="weather-summary-img" />
                        <div className="weather-summary-info">
                            <h1 className="temp-txt">11 °C</h1>
                            <h3 className="condition-txt regular-txt">Clouds</h3>
                        </div>
                    </div>

                    <div className="weather-conditions-container">
                        <div className="condition-item">
                            <span className="material-symbols-outlined">water_drop</span>
                            <div className="condtition-info">
                                <h5 className="regular-txt">Humidity</h5>
                                <h5 className="humidity-value-txt">55 %</h5>
                            </div>
                        </div>

                        <div className="condition-item">
                            <span className="material-symbols-outlined">air</span>
                            <div className="condtition-info">
                                <h5 className="regular-txt">Wind Speed</h5>
                                <h5 className="wind-value-txt">5 M/s</h5>
                            </div>
                        </div>
                    </div>

                    <div className="forecast-items-container"></div>
                </section>

                <section className="search-city section-message">
                    <img src="/assets/message/search-city.png" alt="Search City" />
                    <div>
                        <h1>Search City</h1>
                        <h4 className="regular-txt">Find out the weather conditions of the city</h4>
                    </div>
                </section>

                <section className="not-found section-message" style={{ display: 'none' }}>
                    <img src="/assets/message/not-found.png" alt="Not Found" />
                    <div>
                        <h1>Search City</h1>
                        <h4 className="regular-txt">Find out the weather conditions of the city</h4>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;