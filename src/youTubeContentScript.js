function sendMessage(type, message) {
  chrome.runtime.sendMessage({
    service: 'YouTube',
    type,
    message,
    origin: 'iShuffle',
  });
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.origin === 'iShuffle') {
    switch (request.message) {
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
