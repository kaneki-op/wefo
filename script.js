const container = document.querySelector('.container');
const searchInput = document.getElementById('search-btn');
const searchButton = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const loadingText = document.querySelector('.loading');

function fetchWeather(city) {
    const APIKey = "e58b94c4d9196f57fb7b743de5e682a8";

    if (city === '') return;

    // Show loading
    loadingText.style.display = "block";
    weatherBox.style.display = "none";
    weatherDetails.style.display = "none";
    error404.style.display = "none";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            loadingText.style.display = "none"; // Hide loading

            if (json.cod == '404') {
                container.classList.add("expanded"); // Expand for error message
                error404.style.display = "block";
                weatherBox.style.display = "none";
                weatherDetails.style.display = "none";
                return;
            }

            // Expand container smoothly
            container.classList.add("expanded");
            weatherBox.classList.add('active');
            weatherDetails.classList.add('active');
            error404.style.display = "none";

            // Weather Data
            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            // Match local images to weather
            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clearsky.png';
                    break;
                case 'Rain':
                    image.src = 'images/rainy.png';
                    break;
                case 'Snow':
                    image.src = 'images/snow.png';
                    break;
                case 'Clouds':
                    image.src = 'images/clouds.png';
                    break;
                case 'Mist':
                case 'Haze':
                    image.src = 'images/mist.png';
                    break;
                default:
                    image.src = 'images/smoke.png';
            }

            // Set weather details
            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = "block";
            weatherDetails.style.display = "flex";
        });
}

// Trigger search when clicking the button
searchButton.addEventListener('click', () => {
    fetchWeather(searchInput.value);
});

// Trigger search when pressing "Enter"
searchInput.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        fetchWeather(searchInput.value);
    }
});
