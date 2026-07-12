/* ==========================================
   LIBRO INTERACTIVO
   Feliz Cumplea�os Sharik ??
========================================== */
const pageNumber = document.getElementById("pageNumber");
const progressBar = document.getElementById("progressBar");
const intro = document.getElementById("intro");
const startButton = document.getElementById("startButton");
const bookArea = document.getElementById("bookArea");
const pages = Array.from(document.querySelectorAll(".page"));
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const book = document.getElementById("book");
const shadow = document.getElementById("bookShadow");
const bookCover = document.getElementById("bookCover");
const finalScreen = document.getElementById("finalScreen");
const restartBookButton = document.getElementById("restartBook");
const particles = document.getElementById("particles");
const letter = document.getElementById("letter");
const photos = Array.from(document.querySelectorAll(".photo"));
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

let currentPage = 0;
let isPlaying = false;
let typewriterTimeout = null;
let audioContext = null;
let audioGain = null;
let activeOscillators = [];

const typewriterText = `Querida Sharik...

Hoy es un d�a muy especial.

Quer�a regalarte algo diferente.

Algo que permaneciera contigo y que cada p�gina te recordara lo incre�ble que eres.

Espero que este peque�o libro consiga sacarte una sonrisa.

??`;

const noteFrequencies = {
    G4: 392.00,
    A4: 440.00,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    F5: 698.46,
    G5: 783.99
};

const birthdayMelody = [
    ["G4", 0.35], ["G4", 0.35], ["A4", 0.7], ["G4", 0.7], ["C5", 0.7], ["B4", 1.0],
    ["G4", 0.35], ["G4", 0.35], ["A4", 0.7], ["G4", 0.7], ["D5", 0.7], ["C5", 1.0],
    ["G4", 0.35], ["G4", 0.35], ["G5", 0.7], ["E5", 0.7], ["C5", 0.7], ["B4", 0.7], ["A4", 1.0],
    ["F5", 0.35], ["F5", 0.35], ["E5", 0.7], ["C5", 0.7], ["D5", 0.7], ["C5", 1.0]
];

function init() {
    showPage(0);
    createParticles();

    if (music) {
        music.volume = 0.15;
        music.pause();
    }
    if (musicBtn) {
        musicBtn.textContent = "▶️";
    }
}

function showPage(index) {
    const safeIndex = Math.max(0, Math.min(index, pages.length - 1));
    currentPage = safeIndex;

    pages.forEach((page, pageIndex) => {
        page.classList.remove("active", "turned");
        if (pageIndex < safeIndex) {
            page.classList.add("turned");
        }
    });

    pages[safeIndex].classList.add("active");
    updateButtons();

    if (safeIndex === 3) {
        showGallery();
    }

    if (safeIndex === pages.length - 1) {
        typeWriter();
        showFinalScreen();
    } else {
        hideFinalScreen();
    }
}

function updateButtons() {
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === pages.length - 1;
    pageNumber.textContent = `P�gina ${currentPage + 1} / ${pages.length}`;

    const percent = pages.length > 1 ? (currentPage / (pages.length - 1)) * 100 : 0;
    progressBar.style.width = `${percent}%`;
}

function playFlip() {
    book.animate([
        { transform: "scale(1)" },
        { transform: "scale(1.01)" },
        { transform: "scale(1)" }
    ], { duration: 300 });
}

function createAudioContext() {
    if (audioContext) return;
    const AudioAPI = window.AudioContext || window.webkitAudioContext;
    if (!AudioAPI) return;

    audioContext = new AudioAPI();
    audioGain = audioContext.createGain();
    audioGain.gain.value = 0.08;
    audioGain.connect(audioContext.destination);
}

function stopGeneratedMusic() {
    activeOscillators.forEach((osc) => {
        try {
            osc.stop();
        } catch (error) {
            // ignore if already stopped
        }
    });
    activeOscillators = [];
}

function playGeneratedMusic() {
    createAudioContext();
    if (!audioContext) return;

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    stopGeneratedMusic();
    let startTime = audioContext.currentTime + 0.1;
    let elapsed = 0;

    birthdayMelody.forEach(([note, duration]) => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = "triangle";
        oscillator.frequency.value = noteFrequencies[note] || 440;
        oscillator.connect(audioGain);

        oscillator.start(startTime + elapsed);
        oscillator.stop(startTime + elapsed + duration);
        activeOscillators.push(oscillator);

        elapsed += duration;
    });
}

function stopAudioElement() {
    if (music && !music.paused) {
        music.pause();
        music.currentTime = 0;
    }
}

function isAudioFilePlayable() {
    return music && music.src && music.readyState >= 2 && !Number.isNaN(music.duration) && music.duration > 0;
}

function useGeneratedMusic() {
    stopAudioElement();
    playGeneratedMusic();
}

function toggleMusic(forcePlay = null) {
    const shouldPlay = forcePlay === null ? !isPlaying : forcePlay;

    if (shouldPlay) {
        if (isAudioFilePlayable()) {
            music.play().catch(() => {
                useGeneratedMusic();
            });
        } else {
            useGeneratedMusic();
        }
        musicBtn.textContent = "⏸️";
        isPlaying = true;
    } else {
        stopAudioElement();
        stopGeneratedMusic();
        musicBtn.textContent = "▶️";
        isPlaying = false;
    }
}

function typeWriter() {
    if (!letter) return;

    letter.innerHTML = "";
    let index = 0;
    clearTimeout(typewriterTimeout);

    function write() {
        if (index < typewriterText.length) {
            letter.innerHTML += typewriterText.charAt(index);
            index += 1;
            typewriterTimeout = setTimeout(write, 35);
        }
    }

    write();
}

function showGallery() {
    photos.forEach((photo, index) => {
        photo.style.opacity = "0";
        photo.style.transform = "translateY(80px)";
        setTimeout(() => {
            photo.style.transition = ".8s";
            photo.style.opacity = "1";
            photo.style.transform = "translateY(0)";
        }, index * 200);
    });
}

function showFinalScreen() {
    finalScreen.classList.add("show");
}

function hideFinalScreen() {
    finalScreen.classList.remove("show");
}

startButton.addEventListener("click", () => {
    intro.classList.add("hide");
    setTimeout(() => {
        bookArea.classList.add("show");
        toggleMusic(true);
        setTimeout(() => {
            if (bookCover) {
                bookCover.classList.add("open");
            }
        }, 800);
    }, 700);
});

if (musicBtn) {
    musicBtn.addEventListener("click", () => {
        toggleMusic();
    });
}

nextButton.addEventListener("click", () => {
    if (currentPage < pages.length - 1) {
        playFlip();
        showPage(currentPage + 1);
    }
});

prevButton.addEventListener("click", () => {
    if (currentPage > 0) {
        playFlip();
        showPage(currentPage - 1);
    }
});

restartBookButton.addEventListener("click", () => {
    hideFinalScreen();
    if (bookCover) {
        bookCover.classList.remove("open");
    }
    setTimeout(() => {
        showPage(0);
        if (bookCover) {
            bookCover.classList.add("open");
        }
    }, 200);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && currentPage < pages.length - 1) {
        playFlip();
        showPage(currentPage + 1);
    }
    if (event.key === "ArrowLeft" && currentPage > 0) {
        playFlip();
        showPage(currentPage - 1);
    }
});

document.addEventListener("mousemove", (event) => {
    if (!bookArea.classList.contains("show")) return;
    const x = (window.innerWidth / 2 - event.clientX) / 35;
    const y = (window.innerHeight / 2 - event.clientY) / 35;
    book.style.transform = `rotateY(${x}deg) rotateX(${-y}deg) translateZ(10px)`;
    if (shadow) shadow.style.transform = `translate(${x / 2}px, ${-y / 2}px)`;
});

if (book) {
    book.addEventListener("mouseenter", () => {
        book.animate([
            { transform: "scale(1)" },
            { transform: "scale(1.03)" }
        ], { duration: 300, fill: "forwards" });
    });
    book.addEventListener("mouseleave", () => {
        book.animate([
            { transform: "scale(1.03)" },
            { transform: "scale(1)" }
        ], { duration: 300, fill: "forwards" });
    });
}

Array.from(document.querySelectorAll("button")).forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
        btn.style.transform = "scale(1.08)";
    });
    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "scale(1)";
    });
});

function createParticles() {
    if (!particles) return;
    const icons = ["??", "??", "??", "??", "??", "??", "?"];
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.textContent = icons[i % icons.length];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.fontSize = `${16 + Math.random() * 18}px`;
        particle.style.animationDuration = `${6 + Math.random() * 5}s`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particles.appendChild(particle);
    }
}

if (music) {
    music.addEventListener("error", () => {
        if (isPlaying) {
            useGeneratedMusic();
        }
    });
}

const cover = document.querySelector(".cover");
if (cover) {
    cover.addEventListener("dblclick", () => {
        alert("?? Feliz Cumplea�os Sharik ??");
    });
}

init();
console.log("Libro iniciado correctamente ??");
