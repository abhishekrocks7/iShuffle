function soundCloudMusicControls() {
  chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.message === 'playNextTrack') {
      document.querySelector('.skipControl.playControls__next.skipControl__next').click();
    }
    if (request.message === 'playPreviousTrack') {
      document.querySelector('.playControls__prev.skipControl__previous').click();
    }
    if (request.message === 'shuffleTracks') {
      let shuffleButton = document.querySelector('.shuffleControl.sc-ir');
      shuffleButton.click();
    }
    if (request.message === 'togglePlayPause') {
      document.querySelector('.playControls__control.playControls__play').click();
    }
  });
}

soundCloudMusicControls();

function findShuffleState() {
  if (document.querySelector('.shuffleControl.sc-ir').classList.contains('m-shuffling')) {
    console.log('shuffle is active');
    chrome.runtime.sendMessage({ type: 'shuffleState', message: 'active', channel: 'SoundCloud' });
  } else {
    console.log('shuffle is inactive');
    chrome.runtime.sendMessage({
      type: 'shuffleState',
      message: 'inactive',
      channel: 'SoundCloud',
    });
  }
}

window.addEventListener('load', () => {
  let shuffleButton = document.querySelector('.shuffleControl.sc-ir');
  findShuffleState();

  shuffleButton.addEventListener('click', () => {
    findShuffleState();
  });
});
