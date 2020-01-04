import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import {
  SmallSpotifyIcon,
  DropdownIcon,
  TogglePlayIcon,
  PlayIcon,
  NextTrackIcon,
  PreviousTrackIcon,
  ShuffleTrackIcon,
  MoreIcon,
  PauseIcon,
  YouTubeIcon,
  AppleIcon,
  AmazonIcon,
  SoundCloudIcon,
} from './Icons';
import { Fragment } from 'preact';

const Wrapper = styled.div`
  position: fixed;
  top: 68px;
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
  grid-template-columns: 48px 1px 32px 32px 32px 1px 32px;
  grid-column-gap: 12px;
  height: 56px;
  padding: 12px;
  background: linear-gradient(
      95.87deg,
      #080811 0.29%,
      #0b2020 20.46%,
      #0f0e36 49.95%,
      #330b23 99.61%
    ),
    #080811;
  border-radius: 12px;
  z-index: 999999999999999;
`;

const Seperator = styled.div`
  width: 1px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.1);
`;

const ActionItem = styled(motion.div)`
  width: 100%;
  height: 32px;
  display: grid;
  place-items: center;
  cursor: pointer;
  background-color: ${props =>
    props.type === 'serviceSwitcher' || props.active
      ? 'rgba(55, 225, 163, 0.1)'
      : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  svg path {
    fill: ${props => (props.active ? '#37E1A3' : '#fff')};
  }
`;

const SelectedServiceWrapper = styled.div`
  display: grid;
  grid-template-columns: 20px 5px;
  grid-gap: 4px;
  align-items: center;
`;

const ServiceSelector = styled(motion.div)`
  background: rgba(0, 0, 0, 0.4);
  height: 56px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(5, 40px);
  grid-gap: 12px;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

function Player() {
  //States
  const [activeService, setActiveService] = useState('Spotify');
  const [isShuffleActive, setShuffleActive] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [isServiceSelectionOpen, setIsServiceSelectionOpen] = useState(false);

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
        return <SmallSpotifyIcon />;
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

  //Effects

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function(request, sender) {
      if (request.origin === 'iShuffle') {
        console.log('received request in player', request, ' from sender ', sender);
        switch (request.type) {
          case 'shuffleState':
            setShuffleActive(request.message === 'active' ? true : false);
            break;
          case 'playButtonState':
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
      setActiveService(result.activeService);
    });
  }, []);

  return (
    <Fragment>
      <Wrapper isServiceSelectionOpen={isServiceSelectionOpen} ref={constraintsRef} />
      <PlayerView
        drag
        dragConstraints={constraintsRef}
        animate={{ height: isServiceSelectionOpen ? 112 : 56 }}
      >
        <ActionItem type="serviceSwitcher" onClick={() => openServiceSelectionMenu()}>
          <SelectedServiceWrapper>
            {renderIconForService(activeService)}
            <DropdownIcon />
          </SelectedServiceWrapper>
        </ActionItem>
        <Seperator />
        <ActionItem
          onClick={() => handleAction(activeService, 'playPreviousTrack')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.94 }}
        >
          <PreviousTrackIcon />
        </ActionItem>
        <ActionItem
          onClick={() => handleAction(activeService, 'togglePlayPause')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.94 }}
        >
          <TogglePlayIcon />
        </ActionItem>
        <ActionItem
          onClick={() => handleAction(activeService, 'playNextTrack')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.94 }}
        >
          <NextTrackIcon />
        </ActionItem>
        <Seperator />
        <ActionItem
          onClick={() => handleAction(activeService, 'shuffleTracks')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.94 }}
          active={isShuffleActive}
        >
          <ShuffleTrackIcon />
        </ActionItem>
        <AnimatePresence>
          {isServiceSelectionOpen && (
            <ServiceSelector
              initial={{ height: 0, visibility: 'hidden', opacity: 0 }}
              animate={{ height: 56, visibility: 'visible', opacity: 1 }}
              exit={{ height: 0, visibility: 'hidden', opacity: 0 }}
            >
              <ActionItem
                onClick={() => handleServiceSelection('Spotify')}
                whileHover={{ backgroundColor: '#1FBA5D' }}
                whileTap={{ scale: 0.92 }}
              >
                <SmallSpotifyIcon />
              </ActionItem>
              <ActionItem
                onClick={() => handleServiceSelection('Apple')}
                whileHover={{ backgroundColor: 'rgba(0, 122, 255, 1)' }}
                whileTap={{ scale: 0.92 }}
              >
                <AppleIcon />
              </ActionItem>
              <ActionItem
                onClick={() => handleServiceSelection('YouTube')}
                whileHover={{ backgroundColor: 'rgba(254, 53, 89, 1)' }}
                whileTap={{ scale: 0.92 }}
              >
                <YouTubeIcon />
              </ActionItem>
              <ActionItem
                onClick={() => handleServiceSelection('Amazon')}
                whileHover={{ backgroundColor: '#19A0B2' }}
                whileTap={{ scale: 0.92 }}
              >
                <AmazonIcon />
              </ActionItem>
              <ActionItem
                onClick={() => handleServiceSelection('SoundCloud')}
                whileHover={{ backgroundColor: 'rgba(254, 121, 25, 1)' }}
                whileTap={{ scale: 0.92 }}
              >
                <SoundCloudIcon />
              </ActionItem>
            </ServiceSelector>
          )}
        </AnimatePresence>
      </PlayerView>
    </Fragment>
  );
}

export default React.memo(Player);
