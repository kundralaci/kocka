import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { PlayerData } from '../models/Player';
import { Bet } from '../models/Bet';
import { GamePhase } from '../models/GameState';
import {
  PlayersGrid,
  PlayerCard,
  DiceContainer,
  DiceSquare
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
            <h2>{player.name}</h2>
            <DiceContainer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {player.dice.map((die, dieIndex) => (
                <DiceSquare
                  key={dieIndex}
                  isMatching={shouldRevealDice && currentBet ? die === currentBet.faceValue || die === 1 : false}
                >
                  {shouldRevealDice || !player.isAI ? die : "?"}
                </DiceSquare>
              ))}
            </DiceContainer>
          </PlayerCard>
        ))}
      </AnimatePresence>
    </PlayersGrid>
  );
}; 