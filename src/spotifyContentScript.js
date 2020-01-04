// window.addEventListener('load', () => {
//   getShuffleState();
// });

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

function getPlayButtonState() {
  if (document.querySelector('.spoticon-pause-16') !== null) {
    console.log('show pause icon');
    chrome.runtime.sendMessage({
      service: 'Spotify',
      type: 'playButtonState',
      message: 'active',
      origin: 'iShuffle',
    });
  } else {
    console.log('show play icon');
    chrome.runtime.sendMessage({
      service: 'Spotify',
      type: 'playButtonState',
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
      case 'togglePlayPause':
        console.log('received request for togglePlay pause ##', request);
        setTimeout(() => {
          getPlayButtonState();
        }, 3500);
        break;
      default:
        break;
    }
  }
});
