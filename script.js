document.addEventListener("DOMContentLoaded", () => {
    const headerText = document.querySelector(".header h1");
    const shakeSound = document.getElementById("shakeSound");
    const searchBox = document.getElementById("search-btn");
    const weatherImage = document.querySelector(".weather img");
    const temperature = document.querySelector(".temperature");
    const description = document.querySelector(".description");
    const humidity = document.querySelector(".info-humidity span");
    const wind = document.querySelector(".info-wind span");

    // Play sound on hover
    headerText.addEventListener("mouseenter", () => {
        shakeSound.currentTime = 0; // Reset sound to start
        shakeSound.play();
    });

    headerText.addEventListener("mouseleave", () => {
        shakeSound.pause();
        shakeSound.currentTime = 0;
    });

    // Weather API Key (Use your own key if needed)
    const API_KEY = "e58b94c4d9196f57fb7b743de5e682a8";

    // Function to get weather data
    function getWeather(lat, lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    temperature.innerHTML = `${Math.round(data.main.temp)} <span>°C</span>`;
                    description.textContent = data.weather[0].description;
                    humidity.textContent = `${data.main.humidity}%`;
                    wind.textContent = `${data.wind.speed} Km/h`;
                    weatherImage.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                } else {
                    console.error("Error fetching weather data:", data.message);
                }
            })
            .catch(error => console.error("Error fetching weather data:", error));
    }

    // Function to get user's location
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    getWeather(lat, lon);
                },
                error => {
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    // Call function on page load
    getUserLocation();
});
