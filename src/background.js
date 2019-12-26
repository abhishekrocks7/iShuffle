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

chrome.extension.onRequest.addListener(function(request, sender) {
  if (
    request.message === 'playNextTrack' ||
    request.message === 'playPreviousTrack' ||
    request.message === 'shuffleTracks' ||
    request.message === 'togglePlayPause'
  ) {
    chrome.tabs.query({ url: getChannelUrl(request.channel) }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: request.message, tab: tabs[0].url });
      console.log('request.message ', request.message, ' send to ', tabs[0].url);
    });
  }
});
