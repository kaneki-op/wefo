import { container, weatherBox, weatherDetails, error404, loadingText, searchInput } from "./dom.js";

const APIKey = "e58b94c4d9196f57fb7b743de5e682a8";

export function fetchWeather(city) {
    if (!city) return;
    fetchWeatherData(`q=${city}`, city);
    fetchFiveDayForecast(city);
}

export function fetchWeatherByCoords(lat, lon) {
    fetchWeatherData(`lat=${lat}&lon=${lon}`, null);
}

function fetchWeatherData(query, cityName) {
    loadingText.style.display = "block";
    weatherBox.style.display = "none";
    weatherDetails.style.display = "none";
    error404.style.display = "none";

    fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${APIKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(json => {
            loadingText.style.display = "none";

            if (json.cod === "404") {
                error404.style.display = "block";
                return;
            }

            container.classList.add("expanded");
            weatherBox.classList.add("active");
            weatherDetails.classList.add("active");
            error404.style.display = "none";

            // Update city name if fetched by coordinates
            if (!cityName && json.name) {
                searchInput.value = json.name;
            }

            document.querySelector(".weather-box img").src = getWeatherIcon(json.weather[0].main);
            document.querySelector(".weather-box .temperature").innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            document.querySelector(".weather-box .description").innerHTML = json.weather[0].description;
            document.querySelector(".weather-details .humidity span").innerHTML = `${json.main.humidity}%`;
            document.querySelector(".weather-details .wind span").innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = "block";
            weatherDetails.style.display = "flex";
        })
        .catch(error => {
            container.classList.remove("expanded"); // Add this
            container.style.height = "55px"; // Force reset height
            loadingText.style.display = "none";
            error404.style.display = "block";
            console.error("Failed to fetch weather data:", error);
        });
}

function getWeatherIcon(weather) {
    const icons = {
        "Clear": "images/clearsky.png",
        "Rain": "images/rainy.png",
        "Snow": "images/snow.png",
        "Clouds": "images/clouds.png",
        "Mist": "images/mist.png",
        "Haze": "images/mist.png"
    };
    return icons[weather] || "images/smoke.png";
}

export function fetchFiveDayForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.querySelector(".forecast-container");
            forecastContainer.innerHTML = ""; // Clear previous data

            const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")); // Get mid-day data for 5 days

            dailyData.forEach(day => {
                const forecastCard = document.createElement("div");
                forecastCard.classList.add("forecast-card");

                forecastCard.innerHTML = `
                    <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
                    <img src="${getWeatherIcon(day.weather[0].main)}" alt="Weather icon">
                    <p>${parseInt(day.main.temp)}°C</p>
                    <p>${day.weather[0].description}</p>
                    <p>Humidity: ${day.main.humidity}%</p>
                    <p>Wind: ${parseInt(day.wind.speed)}Km/h</p>
                `;

                forecastContainer.appendChild(forecastCard);
            });
        })
        .catch(error => console.error("Failed to fetch forecast:", error));
}

