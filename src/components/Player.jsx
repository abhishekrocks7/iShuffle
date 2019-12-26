import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  TogglePlayIcon,
  NextTrackIcon,
  PreviousTrackIcon,
  ShuffleTrackIcon,
  OpenLinkIcon,
  MinimizeIcon,
  ExpandIcon,
  CloseIcon,
} from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

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

const Settings = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 8px;
  display: grid;
  place-items: center;
  padding: 12px;
`;

const CloseView = styled(motion.div)`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 12px;
  top: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: grid;
  cursor: pointer;
  place-items: center;
`;

const Setting = styled.div`
  width: 100%;
`;

const Label = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
`;

const Toggle = styled.div`
  width: 32px;
  height: 20px;
  border-radius: 20px;
  transition: all 200ms ease-in-out;
  background-color: ${props => (props.active ? '#fff' : 'rgba(255, 255, 255, 0.16)')};
  position: relative;
  cursor: pointer;
`;

const Knob = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => (props.active ? '#000' : '#fff')};
  position: absolute;
  transition: all 200ms ease-in-out;
  left: ${props => (props.active ? '14px' : '2px')};
  top: 50%;
  transform: translateY(-50%);
`;

const Seperator = styled.div`
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
`;

const Attribute = styled.a`
  color: #fff;
  text-decoration: none;
`;

function Player() {
  const [minimize, setMinimize] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [canMinimize, setCanMinimize] = useState(false);

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

  const handleMinimize = () => {
    setMinimize(!minimize);
  };

  const handleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleMinimizeToggle = () => {
    if (canMinimize) {
      localStorage.setItem('canMinimize', 'no');
      setCanMinimize(false);
    } else {
      localStorage.setItem('canMinimize', 'yes');
      setCanMinimize(true);
    }
  };

  const handleShuffle = () => {
    chrome.runtime.sendMessage({ message: 'shuffleTracks' });
  };

  useEffect(() => {
    let value = localStorage.getItem('canMinimize');
    if (value === 'yes') {
      setCanMinimize(true);
    } else {
      setCanMinimize(false);
    }
  }, []);

  return (
    <PlayerView
      animate={{ width: minimize ? 32 : 160, height: minimize ? 32 : 160 }}
      drag="x"
      dragConstraints={{ left: 16, right: document.body.clientWidth - 176 }}
    >
      <AnimatePresence>
        {showMenu && (
          <Settings
            key={'menu'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <CloseView
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.96, color: 'rgba(255, 255, 255, 0.32)' }}
              onClick={() => handleMenu()}
            >
              <CloseIcon />
            </CloseView>

            <Setting>
              <Label>Can Minimize</Label>
              <Toggle active={canMinimize} onClick={() => handleMinimizeToggle()}>
                <Knob active={canMinimize} />
              </Toggle>
            </Setting>
            <Seperator />
            <Setting>
              <Label>Designed By</Label>
              <Attribute href="https://www.twitter.com/_abhiii" target="_blank">
                Abhi
              </Attribute>
            </Setting>
          </Settings>
        )}
      </AnimatePresence>
      {canMinimize && (
        <MimimizeView
          isMinimized={minimize}
          animate={
            minimize
              ? { backgroundColor: 'rgba(0,0,0,0.0)' }
              : { backgroundColor: 'rgba(0,0,0,0.4)' }
          }
          onClick={() => handleMinimize()}
        >
          {minimize ? <ExpandIcon /> : <MinimizeIcon />}
        </MimimizeView>
      )}
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
        <OpenLinkButton onClick={() => handleOpenLink()} whileTap={{ scale: 0.92, opacity: 1 }}>
          <OpenLinkIcon />
        </OpenLinkButton>
      </PlayerControlWheel>
    </PlayerView>
  );
}

export default Player;
