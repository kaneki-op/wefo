document.addEventListener("DOMContentLoaded", () => {
    const headerText = document.querySelector(".header h1");
    const shakeSound = document.getElementById("shakeSound");

    headerText.addEventListener("mouseenter", () => {
        shakeSound.currentTime = 0; // Reset sound to start
        shakeSound.play();
    });

    headerText.addEventListener("mouseleave", () => {
        shakeSound.pause(); // Stop the sound when hover is removed
        shakeSound.currentTime = 0; // Reset sound to start next time
    });
});
