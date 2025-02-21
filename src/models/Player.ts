import { Bet } from './Bet';
import { bettingStrategies, BettingStrategy, BettingStrategyParams, startingStrategies, StartingStrategy, StartingStrategyParams } from '../strategies/strategies';


export interface PlayerData {
    id: string;
    name: string;
    isAI: boolean;
    aiType: string;
    dice: number[];
    bettingStrategy?: BettingStrategy;
    startingStrategy?: StartingStrategy;
    bettingStrategyParams?: BettingStrategyParams;
    startingStrategyParams?: StartingStrategyParams;
}

export abstract class Player {
    static resolveCallback: ((decision: Bet | 'challenge') => void) | null = null;

    static rollDice(count: number): number[] {
        return Array(count)
            .fill(0)
            .map(() => Math.floor(Math.random() * 6) + 1);
    }

    static loseDie(dice: number[]): number[] {
        return dice.slice(0, -1);
    }

    static async handleAITurn(player: PlayerData, currentBet: Bet | null, totalDiceInGame: number): Promise<Bet | 'challenge'> {
        if (!player.bettingStrategy || !player.startingStrategy) {
            throw new Error('Player has no betting or starting strategy');
        }
        if (currentBet === null) {
            const startingStrategy = startingStrategies[player.startingStrategy];
            return startingStrategy(player.dice, totalDiceInGame, player.startingStrategyParams);
        }
        const bettingStrategy = bettingStrategies[player.bettingStrategy];
        return bettingStrategy(currentBet, player.dice, totalDiceInGame, player.bettingStrategyParams as any);
    }

    static handleHumanTurn(): Promise<Bet | 'challenge'> {
        return new Promise((resolve) => {
            Player.resolveCallback = resolve;
        });
    }

    static makeHumanDecision(decision: Bet | 'challenge'): void {
        if (this.resolveCallback) {
            this.resolveCallback(decision);
            this.resolveCallback = null;
        }
    }
} 
