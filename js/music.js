/* =========================================
   BIRTHDAY MUSIC
========================================= */

/* =========================================
   MUSIC PATH
========================================= */

const MUSIC_SRC = window.location.pathname.includes("/pages/")
  ? "../assets/music/birthday.mp3"
  : "assets/music/birthday.mp3";

/* =========================================
   AUDIO
========================================= */

const audio = document.createElement("audio");

audio.src = MUSIC_SRC;
audio.loop = true;
audio.preload = "auto";

audio.volume = Number(localStorage.getItem("birthday-volume") || 0.35);

document.body.appendChild(audio);

/* =========================================
   MUSIC STATE
========================================= */

const savedMusicState = localStorage.getItem("birthday-music");

let musicEnabled = savedMusicState !== "off";

/* =========================================
   SAVED TIME
========================================= */

const savedTime = Number(localStorage.getItem("birthday-music-time")) || 0;

/* =========================================
   RESTORE MUSIC POSITION
========================================= */

audio.addEventListener("loadedmetadata", () => {
  if (savedTime > 0 && savedTime < audio.duration) {
    audio.currentTime = savedTime;
  }
});

/* =========================================
   SAVE MUSIC POSITION
========================================= */

function saveMusicPosition() {
  if (!audio.paused) {
    localStorage.setItem("birthday-music-time", audio.currentTime);
  }
}

/*
 * Save regularly while music is playing.
 */

setInterval(saveMusicPosition, 1000);

/*
 * Save immediately before leaving
 * the current page.
 */

window.addEventListener("pagehide", saveMusicPosition);

window.addEventListener("beforeunload", saveMusicPosition);

/* =========================================
   MUSIC BUTTON
========================================= */

const musicButton = document.createElement("button");

musicButton.type = "button";

musicButton.className = "birthday-music-button";

musicButton.setAttribute(
  "aria-label",
  musicEnabled ? "Mute music" : "Play music",
);

musicButton.innerHTML = musicEnabled ? "🔊" : "🔇";

document.body.appendChild(musicButton);

/* =========================================
   MUSIC BUTTON STYLE
========================================= */

const musicStyle = document.createElement("style");

musicStyle.textContent = `
    .birthday-music-button {
        position: fixed;
        right: 24px;
        bottom: 24px;

        width: 48px;
        height: 48px;

        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 50%;

        background: rgba(15, 15, 30, 0.75);

        color: #ffffff;

        font-size: 20px;

        display: flex;
        align-items: center;
        justify-content: center;

        cursor: pointer;

        backdrop-filter: blur(12px);

        box-shadow:
            0 8px 30px rgba(0,0,0,0.35),
            0 0 20px rgba(139,92,246,0.15);

        z-index: 10000;

        transition:
            transform 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease;
    }

    .birthday-music-button:hover {
        transform: translateY(-3px) scale(1.05);

        background: rgba(30, 20, 50, 0.9);

        box-shadow:
            0 12px 35px rgba(0,0,0,0.4),
            0 0 25px rgba(139,92,246,0.3);
    }

    .birthday-music-button:active {
        transform: scale(0.95);
    }

    .birthday-music-button:focus-visible {
        outline: 2px solid #a78bfa;
        outline-offset: 4px;
    }

    @media (max-width: 600px) {

        .birthday-music-button {
            right: 16px;
            bottom: 16px;

            width: 44px;
            height: 44px;

            font-size: 18px;
        }

    }

    @media (prefers-reduced-motion: reduce) {

        .birthday-music-button {
            transition: none;
        }

    }
`;

document.head.appendChild(musicStyle);

/* =========================================
   UPDATE BUTTON
========================================= */

function updateMusicButton() {
  if (musicEnabled) {
    musicButton.innerHTML = "🔊";

    musicButton.setAttribute("aria-label", "Mute music");
  } else {
    musicButton.innerHTML = "🔇";

    musicButton.setAttribute("aria-label", "Play music");
  }
}

/* =========================================
   PLAY MUSIC
========================================= */

async function playMusic() {
  if (!musicEnabled) {
    return;
  }

  try {
    await audio.play();
  } catch (error) {
    /*
     * Browser may block autoplay.
     * The first user interaction will
     * attempt to start the music again.
     */
  }
}

/* =========================================
   TOGGLE MUSIC
========================================= */

musicButton.addEventListener("click", async () => {
  musicEnabled = !musicEnabled;

  localStorage.setItem("birthday-music", musicEnabled ? "on" : "off");

  updateMusicButton();

  if (musicEnabled) {
    await playMusic();
  } else {
    audio.pause();

    saveMusicPosition();
  }
});

/* =========================================
   FIRST USER INTERACTION
========================================= */

document.addEventListener(
  "click",
  () => {
    if (musicEnabled && audio.paused) {
      playMusic();
    }
  },
  {
    once: true,
  },
);

/* =========================================
   START
========================================= */

updateMusicButton();

playMusic();
