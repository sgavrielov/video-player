// Video Container
const videoContainer = document.querySelector('.video-container')

// Video Controls Container
const controlsContainer = videoContainer.querySelector('.controls-container')

// Video Controls
const controls = controlsContainer.querySelector('.controls')

// The Video
const video = videoContainer.querySelector('video')

// Play & Pause Button Container
const playPauseBtn = controls.querySelector('.play-pause')

// Rewind Button
const rewindBtn = controls.querySelector('.rewind')

// Fast Forward Button
const fastForwardBtn = controls.querySelector('.fast-forward')

// Volume Button
const volumeBtn = controls.querySelector('.volume')

// Volume Range Button
const volumeRange = controls.querySelector('.volume-range')

// Full Screen Button Container
const fullScreenBtn = controls.querySelector('.full-screen')
const maximizeBtn = fullScreenBtn.querySelector('.maximize')
const minimizeBtn = fullScreenBtn.querySelector('.minimize')

// Progress Bar
const progressBar = document.querySelector('.video-container .progress-controls .progress-bar')
const watchedBar = document.querySelector('.video-container .progress-controls .progress-bar .watched-bar')

// Time Remaining
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
  if(e.key === ' ' || e.code === 'Space'){
    playPause()
  }

  // Full Screen & Minimize Full Screen
  if(e.key === 'f' || e.code === 'KeyF'){
    toggleFullScreen()
  }

  // Mute & Unmute
  if(e.key === 'm' || e.code === 'KeyM'){
    toggleMute()
  }

  // Start over
  if(e.key === '0' || e.code === 'Numpad0'){
    video.currentTime = 0
  }

  // Decrease the volume
  if(e.key === 'ArrowDown'){
    video.volume -= 0.10
    let t = video.volume.toString().slice(2, 3)
    volumeRange.value = (t * 100) / 10
  }

  // Increase  the volume
  if(e.key === 'ArrowUp' || e.code === 'ArrowUp'){
    video.volume += 0.10
    let t = video.volume.toString().slice(2, 3)
    volumeRange.value = (t * 100) / 10
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

// Video
video.addEventListener('click', playPause)
video.addEventListener('dblclick', toggleFullScreen);