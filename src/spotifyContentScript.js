function getShuffleState() {
  if (document.querySelector('.spoticon-shuffle-16').classList.contains('control-button--active')) {
    chrome.runtime.sendMessage({
      service: 'Spotify',
      type: 'shuffleState',
      message: 'active',
      origin: 'iShuffle',
    });
  } else {
    chrome.runtime.sendMessage({
      service: 'Spotify',
      type: 'shuffleState',
      message: 'inactive',
      origin: 'iShuffle',
    });
  }
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.origin === 'iShuffle') {
    switch (request.message) {
      case 'shuffleTracks':
        setTimeout(() => {
          getShuffleState();
        }, 3500);
        break;
      default:
        break;
    }
  }
});
