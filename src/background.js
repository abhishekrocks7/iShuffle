var MEDIA_CONSTANTS = {
  NEXT: 'next_music',
  PREVIOUS: 'previous_music',
  TOGGLE_PLAY_PAUSE: 'toggle_play_pause',
  MUTE: 'toggle_mute_music',
  REPLAY: 'replay',
  SHUFFLE: 'shuffle_music',
  OPEN_LINK: 'open_link',
};

var PLAYERS_PATTERN = [
  {
    url: 'https://www.youtube.com/watch?*',
    commands: {
      next: tab => 'document.querySelector(".ytp-next-button").click()',
      previous: tab => {
        var isList = tab.url.indexOf('list') > -1;
        if (isList) {
          return 'document.querySelector(".ytp-prev-button").click()';
        } else {
          return 'window.history.back()';
        }
      },
      togglePlayPause: tab => 'document.querySelector(".ytp-play-button").click()',
      openLink: tab => chrome.tabs.update(tab.id, { active: true }),
    },
  },
  {
    url: 'https://music.amazon.in/*',
    commands: {
      next: tab => 'document.querySelector(\'[aria-label="Play next song"]\').click()',
      previous: tab => 'document.querySelector(\'[aria-label="Previous song"]\').click()',
      togglePlayPause: tab => 'document.querySelector(\'[aria-label="Play and pause"]\').click()',
      openLink: tab => chrome.tabs.update(tab.id, { active: true }),
      shuffle: tab => 'document.querySelector(".shuffleButton").click()',
    },
  },
  {
    url: 'https://beta.music.apple.com/*',
    commands: {
      next: tab => 'document.querySelector(\'[aria-label="Next"]\').click()',
      previous: tab => 'document.querySelector(\'[aria-label="Previous"]\').click()',
      togglePlayPause: tab => `
            var appleMusicpauseBtn = document.querySelector(\'[aria-label="Pause"]\');
                    if(appleMusicpauseBtn != null) {
                        appleMusicpauseBtn.click();
                    } else {
                        document.querySelector(\'[aria-label="Play"]\').click();
                    }
        `,
      shuffle: tab => 'document.querySelector(\'[aria-label="Shuffle"]\').click()',
      openLink: tab => chrome.tabs.update(tab.id, { active: true }),
    },
  },
  {
    url: 'https://open.spotify.com/*',
    commands: {
      next: tab => 'document.querySelector(".spoticon-skip-forward-16").click()',
      previous: tab => 'document.querySelector(".spoticon-skip-back-16").click()',
      togglePlayPause: tab => `
                    var pauseBttn = document.querySelector(".spoticon-pause-16");
                    if(pauseBttn != null) {
                        pauseBttn.click();
                    } else {
                        document.querySelector(".spoticon-play-16").click();
                    }
                `,
      shuffle: tab => 'document.querySelector(".spoticon-shuffle-16").click()',
      openLink: tab => chrome.tabs.update(tab.id, { active: true }),
    },
  },
];

function getCurrentMusicTabWithAction() {
  return new Promise((resolve, reject) => {
    var query = { url: PLAYERS_PATTERN.map(e => e.url) };

    var callback = function(tabs) {
      if (!tabs || !tabs.length) reject(null);

      var audioTab = tabs.filter(tab => tab.audible);

      var principalAudioTab = audioTab && audioTab.length ? audioTab[0] : tabs[0];

      let playerPattern = PLAYERS_PATTERN.find(
        e => principalAudioTab.url.indexOf(e.url.replace('*', '')) > -1
      );

      resolve({
        tab: principalAudioTab,
        pattern: playerPattern,
      });
    };

    chrome.tabs.query(query, callback);
  });
}

function dispatchAction(tabId, code) {
  chrome.tabs.executeScript(tabId, { code: code });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  getCurrentMusicTabWithAction().then(({ tab, pattern }) => {
    console.log('getCurrentMusicTabWithAction is ', tab);
    if (request.message === 'togglePlayPause') {
      dispatchAction(tab.id, pattern.commands.togglePlayPause(tab));
    }
    if (request.message === 'playNextTrack') {
      dispatchAction(tab.id, pattern.commands.next(tab));
    }

    if (request.message === 'playPreviousTrack') {
      dispatchAction(tab.id, pattern.commands.previous(tab));
    }

    if (request.message === 'shuffleTracks') {
      dispatchAction(tab.id, pattern.commands.shuffle(tab));
    }
    if (request.message === 'openLink') {
      dispatchAction(tab.id, pattern.commands.openLink(tab));
    }
  });
});
