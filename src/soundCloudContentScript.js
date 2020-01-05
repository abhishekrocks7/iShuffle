function sendMessage(type, message) {
  chrome.runtime.sendMessage({
    service: 'SoundCloud',
    type,
    message,
    origin: 'iShuffle',
  });
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  console.log('request received in content script is ', request);
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
      case 'togglePlayPause':
        sendMessage(
          'playState',
          document
            .querySelector('.playControls__control.playControls__play')
            .classList.contains('playing')
            ? 'active'
            : 'inactive'
        );
        break;
      default:
        break;
    }
  }
});
