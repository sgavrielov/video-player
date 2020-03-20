const videoContainer = document.querySelector('.video-container')
const controlsContainer = document.querySelector('.video-container .controls-container')
const video = videoContainer.querySelector('video')

const playPauseBtn = document.querySelector('.video-container .controls .play-pause')
const rewindBtn = document.querySelector('.video-container .controls .rewind')
const fastForwardBtn = document.querySelector('.video-container .controls .fast-forward')
const volumeBtn = document.querySelector('.video-container .controls .volume')
const volumeRange = document.querySelector('.video-container .controls .volume-range')
const fullScreenBtn = document.querySelector('.video-container .controls .full-screen')
const maximizeBtn = fullScreenBtn.querySelector('.maximize')
const minimizeBtn = fullScreenBtn.querySelector('.minimize')

const progressBar = document.querySelector('.video-container .progress-controls .progress-bar')
const watchedBar = document.querySelector('.video-container .progress-controls .progress-bar .watched-bar')
const timeLeft = document.querySelector('.video-container .progress-controls .time-remaining')

watchedBar.style.width = '0%'
playPauseBtn.querySelector('.paused').style.display = 'none'
volumeBtn.querySelector('.muted').style.display = 'none'
minimizeBtn.style.display = 'none'
let controlsTimeout

/* Key Events */
document.addEventListener('keydown', e => {
  displayControls()
  
  // Play & Pause
  if(e.keyCode === 32 || e.code === 'Space'){
    playPause()
  }

  // Full Screen & Minimize Full Screen
  if(e.keyCode === 70 || e.code === 'KeyF'){
    toggleFullScreen()
  }

  // Mute & Unmute
  if(e.keyCode === 77 || e.code === 'KeyM'){
    toggleMute()
  }
})

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    maximizeBtn.style.display = ''
    minimizeBtn.style.display = 'none'
  } else {
    maximizeBtn.style.display = 'none'
    minimizeBtn.style.display = ''
  }
})

document.addEventListener('mousemove', e => {
  displayControls()
})

/* Functions */
const playPause = () => {
  if(video.paused){
    video.play()
    playPauseBtn.querySelector('.playing').style.display = 'none'
    playPauseBtn.querySelector('.paused').style.display = ''
  }else{
    video.pause()
    playPauseBtn.querySelector('.playing').style.display = ''
    playPauseBtn.querySelector('.paused').style.display = 'none'
  }
}

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen()
  } else {
    document.exitFullscreen();
  }
}

const toggleMute = () => {
  video.muted = !video.muted
  if(video.muted){
    volumeBtn.querySelector('.full-volume').style.display = 'none'
    volumeBtn.querySelector('.muted').style.display = ''
    volumeRange.value = 0
  }else{
    volumeBtn.querySelector('.full-volume').style.display = ''
    volumeBtn.querySelector('.muted').style.display = 'none'
    volumeRange.value = 100
  }
}

const displayControls = () => {
  controlsContainer.style.opacity = '1'
  video.style.cursor = ''
  if(controlsTimeout){
    clearTimeout(controlsTimeout)
  }
  controlsTimeout = setTimeout(() => {
    controlsContainer.style.opacity = '0'
    video.style.cursor = 'none'
  }, 3000);
}

/* Event Listener */

// Video (timeupdate)
video.addEventListener('timeupdate', () => {
  watchedBar.style.width = ((video.currentTime / video.duration) * 100) + "%"
  const totalSecondsRemaining = video.duration - video.currentTime
  let minutes = Math.floor(totalSecondsRemaining / 60)
  let seconds = Math.floor(totalSecondsRemaining % 60)
  let hours = Math.floor(minutes / 60)

  while(minutes > 60){
    minutes -= 60
  }

  if(hours >= 1){
    timeLeft.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }else{
    timeLeft.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

})

// Progress Bar
progressBar.addEventListener('click', e => {
  let pos = (e.pageX  - (progressBar.offsetLeft + progressBar.offsetParent.offsetLeft)) / progressBar.offsetWidth;
  video.currentTime = pos * video.duration;
})

// Play Pause Button
playPauseBtn.addEventListener('click', playPause)

// Rewind Button
rewindBtn.addEventListener('click', () => {
  video.currentTime -= 10
})

// Fast Forward Button
fastForwardBtn.addEventListener('click', () => {
  video.currentTime += 10
})

// Volume Button
volumeBtn.addEventListener('click', toggleMute)

// Volume Range
volumeRange.addEventListener('change', () => {
  video.volume = volumeRange.value / 100
})

// Full Screen Button
fullScreenBtn.addEventListener('click', toggleFullScreen)