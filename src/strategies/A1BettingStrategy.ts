import { Bet } from '../models/Bet';
import { calculateBinomialProbability, getLargetsMostCommonNumber } from '../utils/math';

export interface A1BettingStrategyParams {
    /**
     * The threshold for challenging. When the probability of the current bet is less than this, the AI will challenge.
     */
    challengeThreshold: number,
}

export function decideBetA1(
    currentBet: Bet,
    ownDice: number[],
    totalDiceInGame: number,
    strategyParams: A1BettingStrategyParams = { challengeThreshold: 0.5 }
): Bet | 'challenge' {
    const { quantity: n, faceValue: f } = currentBet;
    const p = 1 / 3;  // Probability of success (specific face or joker)

    // Calculate probabilities for current bet
    const remainingDice = totalDiceInGame - ownDice.length;
    const ownRelevantDice = ownDice.filter(d => d === f || d === 1).length;
    const remainingNeeded = n - ownRelevantDice;
    const currentProb = calculateBinomialProbability(remainingNeeded, remainingDice, p);

  // Case 1: Increase face value (only if f < 6)
    let probNewFace = 0;
    let newFaceValue = f;
    if (f < 6) {
        const higherFaces = ownDice.filter(d => d !== 1 && d > f);
        newFaceValue = higherFaces.length > 0 
        ? getLargetsMostCommonNumber(higherFaces) 
        : f + 1;
        const ownRelevantDiceNewFace = ownDice.filter(d => d === newFaceValue || d === 1).length;
        const remainingNeededNewFace = n - ownRelevantDiceNewFace;
        probNewFace = calculateBinomialProbability(remainingNeededNewFace, remainingDice, p);
    }

    // Case 2: Increase quantity
    const ownRelevantDiceCurrent = ownDice.filter(d => d === f || d === 1).length;
    const remainingNeededNewQuantity = n + 1 - ownRelevantDiceCurrent;
    const probNewQuantity = calculateBinomialProbability(remainingNeededNewQuantity, remainingDice, p);

    console.log(currentProb, probNewFace, probNewQuantity);

    // Challenge decision
    if ((f < 6 && probNewFace < strategyParams.challengeThreshold && probNewQuantity < strategyParams.challengeThreshold) ||
        (f === 6 && probNewQuantity < strategyParams.challengeThreshold)) {
        return 'challenge';
    }

    // Decide between increasing face value or quantity
    if (f === 6 || probNewQuantity > probNewFace) {
        return { quantity: n + 1, faceValue: f };
    } else {
        return { quantity: n, faceValue: newFaceValue };
    }
}
