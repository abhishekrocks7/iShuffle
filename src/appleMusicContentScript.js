// function appleMusicControls() {
//   chrome.runtime.onMessage.addListener(function(request, sender) {
//     if (request.message === 'playNextTrack') {
//       console.log('tabId is ', request.tabId);
//       document.querySelector('[aria-label="Next"]').click();
//       enableEventListener();
//     }
//     if (request.message === 'playPreviousTrack') {
//       console.log('tabId is ', request.tabId);
//       document.querySelector('[aria-label="Previous"]').click();
//       enableEventListener();
//     }
//     if (request.message === 'shuffleTracks') {
//       console.log('tabId is ', request.tabId);
//       let shuffleButton = document.querySelector('[aria-label="Shuffle"]');
//       shuffleButton.click();

//       enableEventListener();
//     }
//     if (request.message === 'togglePlayPause') {
//       console.log('tabId is ', request.tabId);
//       var appleMusicpauseBtn = document.querySelector('[aria-label="Pause"]');
//       enableEventListener();
//       if (appleMusicpauseBtn != null) {
//         appleMusicpauseBtn.click();
//       } else {
//         document.querySelector('[aria-label="Play"]').click();
//       }
//     }
//   });
// }

// appleMusicControls();

// function findShuffleState() {
//   setTimeout(() => {
//     if (document.querySelector('[aria-label="Shuffle"]').classList.contains('active')) {
//       console.log('shuffle is active');
//       chrome.runtime.sendMessage({ type: 'shuffleState', message: 'active', channel: 'Apple' });
//     } else {
//       console.log('shuffle is inactive');
//       chrome.runtime.sendMessage({
//         type: 'shuffleState',
//         message: 'inactive',
//         channel: 'Apple',
//       });
//     }
//   }, 1000);
// }

// function enableEventListener() {
//   document.querySelector('[aria-label="Shuffle"]').addEventListener('click', () => {
//     findShuffleState();
//   });
// }

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
      default:
        break;
    }
  }
});
