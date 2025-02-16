import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setPlayers, placeBet, challenge, resolveChallenge, startNewRound, rollDice, setGameOver, closeRound, setInitializing } from '../store/GameSlice';
import { Player, PlayerData } from '../models/Player';
import { Bet, betToString } from '../models/Bet';
import { GamePhase } from '../models/GameState';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BettingPopup } from './BettingPopup';
import { BettingStrategy, StartingStrategy } from '../strategies/strategies';
import { generateId } from '../utils/id';
import { Theme } from '../themes/theme';
import { setTheme, ThemeType } from '../store/ThemeSlice';

const ResetButton = styled(motion.button)`
  position: absolute;
  top: ${props => props.theme.spacing.medium};
  right: ${props => props.theme.spacing.medium};
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-2px);
  }
`;

const GameContainer = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xlarge};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.xlarge};
  box-shadow: ${props => props.theme.shadows.main};
`;

const Title = styled(motion.h1)`
  text-align: center;
  color: ${props => props.theme.colors.primary};
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const PlayersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const PlayerCard = styled(motion.div)<{ isActive: boolean }>`
  background: ${props => props.isActive ? props.theme.colors.secondary : props.theme.colors.secondaryDark};
  padding: ${props => props.theme.spacing.large};
  border-radius: ${props => props.theme.borderRadius.large};
  border: 2px solid ${props => props.isActive ? props.theme.colors.primary : 'transparent'};
  transition: all 0.3s ease;

  h2 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: ${props => props.theme.spacing.medium};
  }
`;

const DiceSquare = styled.span<{ isMatching?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin: 0 4px;
  background: ${props => props.isMatching ? props.theme.colors.primary : props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const DiceContainer = styled(motion.div)`
  display: flex;
  gap: 4px;
  margin-top: 8px;
`;

const Controls = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled(motion.button)`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-2px);
  }
`;

const BetHistory = styled(motion.div)`
  margin-top: 1.5rem;
  padding: 1rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.medium};
  max-height: 200px;
  overflow-y: auto;

  h3 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }
`;

const BetHistoryItem = styled(motion.li)`
  padding: 0.5rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ConfigurationContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  margin: 2rem 0;
`;

const ConfigurationOption = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;

  label {
    font-size: 1.2rem;
    color: ${props => props.theme.colors.primary};
  }

  select, input {
    padding: 0.5rem;
    border-radius: ${props => props.theme.borderRadius.small};
    background: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.text};
    border: 1px solid ${props => props.theme.colors.primary};
    width: 200px;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primaryHover};
    }
  }
`;

const VersionNumber = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textMuted};
`;

const ThemeSelect = styled(motion.select)`
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.primary};
  width: 200px;
  cursor: pointer;
`;

const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled(motion.div)`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.large};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.main};
  width: 90%;
  max-width: 400px;

  h2 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: ${props => props.theme.spacing.medium};
  }

  input, select {
    width: 100%;
    padding: ${props => props.theme.spacing.small};
    margin-bottom: ${props => props.theme.spacing.medium};
    border-radius: ${props => props.theme.borderRadius.small};
    background: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.text};
    border: 1px solid ${props => props.theme.colors.border};

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }

  .buttons {
    display: flex;
    gap: ${props => props.theme.spacing.medium};
    justify-content: flex-end;
  }
`;

export const Game: React.FC = () => {
  const dispatch = useDispatch();
  const {
    players,
    currentBet,
    activePlayerIndex,
    gamePhase,
    roundNumber,
    betHistory,
    lastLoser,
  } = useSelector((state: RootState) => state.game);
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

  const [showBettingPopup, setShowBettingPopup] = useState(false);
  const [numAIPlayers, setNumAIPlayers] = useState(2);
  const [numStartingDice, setNumStartingDice] = useState(3);
  const [playerName, setPlayerName] = useState('Player');

  useEffect(() => {
    if (gamePhase === GamePhase.INITIALIZING) {
      return;
    }

    if (gamePhase === GamePhase.ROLLING) {
      dispatch(rollDice());
    }
    if (gamePhase === GamePhase.BETTING && players[activePlayerIndex]?.isAI) {
      handleAITurn();
    }
    if (gamePhase === GamePhase.CHALLENGE_RESOLUTION) {
      setTimeout(() => {
        dispatch(resolveChallenge());
      }, 1000);
    }
    if (gamePhase === GamePhase.ROUND_CLOSED) {
      const playersWithDice = players.filter(p => p.dice.length > 0).length;
      if (playersWithDice <= 1) {
        dispatch(setGameOver());
      } else {
        dispatch(startNewRound());
      }
    }
  }, [gamePhase, activePlayerIndex, players]);

  const handleStartGame = () => {
    const players: PlayerData[] = [
      ...Array(numAIPlayers).fill(null).map((_, index) => ({
        id: generateId(),
        name: `AI ${index + 1}`,
        isAI: true,
        dice: new Array(numStartingDice).fill(null),
        bettingStrategy: BettingStrategy.Simple,
        startingStrategy: StartingStrategy.Simple,
        bettingStrategyParams: {
          mathVsOwnDice: 0.7,
          challengeThreshold: 0.5,
        },
        startingStrategyParams: {},
      })),
      {
        id: generateId(),
        name: playerName || 'Player',
        isAI: false,
        dice: new Array(numStartingDice).fill(null),
        bettingStrategy: BettingStrategy.Simple,
        startingStrategy: StartingStrategy.Simple,
      },
    ];

    dispatch(setPlayers(players));
    dispatch(rollDice());
  };

  const handleHumanDecision = (bet: Bet | 'challenge') => {
    //Player.makeHumanDecision(bet);
    if (bet === 'challenge') {
      console.log('challenge');
      dispatch(challenge());
    } else {
      console.log('placeBet', bet);
      dispatch(placeBet(bet));
    }
  };

  const handleAITurn = async () => {
    const totalDice = players.reduce((sum, p) => sum + p.dice.length, 0);

    // Add a random delay between 500ms and 1500ms to simulate "thinking"
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const decision = await Player.handleAITurn(players[activePlayerIndex], currentBet, totalDice);

    if (decision === 'challenge') {
      console.log('challenge');
      dispatch(challenge());
    } else {
      console.log('placeBet', decision);
      dispatch(placeBet(decision));
    }
  };

  const handleBetSubmit = (quantity: number, faceValue: number) => {
    handleHumanDecision({ quantity, faceValue });
    setShowBettingPopup(false);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the game?')) {
      dispatch(setInitializing());
    }
  };

  return (
    <GameContainer>
      {gamePhase !== GamePhase.INITIALIZING && (
        <ResetButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
        >
          Reset Game
        </ResetButton>
      )}
      <Title
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Liar's Dice - Round {roundNumber}
      </Title>

      {gamePhase === GamePhase.INITIALIZING && (
        <ConfigurationContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ConfigurationOption>
            <label>Theme</label>
            <ThemeSelect
              value={currentTheme}
              onChange={(e) => dispatch(setTheme(e.target.value as ThemeType))}
            >
              <option value="blue">Blue Theme</option>
              <option value="green">Green Theme</option>
              <option value="default">Default Theme</option>
            </ThemeSelect>
          </ConfigurationOption>

          <ConfigurationOption>
            <label>Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
            />
          </ConfigurationOption>

          <ConfigurationOption>
            <label>Number of AI Players</label>
            <select
              value={numAIPlayers}
              onChange={(e) => setNumAIPlayers(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </ConfigurationOption>

          <ConfigurationOption>
            <label>Starting Dice per Player</label>
            <select
              value={numStartingDice}
              onChange={(e) => setNumStartingDice(Number(e.target.value))}
            >
              {[2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </ConfigurationOption>

          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartGame}
          >
            Start Game
          </Button>
        </ConfigurationContainer>
      )}

        {gamePhase !== GamePhase.INITIALIZING && (
          <>
            <PlayersGrid>
              <AnimatePresence>
                {players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    isActive={player.id === players[activePlayerIndex].id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h2>{player.name} {player.id === players[activePlayerIndex].id ? '(Active)' : ''}</h2>
                    <DiceContainer
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {player.dice.map((die, index) => (
                        <DiceSquare
                          key={index}
                          isMatching={
                            !!(gamePhase === GamePhase.ROUND_END) &&
                            !!currentBet &&
                            (die === currentBet.faceValue || die === 1)
                          }
                        >
                          {player.isAI && gamePhase !== GamePhase.ROUND_END ? "?" : die}
                        </DiceSquare>
                      ))}
                    </DiceContainer>
                  </PlayerCard>
                ))}
              </AnimatePresence>
            </PlayersGrid>

            <BetHistory
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Bet History</h3>
              <ul>
                {lastLoser !== undefined &&
                  <BetHistoryItem
                    key={'loser'}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {players[lastLoser].name}: Will lose a die
                  </BetHistoryItem>}
                {[...betHistory].reverse().map((bet, index) => (
                  <BetHistoryItem
                    key={betHistory.length - 1 - index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {bet.type === 'bet'
                      ? `${bet.player.name}: ${betToString(bet.bet!)}`
                      : `${bet.player.name}: Challenge!`}
                  </BetHistoryItem>
                ))}
              </ul>
            </BetHistory>

            {gamePhase === GamePhase.BETTING && players[activePlayerIndex].isAI === false && (
              <Controls
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentBet &&
                  <h3>Current Bet:
                    <DiceSquare isMatching={false}>{currentBet.quantity}</DiceSquare>
                    X
                    <DiceSquare isMatching={false}>{currentBet.faceValue}</DiceSquare>
                  </h3>
                }
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBettingPopup(true)}
                >
                  Place Bet
                </Button>
                {currentBet && (
                  <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleHumanDecision('challenge')}
                  >
                    Challenge
                  </Button>
                )}
              </Controls>
            )}

            {gamePhase === GamePhase.GAME_OVER && (
              <motion.h2
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                style={{ textAlign: 'center', color: '#e94560', fontSize: '2rem' }}
              >
                Game Over! Winner: {players.find(p => p.dice.length > 0)?.name}
              </motion.h2>
            )}

            {gamePhase === GamePhase.ROUND_END && (
              <Controls>
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    dispatch(closeRound());
                  }}
                >
                  Continue
                </Button>
              </Controls>
            )}

            <AnimatePresence>
              {showBettingPopup && (
                <BettingPopup
                  currentBet={currentBet}
                  onSubmit={handleBetSubmit}
                  onClose={() => setShowBettingPopup(false)}
                />
              )}
            </AnimatePresence>
          </>
        )}
      
      <VersionNumber>v{process.env.REACT_APP_VERSION || '0.0.0'}</VersionNumber>
    </GameContainer>
  );
};
