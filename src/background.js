function dispatchAction(tabId, code) {
  tabId && chrome.tabs.executeScript(tabId, { code: code });
}

function getServiceURL(service) {
  switch (service) {
    case 'Amazon':
      return 'https://music.amazon.in/*';
    case 'Apple':
      return 'https://beta.music.apple.com/*';
    case 'SoundCloud':
      return 'https://soundcloud.com/*';
    case 'YouTube':
      return 'https://music.youtube.com/watch?*';
    case 'Spotify':
      return 'https://open.spotify.com/*';
    default:
      break;
  }
}

function runCodeFor(message, service) {
  if (service === 'Spotify') {
    switch (message) {
      case 'playNextTrack':
        return "document.querySelector('.spoticon-skip-forward-16').click()";
      case 'playPreviousTrack':
        return 'document.querySelector(".spoticon-skip-back-16").click()';
      case 'togglePlayPause':
        return `
			var pauseButton = document.querySelector(".spoticon-pause-16");
			if(pauseButton != null) {
				pauseButton.click();
			} else {
				document.querySelector(".spoticon-play-16").click();
			}`;
      case 'shuffleTracks':
        return `document.querySelector(".spoticon-shuffle-16").click()`;
      default:
        return '';
    }
  }
  if (service === 'YouTube') {
    switch (message) {
      case 'togglePlayPause':
        return 'document.querySelector("#play-pause-button").click()';
      case 'playPreviousTrack':
        return 'document.querySelector(".previous-button").click()';
      case 'playNextTrack':
        return 'document.querySelector(".next-button").click()';
      case 'shuffleTracks':
        return `document.querySelector(".expand-shuffle").click()`;
      default:
        return '';
    }
  }

  if (service === 'Amazon') {
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
  }

  if (service === 'SoundCloud') {
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
  }
  if (service === 'Apple') {
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

function getNewTabUrl(service) {
  switch (service) {
    case 'Amazon':
      return 'https://music.amazon.in/';
    case 'Apple':
      return 'https://beta.music.apple.com/';
    case 'SoundCloud':
      return 'https://soundcloud.com/';
    case 'YouTube':
      return 'https://music.youtube.com/';
    default:
      return 'https://open.spotify.com/';
  }
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.origin === 'iShuffle') {
    switch (request.type) {
      case 'mediaControl':
        chrome.tabs.query({ url: getServiceURL(request.service) }, function(tabs) {
          if (tabs && tabs.length >= 1) {
            dispatchAction(tabs[0].id, runCodeFor(request.message, request.service));
          }
        });
        break;
      case 'shuffleState':
        console.log('request is in bgScript switch case', request, ' from sender ', sender);
        chrome.tabs.query({}, function(tabs) {
          for (let i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, request);
          }
        });
      case 'playButtonState':
        console.log('request is in bgScript switch case', request, ' from sender ', sender);
        chrome.tabs.query({}, function(tabs) {
          for (let i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, request);
          }
        });
        break;
      case 'activeServiceSetup':
        console.log('request is ', request);
        chrome.storage.sync.set({ activeService: request.service });
        chrome.tabs.query({}, function(tabs) {
          for (let i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, request);
          }
        });
        chrome.tabs.query({ url: getServiceURL(request.service) }, function(tabs) {
          if (!tabs || tabs.length < 1) {
            chrome.tabs.create({ url: getNewTabUrl(request.service), pinned: true, active: true });
          }
        });
        break;
      default:
        break;
    }

    if (request.message === 'shuffleTracks') {
      console.log('request is in bgScript  if statement', request, ' from sender ', sender);
      chrome.tabs.query({}, function(tabs) {
        for (let i = 0; i < tabs.length; i++) {
          chrome.tabs.sendMessage(tabs[i].id, request);
        }
      });
    }

    if (request.message === 'togglePlayPause') {
      console.log('request is in bgScript  if statement', request, ' from sender ', sender);
      chrome.tabs.query({}, function(tabs) {
        for (let i = 0; i < tabs.length; i++) {
          chrome.tabs.sendMessage(tabs[i].id, request);
        }
      });
    }
  }
});
