import React, { useState, Fragment, useRef } from 'react';
import styled from 'styled-components';
import {
  TogglePlayIcon,
  NextTrackIcon,
  PreviousTrackIcon,
  ShuffleTrackIcon,
  OpenLinkIcon,
  MinimizeIcon,
  ExpandIcon,
  SpotifyIcon,
} from './Icons';
import { motion } from 'framer-motion';

const Wrapper = styled.div`
  position: fixed;
  top: 16px;
  left: 16px;
  right: 16px;
  bottom: 16px;
  background-color: transparent;
  visibility: hidden;
`;

const PlayerView = styled(motion.div)`
  width: 160px;
  height: 160px;
  border-radius: 12px;
  position: fixed;
  bottom: 16px;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(30px);
  display: grid;
  place-items: center;
  z-index: 9999999999999999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;

  &:hover {
    .minimizeIcon {
      opacity: 1;
    }
  }
`;

const PlayerControlWheel = styled(motion.div)`
  width: 90%;
  height: 90%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
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

const ChannelSwitcherButton = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  grid-area: 3/2;
  cursor: pointer;
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
  opacity: ${props => (props.isMinimized ? 1 : 0)};
  transition: all 300ms ease-in-out;
`;

function Player() {
  const [minimize, setMinimize] = useState(false);
  const [activeChannel, setActiveChannel] = useState('Spotify');

  const handleTogglePlay = () => {
    console.log('toggle playPause click');

    chrome.extension.sendRequest({ message: 'togglePlayPause', channel: activeChannel });
  };

  const handleNextTrack = () => {
    chrome.extension.sendRequest({ message: 'playNextTrack', channel: activeChannel });
  };

  const handlePreviousTrack = () => {
    chrome.extension.sendRequest({ message: 'playPreviousTrack', channel: activeChannel });
  };

  const handleShuffle = () => {
    chrome.extension.sendRequest({ message: 'shuffleTracks', channel: activeChannel });
  };

  const handleMinimize = () => {
    setMinimize(!minimize);
  };

  const constraintsRef = useRef(null);

  return (
    <Fragment>
      <Wrapper ref={constraintsRef} />
      <PlayerView
        animate={{ width: minimize ? 32 : 160, height: minimize ? 32 : 160 }}
        className="playerView"
        drag
        dragElastic={0.2}
        dragConstraints={constraintsRef}
      >
        <MimimizeView
          className={'minimizeIcon'}
          isMinimized={minimize}
          animate={
            minimize
              ? { backgroundColor: 'rgba(0,0,0,0.0)' }
              : { backgroundColor: 'rgba(0,0,0,0.4)' }
          }
          transition={{ duration: 0 }}
          onClick={() => handleMinimize()}
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
          <MenuButton onClick={() => handleShuffle()} whileTap={{ scale: 0.92, opacity: 1 }}>
            <ShuffleTrackIcon />
          </MenuButton>
          <ChannelSwitcherButton whileTap={{ scale: 0.92, opacity: 1 }}>
            <SpotifyIcon />
          </ChannelSwitcherButton>
        </PlayerControlWheel>
      </PlayerView>
    </Fragment>
  );
}

export default Player;
