// function soundCloudMusicControls() {
//   chrome.runtime.onMessage.addListener(function(request, sender) {
//     if (request.message === 'playNextTrack') {
//       document.querySelector('.skipControl.playControls__next.skipControl__next').click();
//     }
//     if (request.message === 'playPreviousTrack') {
//       console.log('tabId is ', request.tabId);
//       document.querySelector('.playControls__prev.skipControl__previous').click();
//     }
//     if (request.message === 'shuffleTracks') {
//       console.log('tabId is ', request.tabId);
//       let shuffleButton = document.querySelector('.shuffleControl.sc-ir');
//       shuffleButton.click();
//     }
//     if (request.message === 'togglePlayPause') {
//       document.querySelector('.playControls__control.playControls__play').click();
//     }
//   });
// }

// soundCloudMusicControls();
