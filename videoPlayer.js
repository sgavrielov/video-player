const videoContainer = document.querySelector(".videoContainer");
const video = videoContainer.querySelector("video");
const videoControlsContainer = videoContainer.querySelector(
  ".videoControlsContainer"
);
const videoControls = videoControlsContainer.querySelector(".controls");
const timelineContainer =
  videoControlsContainer.querySelector(".timelineContainer");
const playPauseBtn = videoControls.querySelector(".playPauseBtn");
const miniPlayerBtn = videoControls.querySelector(".miniPlayerBtn");
const theaterBtn = videoControls.querySelector(".theaterBtn");
const fullScreenBtn = videoControls.querySelector(".fullScreenBtn");
const muteBtn = videoControls.querySelector(".muteBtn");
const volumeSlider = videoControls.querySelector(".volumeSlider");
const currentTimeElem = videoControls.querySelector(".currentTime");
const totalTimeElem = videoControls.querySelector(".totalTime");
const rewindBtn = videoControls.querySelector(".rewindBtn");
const fastForwardBtn = videoControls.querySelector(".fastForwardBtn");
const captionsBtn = videoControls.querySelector(".captionsBtn");
const speedBtn = videoControls.querySelector(".speedBtn");
const previewImg = videoControlsContainer.querySelector(".previewImg");
const thumbnailImg = videoContainer.querySelector(".thumbnailImg");
let isScrubbing = false;
let wasPaused = false;

document.addEventListener("keydown", (e) => {
  const tagName = document.activeElement.tagName.toLowerCase();

  if (tagName === "input") return;

  switch (e.key.toLowerCase()) {
    case " ":
      if (tagName === "button") return;
    case "k":
      togglePlayPause();
      break;
    case "f":
      toggleFullScreenMode();
      break;
    case "t":
      toggleTheaterMode();
      break;
    case "i":
      toggleMiniPlayerMode();
      break;
    case "m":
      toggleMute();
      break;
    case "arrowup":
      changeVolume(0.1);
      break;
    case "arrowdown":
      changeVolume(-0.1);
      break;
    case "arrowleft":
    case "j":
      skip(-5);
      break;
    case "arrowright":
    case "l":
      skip(5);
      break;
    case "c":
      if (
        video.textTracks.length > 0 &&
        video.textTracks[0].kind === "captions"
      ) {
        toggleCaptions();
      }
      break;
  }
});

// timeline
timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
timelineContainer.addEventListener("mousedown", toggleScrubbing);
document.addEventListener("mouseup", (e) => {
  if (isScrubbing) toggleScrubbing(e);
});
document.addEventListener("mousemove", (e) => {
  if (isScrubbing) handleTimelineUpdate(e);
});

function toggleScrubbing(e) {
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  isScrubbing = (e.buttons & 1) === 1;
  videoContainer.classList.toggle("scrubbing", isScrubbing);
  if (isScrubbing) {
    wasPaused = video.paused;
    video.pause();
  } else {
    video.currentTime = percent * video.duration;
    if (!wasPaused) {
      video.play();
    }
  }

  handleTimelineUpdate(e);
}

function handleTimelineUpdate(e) {
  const rect = timelineContainer.getBoundingClientRect();
  const percent =
    Math.min(Math.max(0 + 100, e.x - rect.x), rect.width - 100) / rect.width;
  const previewImgNumber = Math.max(
    1,
    Math.floor((percent * video.duration) / 10)
  );
  const previewImgSrc = `/assets/previewImgs/preview${previewImgNumber}.jpg`;
  previewImg.src = previewImgSrc;
  timelineContainer.style.setProperty("--preview-position", percent);

  if (isScrubbing) {
    e.preventDefault();
    thumbnailImg.src = previewImgSrc;
    timelineContainer.style.setProperty("--progress-position", percent);
  }
}

// playback speed
speedBtn.addEventListener("click", changePlaybackSpeed);

function changePlaybackSpeed() {
  let newPlaybackRate = video.playbackRate + 0.25;
  if (newPlaybackRate > 2) {
    newPlaybackRate = 0.25;
  }
  video.playbackRate = newPlaybackRate;
  speedBtn.textContent = newPlaybackRate + "x";
}

// caption
if (video.textTracks.length > 0 && video.textTracks[0].kind === "captions") {
  video.textTracks[0].mode = "hidden";
  captionsBtn.addEventListener("click", toggleCaptions);
}

function toggleCaptions() {
  const isHidden = video.textTracks[0].mode === "hidden";
  video.textTracks[0].mode = isHidden ? "showing" : "hidden";
  videoContainer.classList.toggle("captions", isHidden);
}

// duration
fastForwardBtn.addEventListener("click", () => skip(5));
rewindBtn.addEventListener("click", () => skip(-5));
video.addEventListener("loadeddata", () => {
  totalTimeElem.textContent = formatDuration(video.duration);
});

video.addEventListener("timeupdate", () => {
  currentTimeElem.textContent = formatDuration(video.currentTime);
  const percent = video.currentTime / video.duration;
  timelineContainer.style.setProperty("--progress-position", percent);
});

function skip(duration) {
  video.currentTime += duration;
}

function formatDuration(duration) {
  const seconds = Math.floor(duration % 60);
  const minutes = Math.floor(duration / 60) % 60;
  const hours = Math.floor(duration / 3600);

  const leadingZero = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });

  if (hours === 0) {
    return `${minutes}:${leadingZero.format(seconds)}`;
  } else {
    return `${hours}:${leadingZero.format(minutes)}:${leadingZero.format(
      seconds
    )}`;
  }
}

// volume
muteBtn.addEventListener("click", toggleMute);
volumeSlider.addEventListener("input", (e) => {
  video.volume = e.target.value;
  video.muted = video.volume === 0;
});
video.addEventListener("volumechange", () => {
  volumeSlider.value = video.volume;
  let volumeLevel;
  if (video.muted || video.volume === 0) {
    volumeSlider.value = 0;
    volumeLevel = "muted";
  } else if (video.volume >= 0.5) {
    volumeLevel = "high";
  } else {
    volumeLevel = "low";
  }

  videoContainer.dataset.volumeLevel = volumeLevel;
  // video.volume;
  // video.muted;
});

function toggleMute() {
  video.muted = !video.muted;
}

function changeVolume(volume) {
  video.volume += volume;
  volumeSlider.value = video.volume;
}

// view modes
theaterBtn.addEventListener("click", toggleTheaterMode);
fullScreenBtn.addEventListener("click", toggleFullScreenMode);
video.addEventListener("dblclick", toggleFullScreenMode);
miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode);

function toggleTheaterMode() {
  videoContainer.classList.toggle("theater");
}

function toggleFullScreenMode() {
  if (document.fullscreenElement == null) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function toggleMiniPlayerMode() {
  if (videoContainer.classList.contains("miniPlayer")) {
    document.exitPictureInPicture();
  } else {
    video.requestPictureInPicture();
  }
}

document.addEventListener("fullscreenchange", () => {
  videoContainer.classList.toggle("fullScreen", document.fullscreenElement);
});

video.addEventListener("enterpictureinpicture", () => {
  videoContainer.classList.add("miniPlayer");
});

video.addEventListener("leavepictureinpicture", () => {
  videoContainer.classList.remove("miniPlayer");
});

// play / pause
playPauseBtn.addEventListener("click", togglePlayPause);
video.addEventListener("click", togglePlayPause);
video.addEventListener("play", () => {
  videoContainer.classList.remove("paused");
});
video.addEventListener("pause", () => {
  videoContainer.classList.add("paused");
});

function togglePlayPause() {
  video.paused ? video.play() : video.pause();
}
