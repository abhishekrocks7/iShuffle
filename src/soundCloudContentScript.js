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
          document.querySelector('.shuffleControl.sc-ir').classList.contains('m-shuffling')
            ? 'active'
            : 'inactive'
        );
        break;
      default:
        break;
    }
  }
});
