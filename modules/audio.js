const headerText = document.querySelector(".header h1");
const shakeSound = document.getElementById("shakeSound");

headerText.addEventListener("mouseenter", () => {
    shakeSound.currentTime = 0;
    shakeSound.play();
});

headerText.addEventListener("mouseleave", () => {
    shakeSound.pause();
    shakeSound.currentTime = 0;
});

