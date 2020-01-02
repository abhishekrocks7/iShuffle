import React, { useState, Fragment, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  TogglePlayIcon,
  NextTrackIcon,
  PreviousTrackIcon,
  ShuffleTrackIcon,
  DropdownIcon,
  MinimizeIcon,
  ExpandIcon,
  SpotifyIcon,
  CloseIcon,
  AmazonIcon,
  YouTubeIcon,
  AppleIcon,
  SoundCloudIcon,
} from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

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

  * {
    box-sizing: border-box;
  }

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

const ShuffleButton = styled(motion.div)`
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
  opacity: ${props => (props.isDisabled ? 0.3 : 0.7)};
  text-transform: uppercase;
  cursor: ${props => (props.isDisabled ? 'auto' : 'pointer')};
  pointer-events: ${props => props.isDisabled && 'none'};
  svg path {
    fill: ${props => (props.shuffleState ? '#15c182' : '#fff')};
  }
`;

const ChannelSwitcherButton = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  justify-content: center;
  grid-template-columns: 14px 6px;
  grid-gap: 4px;
  grid-area: 3/2;
  cursor: pointer;
  svg:first-child {
    transform: scale(0.4);
  }
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

const ChannelSwitcherView = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  z-index: 2;
  border-radius: 8px;
`;

const Header = styled.div`
  width: 100%;
  height: 40px;
  padding-left: 16px;
  padding-right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: #fff;
  font-weight: 300;
`;

const CloseView = styled(motion.div)`
  width: 20px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  display: grid;
  place-items: center;
  cursor: pointer;
  border-radius: 50%;
  svg {
    opacity: 0.6;
  }
`;

const List = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  place-items: center;
  width: 100%;
  height: calc(100% - 40px);
`;

const Channel = styled(motion.div)`
  padding: 0 16px;
  cursor: pointer;
  opacity: 0.7;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const ChannelIcon = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
`;

function Player() {
  const [minimize, setMinimize] = useState(false);
  const [activeChannel, setActiveChannel] = useState('');
  const [isChannelSwitcherOpen, setChannelSwitcherOpen] = useState(false);
  const [channels] = useState(['Apple', 'Spotify', 'Amazon', 'Youtube', 'SoundCloud']);
  const [isShuffleActive, setShuffleActive] = useState(false);
  const [shuffleChannel, setShuffleChannel] = useState('');

  const handleTogglePlay = () => {
    chrome.runtime.sendMessage({
      type: 'controllerState',
      message: 'togglePlayPause',
      channel: activeChannel,
    });
  };

  const handleNextTrack = () => {
    chrome.runtime.sendMessage({
      type: 'controllerState',
      message: 'playNextTrack',
      channel: activeChannel,
    });
  };

  const handlePreviousTrack = () => {
    chrome.runtime.sendMessage({
      type: 'controllerState',
      message: 'playPreviousTrack',
      channel: activeChannel,
    });
  };

  const handleShuffle = () => {
    chrome.runtime.sendMessage({
      type: 'controllerState',
      message: 'shuffleTracks',
      channel: activeChannel,
    });
  };

  const renderIconForService = channel => {
    switch (channel) {
      case 'Amazon':
        return <AmazonIcon />;
      case 'Apple':
        return <AppleIcon />;
      case 'Youtube':
        return <YouTubeIcon />;
      case 'SoundCloud':
        return <SoundCloudIcon />;
      case 'Spotify':
        return <SpotifyIcon />;
      default:
        return <SpotifyIcon />;
    }
  };

  const handleChannelSwitcher = () => {
    setChannelSwitcherOpen(true);
  };

  const handleMinimize = state => {
    console.log('minimizze@@@ state is ', state);
    chrome.storage.sync.set({ isMinimize: state }, function() {
      setMinimize(state);
    });
  };

  const handleSelectedChannel = channel => {
    chrome.storage.sync.set({ activeChannel: channel }, function() {
      setActiveChannel(channel);
      setChannelSwitcherOpen(false);
    });
  };

  const closeChannelSwitcher = () => {
    setChannelSwitcherOpen(false);
  };

  const constraintsRef = useRef(null);

  useEffect(() => {
    chrome.storage.sync.get(['activeChannel'], result => {
      setActiveChannel(result.activeChannel);
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.get(['isMinimize'], result => {
      setMinimize(result.isMinimize);
    });
  }, []);

  chrome.runtime.onMessage.addListener(function(request, sender) {
    switch (request.type) {
      case 'shuffleState':
        setShuffleChannel(request.channel);
        setShuffleActive(request.message === 'active' ? true : false);
        break;
      default:
        console.log('received some other message');
        break;
    }
  });

  return (
    <Fragment>
      <Wrapper ref={constraintsRef} />

      <PlayerView
        animate={{
          visibility: 'visible',
          width: minimize ? 32 : 160,
          height: minimize ? 32 : isChannelSwitcherOpen ? 240 : 160,
        }}
        className="playerView"
        drag
        dragConstraints={constraintsRef}
      >
        <AnimatePresence>
          {isChannelSwitcherOpen && (
            <ChannelSwitcherView
              key="channelSwitcher"
              initial={{ scale: 0, display: 'none' }}
              animate={{ scale: 1, display: 'block' }}
              exit={{ opacity: 0, display: 'none' }}
            >
              <Header>
                <Title>Choose Service</Title>
                <CloseView
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ opacity: 1, scale: 0.96 }}
                  onClick={() => closeChannelSwitcher()}
                >
                  <CloseIcon />
                </CloseView>
              </Header>
              <List>
                {channels &&
                  channels.map(channel => (
                    <Channel
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ opacity: 1 }}
                      onClick={() => handleSelectedChannel(channel)}
                      key={channel}
                    >
                      <ChannelIcon>{renderIconForService(channel)}</ChannelIcon>
                    </Channel>
                  ))}
              </List>
            </ChannelSwitcherView>
          )}
        </AnimatePresence>
        <MimimizeView
          className={'minimizeIcon'}
          isMinimized={minimize}
          animate={
            minimize
              ? { backgroundColor: 'rgba(0,0,0,0.0)' }
              : { backgroundColor: 'rgba(0,0,0,0.4)' }
          }
          transition={{ duration: 0 }}
          onClick={() => handleMinimize(!minimize)}
        >
          {minimize ? <ExpandIcon /> : <MinimizeIcon />}
        </MimimizeView>

        <PlayerControlWheel
          initial={false}
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
          <ShuffleButton
            isDisabled={activeChannel === 'Youtube'}
            shuffleState={activeChannel === shuffleChannel && isShuffleActive}
            onClick={() => handleShuffle()}
            whileTap={{ scale: 0.92, opacity: 1 }}
          >
            <ShuffleTrackIcon />
          </ShuffleButton>
          <ChannelSwitcherButton
            onClick={() => handleChannelSwitcher()}
            whileTap={{ scale: 0.92, opacity: 1 }}
          >
            {renderIconForService(activeChannel)}
            <DropdownIcon />
          </ChannelSwitcherButton>
        </PlayerControlWheel>
      </PlayerView>
    </Fragment>
  );
}

export default React.memo(Player);
