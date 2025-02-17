import React from 'react';
import { useDispatch } from 'react-redux';
import { ThemeType, setTheme } from '../store/ThemeSlice';
import {
  ConfigurationContainer,
  ConfigurationOption,
  ThemeSelect,
  Button
} from './styled/game';

interface GameConfigurationProps {
  currentTheme: ThemeType;
  playerName: string;
  numAIPlayers: number;
  numStartingDice: number;
  onPlayerNameChange: (name: string) => void;
  onAIPlayersChange: (num: number) => void;
  onStartingDiceChange: (num: number) => void;
  onStartGame: () => void;
}

export const GameConfiguration: React.FC<GameConfigurationProps> = ({
  currentTheme,
  playerName,
  numAIPlayers,
  numStartingDice,
  onPlayerNameChange,
  onAIPlayersChange,
  onStartingDiceChange,
  onStartGame
}) => {
  const dispatch = useDispatch();

  return (
    <ConfigurationContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <ConfigurationOption>
        <label>Theme</label>
        <ThemeSelect
          value={currentTheme}
          onChange={e => dispatch(setTheme(e.target.value as ThemeType))}
        >
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="default">Default</option>
        </ThemeSelect>
      </ConfigurationOption>

      <ConfigurationOption>
        <label>Your Name</label>
        <input
          type="text"
          value={playerName}
          onChange={e => onPlayerNameChange(e.target.value)}
        />
      </ConfigurationOption>

      <ConfigurationOption>
        <label>Number of AI Players</label>
        <input
          type="number"
          min={1}
          max={4}
          value={numAIPlayers}
          onChange={e => onAIPlayersChange(parseInt(e.target.value))}
        />
      </ConfigurationOption>

      <ConfigurationOption>
        <label>Starting Dice per Player</label>
        <input
          type="number"
          min={1}
          max={5}
          value={numStartingDice}
          onChange={e => onStartingDiceChange(parseInt(e.target.value))}
        />
      </ConfigurationOption>

      <Button
        onClick={onStartGame}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Game
      </Button>
    </ConfigurationContainer>
  );
}; 