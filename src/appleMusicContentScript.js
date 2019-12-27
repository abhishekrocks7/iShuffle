// function appleMusicControls() {
//   chrome.runtime.onMessage.addListener(function(request, sender) {
//     if (request.message === 'playNextTrack') {
//       console.log('tabId is ', request.tabId);
//       document.querySelector('[aria-label="Next"]').click();
//     }
//     if (request.message === 'playPreviousTrack') {
//       console.log('tabId is ', request.tabId);
//       document.querySelector('[aria-label="Previous"]').click();
//     }
//     if (request.message === 'shuffleTracks') {
//       console.log('tabId is ', request.tabId);
//       let shuffleButton = document.querySelector('[aria-label="Shuffle"]');
//       shuffleButton.click();
//     }
//     if (request.message === 'togglePlayPause') {
//       console.log('tabId is ', request.tabId);
//       var appleMusicpauseBtn = document.querySelector('[aria-label="Pause"]');
//       if (appleMusicpauseBtn != null) {
//         appleMusicpauseBtn.click();
//       } else {
//         document.querySelector('[aria-label="Play"]').click();
//       }
//     }
//   });
// }

// appleMusicControls();
