import { Bet } from '../models/Bet';
import { getMostCommonNumber } from '../utils/math';

export interface SimpleStartingStrategyParams {}

export function decideStartSimple(
    ownDice: number[],
    totalDiceInGame: number,
    strategyParams: SimpleStartingStrategyParams = {},
): Bet {
    const count = Math.max(Math.floor(totalDiceInGame / 3) - 1, 1);
    const mostCommonNumber = getMostCommonNumber(ownDice.filter(d => d !== 1));
    return { quantity: count, faceValue: mostCommonNumber };
}
