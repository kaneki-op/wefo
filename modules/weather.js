import { container, weatherBox, weatherDetails, error404, loadingText } from "./dom.js";

const APIKey = "e58b94c4d9196f57fb7b743de5e682a8";

export function fetchWeather(city) {
    if (city === "") return;

    // Show loading animation
    loadingText.style.display = "block";
    weatherBox.style.display = "none";
    weatherDetails.style.display = "none";
    error404.style.display = "none";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            loadingText.style.display = "none"; // Hide loading

            if (json.cod === "404") {
                container.classList.add("expanded");
                error404.style.display = "block";
                return;
            }

            container.classList.add("expanded");
            weatherBox.classList.add("active");
            weatherDetails.classList.add("active");
            error404.style.display = "none";

            // Update UI with weather data
            document.querySelector(".weather-box img").src = getWeatherIcon(json.weather[0].main);
            document.querySelector(".weather-box .temperature").innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            document.querySelector(".weather-box .description").innerHTML = json.weather[0].description;
            document.querySelector(".weather-details .humidity span").innerHTML = `${json.main.humidity}%`;
            document.querySelector(".weather-details .wind span").innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = "block";
            weatherDetails.style.display = "flex";
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
