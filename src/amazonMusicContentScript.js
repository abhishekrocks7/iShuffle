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
        setTimeout(() => {
          sendMessage(
            'shuffleState',
            document.querySelector('.shuffleButton').classList.contains('on')
              ? 'active'
              : 'inactive'
          );
        }, 2000);
        break;
      default:
        break;
    }
  }
});
