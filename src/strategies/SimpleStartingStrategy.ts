import { Bet } from '../models/Bet';
import { getLargetsMostCommonNumber } from '../utils/math';

export interface SimpleStartingStrategyParams {
    braveness: number;
}

export function decideStartSimple(
    ownDice: number[],
    totalDiceInGame: number,
    strategyParams: SimpleStartingStrategyParams = { braveness: 0.5 },
): Bet {
    const count = Math.max(Math.floor(totalDiceInGame / (3 / (0.5 + strategyParams.braveness))) - 1, 1);
    const array = ownDice.filter(d => d !== 1);
    const mostCommonNumber = getLargetsMostCommonNumber(array.length > 0 ? array : [6]);
    return { quantity: count, faceValue: mostCommonNumber };
}
