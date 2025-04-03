import "./modules/dom.js";
import { fetchWeatherByCoords } from "./modules/weather.js"; 
import "./modules/audio.js";
import "./modules/search.js";

document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.warn("Location access denied. Using manual search.");
            }
        );
    } else {
        console.warn("Geolocation is not supported by this browser.");
    }
});

// script.js
if (window.matchMedia("(max-width: 768px)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".forecast-card").forEach(card => observer.observe(card));
  }