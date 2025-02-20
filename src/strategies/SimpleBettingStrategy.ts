import { Bet } from '../models/Bet';
import { calculateBinomialProbability } from '../utils/math';

export interface SimpleBettingStrategyParams {
    /**
    * The weight used in deciding.
    * 
    * 0.0 = only mathematical probability
    * 1.0 = only own dice
    */
    mathVsOwnDice: number,
    /**
     * The threshold for challenging. When the probability of the current bet is less than this, the AI will challenge.
     */
    challengeThreshold: number,
}

export function decideBetSimple(
    currentBet: Bet,
    ownDice: number[],
    totalDiceInGame: number,
    strategyParams: SimpleBettingStrategyParams = { mathVsOwnDice: 0.7, challengeThreshold: 0.5 }
): Bet | 'challenge' {
    const { quantity: n, faceValue: f } = currentBet;
    const k = ownDice.filter(d => d === f || d === 1).length;
    const p = 1 / 3;  // Probability of success (specific face or joker)

    // Calculate probability of current bet
    const currentProb = calculateBinomialProbability(n, totalDiceInGame, p);

    // Threshold for challenging
    const t = strategyParams.challengeThreshold;

    if (currentProb < t) {
        return 'challenge';
    }

    // Calculate probabilities for incremented bets
    const probN = calculateBinomialProbability(n + 1, totalDiceInGame, p);
    const probF = f < 6 ? calculateBinomialProbability(n, totalDiceInGame, p * (6 - f) / (7 - f)) : 0;

    const deltaPN = currentProb - probN;
    const deltaPF = currentProb - probF;

    const w1 = strategyParams.mathVsOwnDice;
    const w2 = 1 - w1;

    // Calculate scores
    const scoreN = w1 * (1 - deltaPN) + w2 * (k / n) / (totalDiceInGame / 6);
    const scoreF = w1 * (1 - deltaPF) + w2 * (1 - (k / n) / (totalDiceInGame / 6));

    console.log('currentProb', currentProb, 'scoreN', scoreN, 'scoreF', scoreF);

    // Decide on the new bet
    if (f === 6 || scoreN > scoreF) {
        return { quantity: n + 1, faceValue: f };
    } else {
        return { quantity: n, faceValue: f + 1 };
    }
}
