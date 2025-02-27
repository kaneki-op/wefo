import "./modules/dom.js";
import { fetchWeather } from "./modules/weather.js";
import "./modules/audio.js";
import "./modules/search.js";

// Attach event listener to search button
document.querySelector(".search-box button").addEventListener("click", () => {
    fetchWeather(document.getElementById("search-btn").value);
});

// Trigger search when pressing "Enter"
document.getElementById("search-btn").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        fetchWeather(event.target.value);
    }
});

console.log("hlo")