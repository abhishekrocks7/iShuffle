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

function getNewTabUrl(channel) {
  switch (channel) {
    case 'Amazon':
      return 'https://music.amazon.in/';
    case 'Apple':
      return 'https://beta.music.apple.com/';
    case 'SoundCloud':
      return 'https://soundcloud.com/';
    case 'Youtube':
      return 'https://www.youtube.com/';
    default:
      return 'https://open.spotify.com/';
  }
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  switch (request.type) {
    case 'controllerState':
      chrome.tabs.query({ url: getChannelUrl(request.channel) }, function(tabs) {
        if (tabs && tabs.length >= 1) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: request.type,
            message: request.message,
            tab: tabs[0].url,
          });
          console.log('request.message ', request.message, ' send to ', tabs[0].url);
        } else {
          chrome.tabs.create({ url: getNewTabUrl(request.channel) });
        }
      });
      break;
    case 'shuffleState':
      console.log('shuffleState from bg is ', request.message, ' for channel ', request.channel);
      chrome.tabs.query({}, function(tabs) {
        for (let i = 0; i < tabs.length; i++) {
          chrome.tabs.sendMessage(tabs[i].id, {
            type: request.type,
            message: request.message,
            channel: request.channel,
          });
        }
      });
      break;
    default:
      console.log('no message received');
      break;
  }
});
