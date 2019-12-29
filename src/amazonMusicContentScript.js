function amazonMusicControls() {
  chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.message === 'playNextTrack') {
      console.log('tabId is ', request.tabId);
      document.querySelector('[aria-label="Play next song"]').click();
    }
    if (request.message === 'playPreviousTrack') {
      console.log('tabId is ', request.tabId);
      document.querySelector('[aria-label="Previous song"]').click();
    }
    if (request.message === 'shuffleTracks') {
      console.log('tabId is ', request.tabId);
      let shuffleButton = document.querySelector('.shuffleButton');
      shuffleButton.click();
    }
    if (request.message === 'togglePlayPause') {
      console.log('tabId is ', request.tabId);
      document.querySelector('[aria-label="Play and pause"]').click();
    }
  });
}

amazonMusicControls();
