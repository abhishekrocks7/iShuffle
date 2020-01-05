function sendMessage(type, message) {
  chrome.runtime.sendMessage({
    service: 'Amazon',
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
          document.querySelector('.shuffleButton.on') !== null ? 'inactive' : 'active'
        );
        break;
      case 'togglePlayPause':
        sendMessage(
          'playState',
          document.querySelector('.playerIconPause') !== null ? 'inactive' : 'active'
        );
        break;
      default:
        break;
    }
  }
});
