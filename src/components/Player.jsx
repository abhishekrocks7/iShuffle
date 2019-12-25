import React, { useState } from 'react';
import styled from 'styled-components';
import {
  TogglePlayIcon,
  NextTrackIcon,
  PreviousTrackIcon,
  ShuffleTrackIcon,
  OpenLinkIcon,
  MinimizeIcon,
  ExpandIcon,
} from './Icons';
import { motion } from 'framer-motion';

const PlayerView = styled(motion.div)`
  width: 160px;
  height: 160px;
  border-radius: 12px;
  position: fixed;
  bottom: 16px;
  /* left: 16px; */
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(30px);
  display: grid;
  place-items: center;
  z-index: 9999999999999999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
`;

const PlayerControlWheel = styled(motion.div)`
  width: 90%;
  height: 90%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  /* border: 1px solid rgba(255, 255, 255, 0.1); */
  position: relative;
  display: grid;
  grid-template-rows: 44px 56px 44px;
  grid-template-columns: 44px 56px 44px;
`;

const TogglePlayButton = styled(motion.div)`
  grid-area: 2/2;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  cursor: pointer;
  display: grid;
  place-items: center;
`;

const NextTrackButton = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  grid-area: 2/3/3/3;
  cursor: pointer;
  opacity: 0.7;
`;

const PreviousTrackButton = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  grid-area: 2/2/2/1;
  cursor: pointer;
  opacity: 0.7;
`;

const MenuButton = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  grid-area: 2/2/1/2;
  font-size: 11px;
  letter-spacing: 1px;
  line-height: 16px;
  font-weight: 600;
  color: #fff;
  opacity: 0.7;
  text-transform: uppercase;
  cursor: pointer;
`;

const OpenLinkButton = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  grid-area: 3/2;
  cursor: pointer;
  opacity: 0.7;
`;

const MimimizeView = styled(motion.div)`
  width: 24px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  position: absolute;
  left: 4px;
  bottom: 4px;
  cursor: pointer;
  display: grid;
  place-items: center;
`;

function Player() {
  const [minimize, setMinimize] = useState(false);

  const handleTogglePlay = () => {
    console.log('toggle playPause click');
    chrome.runtime.sendMessage({ message: 'togglePlayPause' });
  };

  const handleNextTrack = () => {
    chrome.runtime.sendMessage({ message: 'playNextTrack' });
  };

  const handlePreviousTrack = () => {
    chrome.runtime.sendMessage({ message: 'playPreviousTrack' });
  };

  const handleOpenLink = () => {
    chrome.runtime.sendMessage({ message: 'openLink' });
  };

  return (
    <PlayerView
      animate={{ width: minimize ? 32 : 160, height: minimize ? 32 : 160 }}
      drag="x"
      dragConstraints={{ left: 16, right: document.body.clientWidth - 176 }}
    >
      <MimimizeView
        isMinimized={minimize}
        animate={
          minimize ? { backgroundColor: 'rgba(0,0,0,0.0)' } : { backgroundColor: 'rgba(0,0,0,0.4)' }
        }
        onClick={() => setMinimize(!minimize)}
      >
        {minimize ? <ExpandIcon /> : <MinimizeIcon />}
      </MimimizeView>
      <PlayerControlWheel
        animate={minimize ? { display: 'none', opacity: 0 } : { display: 'grid', opacity: 1 }}
      >
        <TogglePlayButton
          onClick={() => handleTogglePlay()}
          whileTap={{ scale: 0.92, backgroundColor: 'rgba(255, 255, 255, 0.16)' }}
        >
          <TogglePlayIcon />
        </TogglePlayButton>
        <NextTrackButton onClick={() => handleNextTrack()} whileTap={{ scale: 0.92, opacity: 1 }}>
          <NextTrackIcon />
        </NextTrackButton>
        <PreviousTrackButton
          onClick={() => handlePreviousTrack()}
          whileTap={{ scale: 0.92, opacity: 1 }}
        >
          <PreviousTrackIcon />
        </PreviousTrackButton>
        <MenuButton whileTap={{ scale: 0.92, opacity: 1 }}>Menu</MenuButton>
        <OpenLinkButton onClick={() => handleOpenLink()} whileTap={{ scale: 0.92, opacity: 1 }}>
          <OpenLinkIcon />
        </OpenLinkButton>
      </PlayerControlWheel>
    </PlayerView>
  );
}

export default Player;
