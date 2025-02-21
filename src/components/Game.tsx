import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setPlayers, placeBet, challenge, rollDice, setInitializing, closeRound, startNewRound, resolveChallenge, setGameOver } from '../store/GameSlice';
import { Player, PlayerData } from '../models/Player';
import { Bet } from '../models/Bet';
import { GamePhase } from '../models/GameState';
import { BettingPopup } from './BettingPopup';
import { BettingStrategy, StartingStrategy } from '../strategies/strategies';
import { generateId } from '../utils/id';
import { GameConfiguration } from './GameConfiguration';
import { PlayerGrid } from './PlayerGrid';
import { BetHistory } from './BetHistory';
import { ResetButton, GameContainer, Title, VersionNumber, ActionButtons, Button } from './styled/game';
import { Die } from './Die';

export const Game: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
  const [showBettingPopup, setShowBettingPopup] = useState(false);
  const [playerName, setPlayerName] = useState('Player');
  const [numAIPlayers, setNumAIPlayers] = useState(2);
  const [numStartingDice, setNumStartingDice] = useState(3);

  const handleAITurn = useCallback(async () => {
    if (gameState.gamePhase !== GamePhase.BETTING) return;
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    if (!activePlayer?.isAI) return;

    // Add a small delay to make AI moves feel more natural
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 1000));

    const totalDiceInGame = gameState.players.reduce((sum, p) => sum + p.dice.length, 0);
    const decision = await Player.handleAITurn(activePlayer, gameState.currentBet, totalDiceInGame);

    if (decision === 'challenge') {
      dispatch(challenge());
    } else {
      dispatch(placeBet(decision));
    }
  }, [gameState.gamePhase, gameState.players, gameState.activePlayerIndex, gameState.currentBet, dispatch]);

  useEffect(() => {
    handleAITurn();
  }, [gameState.activePlayerIndex, gameState.gamePhase, handleAITurn]);

  useEffect(() => {
    if (gameState.gamePhase === GamePhase.ROLLING) {
      dispatch(rollDice());
    }
  }, [gameState.gamePhase, dispatch]);

  useEffect(() => {
    if (gameState.gamePhase === GamePhase.CHALLENGE_RESOLUTION) {
      setTimeout(() => {
        dispatch(resolveChallenge());
      }, 1500);
    }
  }, [gameState.gamePhase, dispatch]);

  useEffect(() => {
    if (gameState.gamePhase === GamePhase.ROUND_CLOSED) {
      if (gameState.players.filter(p => p.dice.length > 0).length <= 1) {
        dispatch(setGameOver());
      } else {
        dispatch(startNewRound());
      }
    }
  }, [gameState.gamePhase, dispatch, gameState.players]);

  const handleHumanDecision = (decision: Bet | 'challenge') => {
    Player.makeHumanDecision(decision);
    setShowBettingPopup(false);
    
    if (decision === 'challenge') {
      dispatch(challenge());
    } else {
      dispatch(placeBet(decision));
    }
  };

  const startGame = () => {
    const players: PlayerData[] = [
      {
        id: generateId(),
        name: playerName,
        isAI: false,
        aiType: 'human',
        dice: Player.rollDice(numStartingDice),
      },
      ...Array(numAIPlayers).fill(null).map((_, i) => ({
        id: generateId(),
        name: `AI ${i + 1}`,
        isAI: true,
        aiType: 'A1',
        dice: Player.rollDice(numStartingDice),
        bettingStrategy: BettingStrategy.A1,
        startingStrategy: StartingStrategy.Simple,
      })),
    ].sort(() => Math.random() - 0.5);

    dispatch(setPlayers(players));
    dispatch(rollDice());
  };

  const resetGame = () => {
    dispatch(setInitializing());
  };

  return (
    <GameContainer>
      {gameState.gamePhase === GamePhase.INITIALIZING ? (
        <GameConfiguration
          currentTheme={currentTheme}
          playerName={playerName}
          numAIPlayers={numAIPlayers}
          numStartingDice={numStartingDice}
          onPlayerNameChange={setPlayerName}
          onAIPlayersChange={setNumAIPlayers}
          onStartingDiceChange={setNumStartingDice}
          onStartGame={startGame}
        />
      ) : (
        <>
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Liar's Dice
          </Title>
          <ResetButton onClick={resetGame}>Reset Game</ResetButton>
          <PlayerGrid
            players={gameState.players}
            activePlayerIndex={gameState.activePlayerIndex}
            gamePhase={gameState.gamePhase}
            currentBet={gameState.currentBet}
          />
          <BetHistory
            betHistory={gameState.betHistory}
            lastLoser={gameState.lastLoser}
            players={gameState.players}
          />
          {gameState.gamePhase === GamePhase.BETTING && 
           gameState.players[gameState.activePlayerIndex] && 
           !gameState.players[gameState.activePlayerIndex].isAI && (
            <ActionButtons>
              {gameState.currentBet && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', margin: '0 10px', fontWeight: 'bold' }}>
                    Current bet: <Die faceValue={gameState.currentBet.quantity}/> X <Die faceValue={gameState.currentBet.faceValue}/>
                  </div>
                  <Button onClick={() => handleHumanDecision('challenge')}>Challenge</Button>
                </>
              )}
              <Button onClick={() => setShowBettingPopup(true)}>Place Bet</Button>
            </ActionButtons>
          )}
          {gameState.gamePhase === GamePhase.ROUND_END && (
            <ActionButtons>
              <Button onClick={() => dispatch(closeRound())}>Next Round</Button>
            </ActionButtons>
          )}
          {gameState.gamePhase === GamePhase.GAME_OVER && (
            <h3 style={{ textAlign: 'center' }}>The winner is: {gameState.players.find(p => p.dice.length > 0)?.name}!</h3>
          )}
          {showBettingPopup && (
            <BettingPopup
              currentBet={gameState.currentBet}
              onDecision={handleHumanDecision}
              onClose={() => setShowBettingPopup(false)}
            />
          )}
          <VersionNumber>v{process.env.REACT_APP_VERSION}</VersionNumber>
        </>
      )}
    </GameContainer>
  );
};
