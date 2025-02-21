import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { PlayerData } from '../models/Player';
import { Bet } from '../models/Bet';
import { GamePhase } from '../models/GameState';
import { Die } from './Die';
import {
  PlayersGrid,
  PlayerCard,
  DiceContainer,
  Tag
} from './styled/game';

interface PlayerGridProps {
  players: PlayerData[];
  activePlayerIndex: number;
  gamePhase: GamePhase;
  currentBet: Bet | null;
}

export const PlayerGrid: React.FC<PlayerGridProps> = ({
  players,
  activePlayerIndex,
  gamePhase,
  currentBet
}) => {
  const shouldRevealDice = gamePhase === GamePhase.ROUND_END ||
                          gamePhase === GamePhase.ROUND_CLOSED ||
                          gamePhase === GamePhase.GAME_OVER;

  return (
    <PlayersGrid>
      <AnimatePresence>
        {players.map((player, index) => (
          <PlayerCard
            key={player.id}
            isActive={index === activePlayerIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <h2 style={{ display: 'flex', alignItems: 'center' }}>
              {player.name}
              {player.isAI && player.aiType && (
                <Tag style={{ marginLeft: '0.5em' }}>
                  {player.aiType}
                </Tag>
              )}
            </h2>
            <DiceContainer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {player.dice.map((die, dieIndex) => (
                <Die
                  key={dieIndex}
                  faceValue={die}
                  hiddenValue="?"
                  isHidden={!shouldRevealDice && player.isAI}
                  isMatching={shouldRevealDice && currentBet ? die === currentBet.faceValue || die === 1 : false}
                />
              ))}
            </DiceContainer>
          </PlayerCard>
        ))}
      </AnimatePresence>
    </PlayersGrid>
  );
}; 