import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import {
  SpotifyIcon,
  DropdownIcon,
  TogglePlayIcon,
  NextTrackIcon,
  PreviousTrackIcon,
  ShuffleTrackIcon,
  YouTubeIcon,
  CloseIcon,
  AppleIcon,
  AmazonIcon,
  SoundCloudIcon,
  MinimizeIcon,
  ExpandIcon,
} from './Icons';
import { Fragment } from 'preact';

const Wrapper = styled.div`
  position: fixed;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  background-color: transparent;
  visibility: hidden;
`;

const PlayerView = styled(motion.div)`
  box-sizing: border-box;
  position: fixed;
  bottom: 12px;
  display: grid;
  width: 144px;
  height: 144px;
  background: linear-gradient(
      105.29deg,
      #080811 -17.67%,
      #0b2020 8.19%,
      #0f0e36 45.98%,
      #330b23 109.63%
    ),
    #080811;
  border-radius: 12px;
  z-index: 999999999999999;
  place-items: center;
  &:hover {
    .minimizeIcon {
      opacity: 1;
    }
  }
`;

const WheelView = styled(motion.div)`
  width: 90%;
  height: 90%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.06);
  position: relative;
  display: grid;
  grid-template-rows: 36px auto 36px;
  grid-template-columns: 36px auto 36px;
`;

const ActionItem = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  align-items: center;
  cursor: pointer;
  box-shadow: ${props => props.type === 'playPause' && '0 0 0px 1px rgba(0,0,0,0.6)'};
  background-color: ${props => props.type === 'playPause' && 'rgba(0,0,0,0.6)'};
  border-radius: ${props => props.type === 'playPause' && '50%'};
  svg path {
    fill: ${props => (props.active ? '#37E1A3' : '#fff')};
  }
  grid-area: ${props =>
    props.type === 'playPause'
      ? '2 / 2'
      : props.type === 'next'
      ? '2/3/3/3'
      : props.type === 'previous'
      ? '2/2/2/1'
      : props.type === 'shuffle'
      ? '2/2/1/2'
      : '3/2'};
`;

const SelectedServiceWrapper = styled.div`
  display: grid;
  grid-template-columns: 20px 5px;
  grid-gap: 3px;
  align-items: center;
  svg path {
    fill: #37e1a3;
  }
  svg:last-child {
    transform: ${props => (props.isServiceSelectionOpen ? 'rotate(180deg)' : 'roate(0deg)')};
  }
`;

const ServiceSwitcherView = styled(motion.div)`
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
  overflow: hidden;
`;

const List = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  place-items: center;
  width: 100%;
  height: calc(100% - 24px);
`;

const ServiceWrapper = styled(motion.div)`
  cursor: pointer;
  opacity: 0.7;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
  svg {
    transform: scale(1.4);
  }

  &:hover {
    background-color: ${props =>
      props.service === 'Spotify'
        ? 'rgba(31, 186, 93, 0.1);'
        : props.service === 'Apple'
        ? 'rgba(0, 87, 255, 0.1)'
        : props.service === 'YouTube'
        ? 'rgba(254, 53, 89, 0.1)'
        : props.service === 'Amazon'
        ? 'rgba(25, 160, 178, 0.1)'
        : 'rgba(254, 121, 25, 0.1)'};

    svg path {
      fill: ${props =>
        props.service === 'Spotify'
          ? '#1FBA5D'
          : props.service === 'Apple'
          ? '#0057ff'
          : props.service === 'YouTube'
          ? 'rgba(254, 53, 89, 1)'
          : props.service === 'Amazon'
          ? '#19A0B2'
          : 'rgba(254, 121, 25, 1)'};
    }
  }
`;

const PopupCollapseView = styled.div`
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    svg path {
      fill: #fff;
    }
  }

  svg path {
    fill: rgba(255, 255, 255, 0.4);
    transition: all 300ms ease-in-out;
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

  svg {
    transition: all 200ms ease-in-out;
    transform: ${props => (props.isMinimized ? 'rotate(180deg)' : 'rotate(0deg)')};
  }
  svg path {
    fill: #fff;
  }
`;

function Player() {
  //States
  const [services] = useState(['Spotify', 'Apple', 'YouTube', 'Amazon', 'SoundCloud']);
  const [activeService, setActiveService] = useState('Spotify');
  const [isShuffleActive, setShuffleActive] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [isServiceSelectionOpen, setIsServiceSelectionOpen] = useState(false);
  const [isMinimized, setMinimize] = useState(false);

  //Refs
  const constraintsRef = useRef(null);

  //Functions
  const sendMessage = (service, type, message, origin) => {
    chrome.runtime.sendMessage({
      service,
      type,
      message,
      origin,
    });
  };

  const handleAction = (service, message) => {
    sendMessage(service, 'mediaControl', message, 'iShuffle');
  };

  const openServiceSelectionMenu = () => {
    setIsServiceSelectionOpen(!isServiceSelectionOpen);
  };

  const handleServiceSelection = service => {
    sendMessage(service, 'activeServiceSetup', service, 'iShuffle');
    setActiveService(service);
    setIsServiceSelectionOpen(false);
  };

  const renderIconForService = service => {
    switch (service) {
      case 'Spotify':
        return <SpotifyIcon />;
      case 'Apple':
        return <AppleIcon />;
      case 'YouTube':
        return <YouTubeIcon />;
      case 'Amazon':
        return <AmazonIcon />;
      case 'SoundCloud':
        return <SoundCloudIcon />;
      default:
        break;
    }
  };

  const handleMinimize = () => {
    setMinimize(!isMinimized);
  };

  //Effects

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function(request, sender) {
      if (request.origin === 'iShuffle') {
        switch (request.type) {
          case 'shuffleState':
            setShuffleActive(request.message === 'active' ? true : false);
            break;
          case 'playState':
            setPlaying(request.message === 'active' ? true : false);
            break;
          case 'activeServiceSetup':
            setActiveService(request.service);
            break;
          default:
            break;
        }
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.get(['activeService'], result => {
      setActiveService(result.activeService ? result.activeService : 'Spotify');
    });
  }, []);

  return (
    <Fragment>
      <Wrapper isServiceSelectionOpen={isServiceSelectionOpen} ref={constraintsRef} />
      <PlayerView
        animate={{
          visibility: 'visible',
          width: isMinimized ? 32 : 144,
          height: isMinimized ? 32 : isServiceSelectionOpen ? 264 : 144,
        }}
        drag
        dragConstraints={constraintsRef}
      >
        <MimimizeView
          className={'minimizeIcon'}
          isMinimized={isMinimized}
          animate={
            isMinimized
              ? { backgroundColor: 'rgba(0,0,0,0.0)', width: 32, height: 32, left: 0, bottom: 0 }
              : { backgroundColor: 'rgba(0,0,0,0.4)', width: 24, height: 24, left: 4, bottom: 4 }
          }
          transition={{ duration: 0 }}
          onClick={() => handleMinimize()}
        >
          <DropdownIcon isMinimized={isMinimized} />
        </MimimizeView>
        <WheelView
          animate={isMinimized ? { display: 'none', opacity: 0 } : { display: 'grid', opacity: 1 }}
        >
          <ActionItem type="serviceSwitcher" onClick={() => openServiceSelectionMenu()}>
            <SelectedServiceWrapper isServiceSelectionOpen={isServiceSelectionOpen}>
              {renderIconForService(activeService)}
              <DropdownIcon />
            </SelectedServiceWrapper>
          </ActionItem>

          <ActionItem
            type="previous"
            onClick={() => handleAction(activeService, 'playPreviousTrack')}
            whileTap={{ scale: 0.94 }}
          >
            <PreviousTrackIcon />
          </ActionItem>
          <ActionItem
            type="playPause"
            onClick={() => handleAction(activeService, 'togglePlayPause')}
            whileTap={{ scale: 0.94 }}
          >
            <TogglePlayIcon />
          </ActionItem>
          <ActionItem
            type="next"
            onClick={() => handleAction(activeService, 'playNextTrack')}
            whileTap={{ scale: 0.94 }}
          >
            <NextTrackIcon />
          </ActionItem>

          <ActionItem
            type="shuffle"
            onClick={() => handleAction(activeService, 'shuffleTracks')}
            whileTap={{ scale: 0.94 }}
            active={isShuffleActive}
          >
            <ShuffleTrackIcon />
          </ActionItem>
        </WheelView>
        <AnimatePresence>
          {isServiceSelectionOpen && (
            <ServiceSwitcherView
              key="channelSwitcher"
              initial={{ scale: 0, display: 'none' }}
              animate={{ scale: 1, display: 'block' }}
              exit={{ opacity: 0, display: 'none' }}
            >
              <PopupCollapseView onClick={() => setIsServiceSelectionOpen(false)}>
                <MinimizeIcon />
              </PopupCollapseView>
              <List>
                {services &&
                  services.map(service => (
                    <ServiceWrapper
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ opacity: 1 }}
                      service={service}
                      onClick={() => handleServiceSelection(service)}
                      key={service}
                    >
                      {renderIconForService(service)}
                    </ServiceWrapper>
                  ))}
              </List>
            </ServiceSwitcherView>
          )}
        </AnimatePresence>
      </PlayerView>
    </Fragment>
  );
}

export default React.memo(Player);
