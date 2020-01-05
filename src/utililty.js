export function runCodeFor(message, service) {
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

export function getURL(service, condition) {
  switch (service) {
    case 'Amazon':
      return condition === 'newTabURL' ? 'https://music.amazon.in/' : 'https://music.amazon.in/*';
    case 'Apple':
      return condition === 'newTabURL'
        ? 'https://beta.music.apple.com/'
        : 'https://beta.music.apple.com/*';
    case 'SoundCloud':
      return condition === 'newTabURL' ? 'https://soundcloud.com/' : 'https://soundcloud.com/*';
    case 'YouTube':
      return condition === 'newTabURL'
        ? 'https://music.youtube.com/'
        : 'https://music.youtube.com/watch?*';
    case 'Spotify':
      return condition === 'newTabURL' ? 'https://open.spotify.com/' : 'https://open.spotify.com/*';
  }
}
