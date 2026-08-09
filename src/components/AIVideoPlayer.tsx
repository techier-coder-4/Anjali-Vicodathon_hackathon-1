import React from 'react';
import { Challenge } from '../types';
import { CinematicPlayer } from './CinematicPlayer';

interface AIVideoPlayerProps {
  challenge: Challenge;
  onStartChallenge?: () => void;
  autoPlay?: boolean;
}

export const AIVideoPlayer: React.FC<AIVideoPlayerProps> = ({ challenge, onStartChallenge, autoPlay }) => {
  return (
    <CinematicPlayer
      challenge={challenge}
      onStartChallenge={onStartChallenge}
      autoPlay={autoPlay}
    />
  );
};

export default AIVideoPlayer;
