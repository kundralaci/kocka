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
    setInitializing: (state) => {
      state.gamePhase = GamePhase.INITIALIZING;
      state.players = [];
      state.currentBet = null;
      state.activePlayerIndex = 0;
      state.roundNumber = 1;
      state.betHistory = [];
    },
    setPlayers: (state, action: PayloadAction<PlayerData[]>) => {
      console.log('setPlayers');
      if (state.gamePhase !== GamePhase.INITIALIZING) {
        console.log('Called in invalid phase');
        return;
      }
      state.players = action.payload;
      state.gamePhase = GamePhase.ROLLING;
    },
    setCurrentBet: (state, action: PayloadAction<Bet>) => {
      state.currentBet = action.payload;
    },
    setActivePlayerIndex: (state, action: PayloadAction<number>) => {
      state.activePlayerIndex = action.payload;
    },
    rollDice: (state) => {
      console.log('rollDice');
      if (state.gamePhase !== GamePhase.ROLLING) {
        console.log('Called in invalid phase');
        return;
      }
      state.players.forEach(player => player.dice = Player.rollDice(player.dice.length));
      state.gamePhase = GamePhase.BETTING;
    },
    placeBet: (state, action: PayloadAction<Bet>) => {
      console.log('placeBet', action.payload);
      if (state.gamePhase !== GamePhase.BETTING) {
        console.log('Called in invalid phase');
        return;
      }

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
      console.log('challenge');
      if (state.gamePhase !== GamePhase.BETTING) {
        console.log('Called in invalid phase');
        return;
      }

      state.lastChallenger = state.activePlayerIndex;
      state.betHistory.push({
        type: 'challenge',
        player: state.players[state.activePlayerIndex],
      });
      state.gamePhase = GamePhase.CHALLENGE_RESOLUTION;
    },
    resolveChallenge: (state) => {
      console.log('resolveChallenge');
      if (state.gamePhase !== GamePhase.CHALLENGE_RESOLUTION) {
        console.log('Called in invalid phase');
        return;
      }

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
    closeRound: (state) => {
      console.log('closeRound', state.lastLoser);
      if (state.gamePhase !== GamePhase.ROUND_END) {
        console.log('Called in invalid phase');
        return;
      }

      if (state.lastLoser !== undefined) {
        state.players[state.lastLoser].dice = Player.loseDie(state.players[state.lastLoser].dice);

        state.activePlayerIndex = state.lastLoser;
        state.lastLoser = undefined;
      }
      state.gamePhase = GamePhase.ROUND_CLOSED;
    },
    startNewRound: (state) => {
      console.log('startNewRound');
      if (state.gamePhase !== GamePhase.ROUND_CLOSED) {
        console.log('Called in invalid phase');
        return;
      }

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
    setGameOver: (state) => {
      console.log('setGameOver');
      if (state.gamePhase !== GamePhase.ROUND_CLOSED) {
        console.log('Called in invalid phase');
        return;
      }state.gamePhase = GamePhase.GAME_OVER;
    },
  },
});

export const { setPlayers, setCurrentBet, setActivePlayerIndex, setGameOver, rollDice, placeBet, challenge, resolveChallenge, startNewRound, closeRound, setInitializing } = gameSlice.actions;

export default gameSlice.reducer;
