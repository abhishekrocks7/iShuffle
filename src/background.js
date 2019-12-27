function dispatchAction(tabId, code) {
  chrome.tabs.executeScript(tabId, { code: code });
}

function getChannelUrl(channel) {
  switch (channel) {
    case 'Amazon':
      return 'https://music.amazon.in/*';
    case 'Apple':
      return 'https://beta.music.apple.com/*';
    case 'SoundCloud':
      return 'https://soundcloud.com/*';
    case 'Youtube':
      return 'https://www.youtube.com/watch?*';
    default:
      return 'https://open.spotify.com/*';
  }
}

function runCodeFor(message, channel) {
  if (channel === 'Spotify') {
    switch (message) {
      case 'playNextTrack':
        return "document.querySelector('.spoticon-skip-forward-16').click()";
      case 'playPreviousTrack':
        return 'document.querySelector(".spoticon-skip-back-16").click()';
      case 'togglePlayPause':
        return `
                    var pauseBttn = document.querySelector(".spoticon-pause-16");
                    if(pauseBttn != null) {
                        pauseBttn.click();
                    } else {
                        document.querySelector(".spoticon-play-16").click();
                    }
                `;
      case 'shuffleTracks':
        return 'document.querySelector(".spoticon-shuffle-16").click()';
      default:
        return '';
    }
  } else if (channel === 'Youtube') {
    switch (message) {
      case 'playNextTrack':
        return 'document.querySelector(".ytp-next-button").click()';
      case 'playPreviousTrack':
        return 'window.history.back()';
      case 'togglePlayPause':
        return 'document.querySelector(".ytp-play-button").click()';
      default:
        return '';
    }
  } else if (channel === 'Amazon') {
    switch (message) {
      case 'playNextTrack':
        return 'document.querySelector(\'[aria-label="Play next song"]\').click()';
      case 'playPreviousTrack':
        return 'document.querySelector(\'[aria-label="Previous song"]\').click()';
      case 'togglePlayPause':
        return 'document.querySelector(\'[aria-label="Play and pause"]\').click()';
      case 'shuffleTracks':
        return 'document.querySelector(".shuffleButton").click()';
      default:
        return '';
    }
  } else if (channel === 'SoundCloud') {
    switch (message) {
      case 'playNextTrack':
        return 'document.querySelector(".skipControl.playControls__next.skipControl__next").click()';
      case 'playPreviousTrack':
        return 'document.querySelector(".playControls__prev.skipControl__previous").click()';
      case 'togglePlayPause':
        return 'document.querySelector(".playControls__control.playControls__play").click()';
      case 'shuffleTracks':
        return 'document.querySelector(".shuffleControl.sc-ir").click()';
      default:
        return '';
    }
  } else {
    switch (message) {
      case 'playNextTrack':
        return 'document.querySelector(\'[aria-label="Next"]\').click()';
      case 'playPreviousTrack':
        return 'document.querySelector(\'[aria-label="Previous"]\').click()';
      case 'togglePlayPause':
        return `var appleMusicpauseBtn = document.querySelector(\'[aria-label="Pause"]\');
                    if(appleMusicpauseBtn != null) {
                        appleMusicpauseBtn.click();
                    } else {
                        document.querySelector(\'[aria-label="Play"]\').click();
                    }`;
      case 'shuffleTracks':
        return 'document.querySelector(\'[aria-label="Shuffle"]\').click()';
      default:
        return '';
    }
  }
}

chrome.extension.onRequest.addListener(function(request, sender) {
  chrome.tabs.query({ url: getChannelUrl(request.channel) }, function(tabs) {
    dispatchAction(
      tabs && tabs.length >= 1 && tabs[0].id,
      runCodeFor(request.message, request.channel)
    );
  });
});
