// songs
const songs = ['assets/music.mp3', 'assets/music1.mp3', 'assets/music2.mp3']; // Add your song files here
let currentSongIndex = 0; // Index of the current song

function playNextSong() {
    // Audio playback disabled
}

function userHasClicked() {
    document.getElementById("flexboxcontainer").style.display = "none";
    document.getElementById("flexboxcontainer").style.width = 0;
    document.getElementById("flexboxcontainer").style.height = 0;

    const hiddenContainer = document.getElementById("hiddencontainer");

    hiddenContainer.style.display = "flex";

    playNextSong(); // Start autoplay when click

    setTimeout(() => {
        hiddenContainer.style.opacity = 1;
    }, 50);
}

function updateFlicker() {
    const flickerTexts = document.querySelectorAll('.flickertext');
    flickerTexts.forEach(element => {
        if (element.textContent.trim() === 'kpvi') {
            element.style.opacity = 1;
            element.style.textShadow = '0 0 8px rgba(255,255,255,0.7), 0 0 16px rgba(255,255,255,0.4)';
        } else {
            element.style.opacity = 1;
            element.style.textShadow = 'none';
        }
    });
}

let lastFlicker = 0;
function flickerLoop(ts) {
    if (!lastFlicker || ts - lastFlicker >= 1000/120) {
        updateFlicker();
        lastFlicker = ts;
    }
    requestAnimationFrame(flickerLoop);
}
requestAnimationFrame(flickerLoop);
