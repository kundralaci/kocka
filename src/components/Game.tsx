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
import { GameContainer, Title, VersionNumber, ActionButtons, Button, HeaderContainer, SmallButton } from './styled/game';
import { Die } from './Die';
import { ConfirmationPopup } from './ConfirmationPopup';
import { toPng } from 'html-to-image';
import { RiArrowLeftLine, RiQuestionMark, RiShareFill } from '@remixicon/react';
import { RulesPopup } from './RulesPopup';

export const Game: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
  const [showBettingPopup, setShowBettingPopup] = useState(false);
  const [playerName, setPlayerName] = useState('Player');
  const [numAIPlayers, setNumAIPlayers] = useState(2);
  const [numStartingDice, setNumStartingDice] = useState(3);
  const [braveness, setBraveness] = useState(50);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRules, setShowRules] = useState(false);

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
        bettingStrategyParams: {
          challengeThreshold: 1 - (braveness / 100),
        },
        startingStrategy: StartingStrategy.Simple,
        startingStrategyParams: {
          braveness: braveness / 100,
        },
      })),
    ].sort(() => Math.random() - 0.5);

    dispatch(setPlayers(players));
    dispatch(rollDice());
  };

  const resetGame = () => {
    dispatch(setInitializing());
  };

  const handleShare = async (playerName: string) => {
    console.log('handleShare', playerName);
    try {
      const gameContainer = document.querySelector('.game-container');
      if (!gameContainer) return;

      const dataUrl = await toPng(gameContainer as HTMLElement);
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      if (navigator.share) {
        await navigator.share({
          files: [new File([blob], 'kocka-game.png', { type: 'image/png' })],
          title: `${playerName}'s Kocka Game`,
          text: 'Check out my game of Kocka - A Liar\'s Dice!'
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'kocka-game.png';
        a.click();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <GameContainer className="game-container">
      {gameState.gamePhase === GamePhase.INITIALIZING ? (
        <GameConfiguration
          currentTheme={currentTheme}
          playerName={playerName}
          numAIPlayers={numAIPlayers}
          numStartingDice={numStartingDice}
          braveness={braveness}
          onPlayerNameChange={setPlayerName}
          onAIPlayersChange={setNumAIPlayers}
          onStartingDiceChange={setNumStartingDice}
          onBravenessChange={setBraveness}
          onStartGame={startGame}
        />
      ) : (
        <>
          <HeaderContainer>
            <SmallButton
              onClick={() => setShowConfirmation(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RiArrowLeftLine size={14} />
            </SmallButton>
            <Title
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              🎲 Kocka - A Liar's Dice
            </Title>
            <SmallButton
              onClick={() => setShowRules(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RiQuestionMark size={14} />
            </SmallButton>
          </HeaderContainer>
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
                  <div style={{ display: 'flex', alignItems: 'center', margin: '0 0.5rem' }}>
                    <Die faceValue={gameState.currentBet.quantity}/>
                    <span style={{ margin: '0.5rem', fontWeight: 'bold' }}>X</span>
                    <Die is3D={true} faceValue={gameState.currentBet.faceValue}/>
                  </div>
                  <Button onClick={() => handleHumanDecision('challenge')}>Challenge</Button>
                </>
              )}
              <Button onClick={() => setShowBettingPopup(true)}>Place Bet</Button>
            </ActionButtons>
          )}
          {gameState.gamePhase === GamePhase.ROUND_END && (
            <ActionButtons>
              <SmallButton
                style={{ paddingRight: '1.0rem', paddingLeft: '1.0rem' }}
                onClick={() => handleShare(gameState.players[gameState.activePlayerIndex]?.name || 'Player')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RiShareFill size={18} />
              </SmallButton>
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
          {showConfirmation && (
            <ConfirmationPopup
              title="Restart Game"
              message="Are you sure you want to restart the game? All progress will be lost."
              onConfirm={() => {
                resetGame();
                setShowConfirmation(false);
              }}
              onClose={() => setShowConfirmation(false)}
            />
          )}
          {showRules && <RulesPopup onClose={() => setShowRules(false)} />}
          <VersionNumber>v{process.env.REACT_APP_VERSION}</VersionNumber>
        </>
      )}
    </GameContainer>
  );
};
