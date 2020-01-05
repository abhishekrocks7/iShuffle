function sendMessage(type, message) {
  chrome.runtime.sendMessage({
    service: 'Apple',
    type,
    message,
    origin: 'iShuffle',
  });
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.origin === 'iShuffle') {
    switch (request.message) {
      case 'shuffleTracks':
        setTimeout(() => {
          sendMessage(
            'shuffleState',
            document.querySelector('[aria-label="Shuffle"]').classList.contains('active')
              ? 'active'
              : 'inactive'
          );
        }, 1000);
        break;
      case 'togglePlayPause':
        sendMessage(
          'playState',
          document.querySelector('[aria-label="Pause"]') !== null ? 'inactive' : 'active'
        );
        break;
      default:
        break;
    }
  }
});
