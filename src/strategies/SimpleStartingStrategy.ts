import { Bet } from '../models/Bet';
import { getLargetsMostCommonNumber } from '../utils/math';

export interface SimpleStartingStrategyParams {}

export function decideStartSimple(
    ownDice: number[],
    totalDiceInGame: number,
    strategyParams: SimpleStartingStrategyParams = {},
): Bet {
    const count = Math.max(Math.floor(totalDiceInGame / 3) - 1, 1);
    const array = ownDice.filter(d => d !== 1);
    const mostCommonNumber = getLargetsMostCommonNumber(array.length > 0 ? array : [6]);
    return { quantity: count, faceValue: mostCommonNumber };
}
