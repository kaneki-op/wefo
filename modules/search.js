import { searchInput } from "./dom.js";
import { fetchWeather } from "./weather.js";

const APIKey = "e58b94c4d9196f57fb7b743de5e682a8";
const searchResults = document.createElement("ul");
searchResults.classList.add("autocomplete-results");
document.querySelector(".search-box").appendChild(searchResults);

// Fetch city suggestions
function getCitySuggestions(query) {
    if (query.length < 2) {
        searchResults.innerHTML = "";
        searchResults.style.display = "none";
        return;
    }

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${APIKey}`)
        .then(response => response.json())
        .then(data => {
            searchResults.innerHTML = "";
            if (data.length === 0) {
                searchResults.style.display = "none";
                return;
            }

            data.forEach(city => {
                const listItem = document.createElement("li");
                listItem.textContent = `${city.name}, ${city.country}`;
                listItem.addEventListener("click", () => {
                    searchInput.value = city.name;
                    searchResults.innerHTML = "";
                    searchResults.style.display = "none";
                    fetchWeather(city.name);
                });
                searchResults.appendChild(listItem);
            });

            searchResults.style.display = "block";
        })
        .catch(() => searchResults.style.display = "none");

    
}

// Show dropdown when typing
searchInput.addEventListener("input", () => getCitySuggestions(searchInput.value));

// Hide dropdown when clicking outside
document.addEventListener("click", (event) => {
    if (!document.querySelector(".search-box").contains(event.target)) {
        searchResults.style.display = "none";
    }
});
