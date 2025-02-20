const headerText = document.querySelector('.header h1');
const shakeSound = document.getElementById('shakeSound');
const APIKey = "e58b94c4d9196f57fb7b743de5e682a8";

headerText.addEventListener('mouseenter', () => {
    shakeSound.currentTime = 0; // Reset audio to start
    shakeSound.play();
});

headerText.addEventListener('mouseleave', () => {
    shakeSound.pause(); // Pause the audio
    shakeSound.currentTime = 0; // Reset audio to start position
});


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

const searchBox = document.querySelector('.search-box');
const searchResults = document.createElement('ul');
searchResults.classList.add('autocomplete-results');
searchBox.appendChild(searchResults); // Ensure it's inside search-box but positioned correctly

// Initially hide dropdown
searchResults.style.display = "none";

// Fetch city suggestions
function getCitySuggestions(query) {
    if (query.length < 2) {
        searchResults.innerHTML = "";
        searchResults.style.display = "none"; // Hide dropdown if no input
        return;
    }

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${APIKey}`)
        .then(response => response.json())
        .then(data => {
            searchResults.innerHTML = ""; // Clear previous results

            if (data.length === 0) {
                searchResults.style.display = "none"; // Hide dropdown if no results
                return;
            }

            // Show suggestions
            data.forEach(city => {
                const listItem = document.createElement("li");
                listItem.textContent = `${city.name}, ${city.country}`;
                listItem.addEventListener("click", () => {
                    searchInput.value = city.name;
                    searchResults.innerHTML = ""; // Clear dropdown
                    searchResults.style.display = "none"; // Hide dropdown
                    fetchWeather(city.name);
                });
                searchResults.appendChild(listItem);
            });

            searchResults.style.display = "block"; // Show dropdown when results exist
        })
        .catch(error => {
            console.error("Error fetching city suggestions:", error);
            searchResults.style.display = "none"; // Hide dropdown on error
        });
}

// Show dropdown when typing
searchInput.addEventListener("input", () => {
    getCitySuggestions(searchInput.value);
});

// Hide dropdown when clicking outside
document.addEventListener("click", (event) => {
    if (!searchBox.contains(event.target)) {
        searchResults.style.display = "none";
    }
});
