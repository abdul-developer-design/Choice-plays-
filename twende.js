let playlist = [];
let currentIndex = -1;
let currentMode = "audio";

const fileInput = document.getElementById("fileInput");
const playlistElement = document.getElementById("playlist");

const audioPlayer = document.getElementById("audioPlayer");
const videoPlayer = document.getElementById("videoPlayer");

const audioSection = document.getElementById("audioSection");
const videoSection = document.getElementById("videoSection");

const currentTitle = document.getElementById("currentTitle");

const audioBtn = document.getElementById("audioBtn");
const videoBtn = document.getElementById("videoBtn");
const tvBtn = document.getElementById("tvBtn");

const search = document.getElementById("search");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playPauseBtn = document.getElementById("playPauseBtn");

const volumeSlider = document.getElementById("volumeSlider");

/* ==========================
   MODE SWITCHING
========================== */

audioBtn.addEventListener("click", () => {
    document.getElementById("tvSection").style.display = "none";

    currentMode = "audio";

    audioSection.style.display = "flex";
    videoSection.style.display = "none";

    audioBtn.classList.add("active");
    videoBtn.classList.remove("active");
});

videoBtn.addEventListener("click", () => {
    document.getElementById("tvSection").style.display = "none";

    currentMode = "video";

    audioSection.style.display = "none";
    videoSection.style.display = "flex";

    videoBtn.classList.add("active");
    audioBtn.classList.remove("active");
});

tvBtn.addEventListener("click", () => {

    audioSection.style.display = "none";
    videoSection.style.display = "none";

    document.getElementById("tvSection").style.display = "block";
    document.getElementById("tvFrame").src = "https://revontechtv.online";
   

    currentTitle.textContent = "HUSNA & REHEMA TV";

    
});


/* ==========================
   FILE SELECTION
========================== */

fileInput.addEventListener("change", (e) => {

    const files = Array.from(e.target.files);

    playlist = files;

    renderPlaylist();
});

/* ==========================

   PLAYLIST
========================== */

function renderPlaylist() {

    playlistElement.innerHTML = "";

    playlist.forEach((file, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="file-name">${file.name}</span>
            <button class="delete-btn" data-index="${index}">
                🗑
            </button>
        `;

        li.querySelector(".file-name")
        .addEventListener("click", () => {

            playMedia(index);
        });

        li.querySelector(".delete-btn")
        .addEventListener("click", (e) => {

            e.stopPropagation();

            playlist.splice(index, 1);

            if(currentIndex === index){

                audioPlayer.pause();
                videoPlayer.pause();

                audioPlayer.src = "";
                videoPlayer.src = "";

                currentTitle.textContent =
                "No media selected";

                currentIndex = -1;
            }

            renderPlaylist();
        });

        playlistElement.appendChild(li);
    });
}


/* ==========================
   PLAY MEDIA
========================== */

function playMedia(index) {

    currentIndex = index;

    const file = playlist[index];

    if (!file) return;

    const url = URL.createObjectURL(file);

    currentTitle.textContent = file.name;

    document.querySelectorAll("#playlist li")
        .forEach(item => item.classList.remove("active"));


    const activeItem =
        document.querySelectorAll("#playlist li")[index];

    if (activeItem) {
        activeItem.classList.add("active");
    }

    if (file.type.startsWith("audio")) {

        audioSection.style.display = "flex";
        videoSection.style.display = "none";

        audioBtn.classList.add("active");
        videoBtn.classList.remove("active");

        currentMode = "audio";

        audioPlayer.src = url;
        audioPlayer.play();


    }

    else if (file.type.startsWith("video")) {

        audioSection.style.display = "none";
        videoSection.style.display = "flex";

        videoBtn.classList.add("active");
        audioBtn.classList.remove("active");

        currentMode = "video";

        videoPlayer.src = url;
        videoPlayer.play();
    }

    updatePlayButton();
}

/* ==========================

   PLAY / PAUSE
========================== */

playPauseBtn.addEventListener("click", () => {

    let player =
        currentMode === "audio"
        ? audioPlayer
        : videoPlayer;

    if (player.paused) {

        player.play();

    } else {

        player.pause();
    }

    updatePlayButton();

});

function updatePlayButton() {

    let player =

        currentMode === "audio"
        ? audioPlayer
        : videoPlayer;

    if(player.paused){

        playPauseBtn.innerHTML = "▶ Play";

    }else{

        playPauseBtn.innerHTML = "⏸ Pause";
    }
}


/* ==========================
   NEXT
========================== */

nextBtn.addEventListener("click", () => {

    if (playlist.length === 0) return;

    currentIndex++;

    if (currentIndex >= playlist.length) {
        currentIndex = 0;
    }

    playMedia(currentIndex);
});

/* ==========================
   PREVIOUS
========================== */

prevBtn.addEventListener("click", () => {

    if (playlist.length === 0) return;

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = playlist.length - 1;
    }

    playMedia(currentIndex);
});

/* ==========================
   VOLUME
========================== */

volumeSlider.addEventListener("input", () => {

    audioPlayer.volume = 

volumeSlider.value;
    videoPlayer.volume = volumeSlider.value;
});

/* ==========================
   SEARCH
========================== */

search.addEventListener("keyup", () => {

    const value =
        search.value.toLowerCase();

    const items =
        document.querySelectorAll("#playlist li");

    items.forEach(item => {

        if (

            item.textContent
            .toLowerCase()
            .includes(value)
        ) {

            item.style.display = "block";

        } else {

            item.style.display = "none";
        }
    });
});

/* ==========================
   AUTO NEXT
========================== */

audioPlayer.addEventListener("ended", () => {

    if(repeatMode){

        audioPlayer.currentTime = 0;
        audioPlayer.play();

    }else{

        nextBtn.click();
    }
});

videoPlayer.addEventListener("ended", () => {

    if(repeatMode){

        videoPlayer.currentTime = 0;
        videoPlayer.play();

    }else{

        nextBtn.click();
    }
});




/* button ya kufuta playlist*/

const clearListBtn = document.getElementById("clearListBtn");

clearListBtn.addEventListener("click",()=>{
    playlist = [];
    playlistElement.innerHTML = "";

    audioPlayer.pause();
    videoPlayer.pause();

    audioPlayer.src = "";
    videoPlayer.src = "";

    currentTitle.textContent = "no media selected";
    currentIndex = -1;
});


/*repeat function*/

let repeatMode = false;

const repeatBtn =
document.getElementById("repeatBtn");

repeatBtn.addEventListener("click", () => {

    repeatMode = !repeatMode;

    repeatBtn.textContent =
    repeatMode
    ? "🔁 Repeat On"
    : "🔁 Repeat Off";
});


/*shuffle function*/

const shuffleBtn =

document.getElementById("shuffleBtn");

shuffleBtn.addEventListener("click", () => {

    for(let i = playlist.length - 1; i > 0; i--){

        let j =
        Math.floor(Math.random() * (i + 1));

        [playlist[i], playlist[j]] =
        [playlist[j], playlist[i]];
    }

    renderPlaylist();
});

function confirmPassword(){
    var correctPassword = "abdul@26.";
    var answer = prompt("please enter password to continue..!");

    if (answer === correctPassword){
        return true;
    }else{
        alert("INCORRECT PASSWORD! DON'T DISTURB THIS..!");
        return false;
    }
}