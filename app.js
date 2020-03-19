const videoContainer = document.querySelector('.video-container')
const video = document.querySelector('.video-container video')
const controlsContainer = document.querySelector('.video-container .controls-container')

// Buttons
const playPauseBtn = document.querySelector('.video-container .controls-container .controls .play-pause')
const rewindBtn = document.querySelector('.video-container .controls-container .controls .rewind')
const fastForwardBtn = document.querySelector('.video-container .controls-container .controls .fast-forward')
const volumeBtn = document.querySelector('.video-container .controls-container .controls .volume')
const fullScreenBtn = document.querySelector('.video-container .controls-container .controls .full-screen')

// Choose a Movie
const theMovie = document.querySelector('.video-container #movie')

// Progress Bar
const progressBar = document.querySelector('.video-container .controls-container .progress-controls .progress-bar')

// Volume
const volume = document.querySelector('.video-container .controls-container .controls .volume')

// Watched Bar
const wachedBar = document.querySelector('.video-container .controls-container .progress-controls .progress-bar .watched-bar')

// Time Left
const timeLeft = document.querySelector('.video-container .controls-container .progress-controls .time-remaining')

let controlsTimeout;
let src = ""
wachedBar.style.width = "0"
playPauseBtn.querySelector('.paused').style.display = 'none'
volume.querySelector('.muted').style.display = 'none'
fullScreenBtn.querySelector('.mini').style.display = 'none'

// Helper Functions
const playPause = () => {
  if(src === ""){
    alert("Please choose a the continue...")
  }
  
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

const toggleMute = () => {
  video.muted = !video.muted
  if(video.muted){
    volume.querySelector('.muted').style.display = ''
    volume.querySelector('.fullVolume').style.display = 'none'
  }else{
    volume.querySelector('.fullVolume').style.display = ''
    volume.querySelector('.muted').style.display = 'none'
  }
}

const fullScreen = () => {
  if(!document.fullscreenElement){
    videoContainer.requestFullscreen()
    fullScreenBtn.querySelector('.mini').style.display = ''
    fullScreenBtn.querySelector('.full').style.display = 'none'
  }else{
    document.exitFullscreen()
    fullScreenBtn.querySelector('.mini').style.display = 'none'
    fullScreenBtn.querySelector('.full').style.display = ''
  }
}

const displayControls = () => {
  controlsContainer.style.opacity = '1'
  if(controlsTimeout){
    clearTimeout(controlsTimeout)
  }
  controlsTimeout = setTimeout(() => {
    controlsContainer.style.opacity = '0'
  }, 5000);
}
// End Helper Functions

// It's take to movie url from pc
// and put it in the src of the video element
theMovie.addEventListener("change", () => {
  let toWatch = theMovie.files[0].name
  src = video.src
  video.src = toWatch
}, false);

playPauseBtn.addEventListener('click', playPause)

// Go Back 10s
rewindBtn.addEventListener('click', () => {
  video.currentTime -= 10
})

// Go Forward 10s
fastForwardBtn.addEventListener('click', () => {
  video.currentTime += 10
})

// Mute & Unmute
volumeBtn.addEventListener('click', toggleMute)

// Full Screen & Minimize Full Screen
fullScreenBtn.addEventListener('click', fullScreen)

// Progress Bar
progressBar.addEventListener('click', e => {
  let pos = (e.pageX  - (progressBar.offsetLeft + progressBar.offsetParent.offsetLeft)) / progressBar.offsetWidth;
  video.currentTime = pos * video.duration;
})

video.addEventListener('timeupdate', () => {
  wachedBar.style.width = ((video.currentTime / video.duration) * 100) + "%"
  let totalsSecondsRemainig = video.duration - video.currentTime
  const time = new Date(null)
  time.setSeconds(totalsSecondsRemainig)
  let hours = null
  if(totalsSecondsRemainig >= 3600){
    hours = (time.getHours().toString().padStart(2, '0')) + ":"
  }else{
    hours = ""
  }
  // let hours = (time.getHours().toString().padStart(2, '0'))
  let minutes = (time.getMinutes().toString().padStart(2, '0'))
  let seconds = (time.getSeconds().toString().padStart(2, '0'))
  timeLeft.textContent = `${hours}${minutes}:${seconds}`
})

video.addEventListener('dblclick', e => {
  fullScreen()
});

video.addEventListener('click', e => {
  playPause()
});

// Events
document.addEventListener('keydown', e => {
  displayControls()
  
  // Play & Pause
  if(e.keyCode === 32 || e.code === 'Space'){
    playPause()
  }

  // Mute & Unmute
  if(e.keyCode === 77 || e.code === 'KeyM'){
    toggleMute()
  }

  // Go Back 10s
  if(e.keyCode === 37 || e.code === 'ArrowLeft'){
    video.currentTime -= 10
  }

  // Go Forward 10s
  if(e.keyCode === 39 || e.code === 'ArrowRight'){
    video.currentTime += 10
  }

  // Decrease The Volume 
  if(e.keyCode === 40 || e.code === 'ArrowDown'){
    video.volume -= 0.1
  }

  // Increase The Volume 
  if(e.keyCode === 38 || e.code === 'ArrowUp'){
    video.volume += 0.1
  }

  // Full Screen & Minimize Full Screen
  if(e.keyCode === 70 || e.code === 'KeyF'){
    fullScreen()
  }
})

document.addEventListener('keyup', e => {
  // For -> Full Screen & Minimize Full Screen
  if(e.keyCode === 27 || e.code === 'Escape'){
    document.exitFullscreen()
    fullScreenBtn.querySelector('.mini').style.display = 'none'
    fullScreenBtn.querySelector('.full').style.display = ''
  }
})

document.addEventListener('mousemove', () => {
  displayControls()
})
