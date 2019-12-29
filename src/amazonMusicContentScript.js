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

function findShuffleState() {
  setTimeout(() => {
    if (document.querySelector('.shuffleButton').classList.contains('on')) {
      console.log('shuffle is active');
      chrome.runtime.sendMessage({ type: 'shuffleState', message: 'active', channel: 'Amazon' });
    } else {
      console.log('shuffle is inactive');
      chrome.runtime.sendMessage({
        type: 'shuffleState',
        message: 'inactive',
        channel: 'Amazon',
      });
    }
  }, 2000);
}

window.addEventListener('load', () => {
  findShuffleState();

  document.querySelector('.shuffleButton').addEventListener('click', () => {
    findShuffleState();
  });
});
