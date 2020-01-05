function sendMessage(type, message) {
  chrome.runtime.sendMessage({
    service: 'SoundCloud',
    type,
    message,
    origin: 'iShuffle',
  });
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.origin === 'iShuffle') {
    switch (request.message) {
      case 'shuffleTracks':
        sendMessage(
          'shuffleState',
          document.querySelector('.control-button.spoticon-shuffle-16.control-button--active') !==
            null
            ? 'inactive'
            : 'active'
        );
        break;
      case 'togglePlayPause':
        sendMessage(
          'playState',
          document.querySelector('.spoticon-pause-16') !== null ? 'inactive' : 'active'
        );
      default:
        break;
    }
  }
});
