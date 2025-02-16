import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player, PlayerData } from '../models/Player';
import { Bet, isGreaterBet } from '../models/Bet';
import { GamePhase } from '../models/GameState';

interface GameState {
  players: PlayerData[];
  currentBet: Bet | null;
  betHistory: {
    type: 'bet' | 'challenge';
    player: PlayerData;
    bet?: Bet;
  }[];
  activePlayerIndex: number;
  gamePhase: GamePhase;
  roundNumber: number;
  lastChallenger?: number;
  lastBetter?: number;
  lastLoser?: number;
}

const initialState: GameState = {
  players: [],
  currentBet: null,
  activePlayerIndex: 0,
  gamePhase: GamePhase.INITIALIZING,
  roundNumber: 1,
  betHistory: [],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<PlayerData[]>) => {
      state.players = action.payload;
    },
    setCurrentBet: (state, action: PayloadAction<Bet>) => {
      state.currentBet = action.payload;
    },
    setActivePlayerIndex: (state, action: PayloadAction<number>) => {
      state.activePlayerIndex = action.payload;
    },
    closeRound: (state) => {
      if (state.lastLoser !== undefined) {
        state.players[state.lastLoser].dice = Player.loseDie(state.players[state.lastLoser].dice);

        state.activePlayerIndex = state.lastLoser;
        state.lastLoser = undefined;
      }
      state.gamePhase = GamePhase.ROUND_CLOSED;
    },
    setGameOver: (state) => {
      state.gamePhase = GamePhase.GAME_OVER;
    },
    rollDice: (state) => {
      state.players.forEach(player => player.dice = Player.rollDice(player.dice.length));
      state.gamePhase = GamePhase.BETTING;
    },
    placeBet: (state, action: PayloadAction<Bet>) => {
      const newBet: Bet = action.payload;
      const currentBet = state.currentBet || null;

      if ((state.betHistory.length > 0) && !isGreaterBet(newBet, currentBet)) {
        throw new Error("Invalid bet: must be greater than current bet");
      }

      state.betHistory.push({
        type: 'bet',
        player: state.players[state.activePlayerIndex],
        bet: newBet,
      });

      state.currentBet = newBet;
      state.lastBetter = state.activePlayerIndex;
      state.activePlayerIndex = (state.activePlayerIndex + 1) % state.players.length;
      while (state.players[state.activePlayerIndex].dice.length === 0) {
        state.activePlayerIndex = (state.activePlayerIndex + 1) % state.players.length;
      }
    },
    challenge: (state) => {
      state.lastChallenger = state.activePlayerIndex;
      state.betHistory.push({
        type: 'challenge',
        player: state.players[state.activePlayerIndex],
      });
      state.gamePhase = GamePhase.CHALLENGE_RESOLUTION;
    },
    resolveChallenge: (state) => {
      if (!state.currentBet || state.lastChallenger === undefined || state.lastBetter === undefined) {
        return;
      }

      const totalDiceCount = state.players.reduce((count, player) => {
        return count + player.dice.filter(d => d === state.currentBet!.faceValue || d === 1).length;
      }, 0);

      const challengeSuccessful = totalDiceCount < state.currentBet.quantity;
      const losingPlayerIndex = challengeSuccessful ? state.lastBetter : state.lastChallenger;
      
      state.lastLoser = losingPlayerIndex;

      state.gamePhase = GamePhase.ROUND_END;
    },
    startNewRound: (state) => {      
      state.currentBet = null;
      state.betHistory = [];
      state.roundNumber += 1;
      state.gamePhase = GamePhase.ROLLING;
      
      // Find next player with remaining dice
      let nextPlayerIndex = state.activePlayerIndex;
      while (state.players[nextPlayerIndex].dice.length === 0) {
        nextPlayerIndex = (nextPlayerIndex + 1) % state.players.length;
      }
      state.activePlayerIndex = nextPlayerIndex;
    },
  },
});

export const { setPlayers, setCurrentBet, setActivePlayerIndex, setGameOver, rollDice, placeBet, challenge, resolveChallenge, startNewRound, closeRound } = gameSlice.actions;

export default gameSlice.reducer;
