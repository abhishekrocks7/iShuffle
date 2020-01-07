import { runCodeFor, getURL } from './utililty';

function dispatchAction(tabId, code) {
  tabId && chrome.tabs.executeScript(tabId, { code: code });
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.origin === 'iShuffle') {
    switch (request.type) {
      case 'mediaControl':
        chrome.tabs.query({ url: getURL(request.service, '') }, function(tabs) {
          if (tabs && tabs.length >= 1) {
            dispatchAction(tabs[0].id, runCodeFor(request.message, request.service));
            if (request.message === 'shuffleTracks' || request.message === 'togglePlayPause') {
              chrome.tabs.sendMessage(tabs[0].id, request);
            }
          }
        });
        break;
      case 'shuffleState':
        chrome.tabs.query({}, function(tabs) {
          for (let i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, request);
          }
        });
        break;
      case 'playState':
        chrome.tabs.query({}, function(tabs) {
          for (let i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, request);
          }
        });
        break;
      case 'activeServiceSetup':
        chrome.storage.sync.set({ activeService: request.service });
        chrome.tabs.query({}, function(tabs) {
          for (let i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, request);
          }
        });
        chrome.tabs.query({ url: getURL(request.service, '') }, function(tabs) {
          if (!tabs || tabs.length < 1) {
            chrome.tabs.create({
              url: getURL(request.service, 'newTabURL'),
              pinned: true,
              active: true,
            });
          }
        });
        break;
      default:
        break;
    }
  }
});
