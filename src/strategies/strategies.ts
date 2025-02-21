import { decideBetSimple, SimpleBettingStrategyParams } from "./SimpleBettingStrategy"
import { decideBetA1, A1BettingStrategyParams } from "./A1BettingStrategy";

import { decideStartSimple, SimpleStartingStrategyParams } from "./SimpleStartingStrategy";

export enum BettingStrategy {
    Simple = 'Simple',
    A1 = 'A1',
}

export enum StartingStrategy {
    Simple = 'simple',
}

export const bettingStrategies = {
    [BettingStrategy.Simple]: decideBetSimple,
    [BettingStrategy.A1]: decideBetA1,
}

export const startingStrategies = {
    [StartingStrategy.Simple]: decideStartSimple,
}

export type BettingStrategyParams = SimpleBettingStrategyParams | A1BettingStrategyParams;
export type StartingStrategyParams = SimpleStartingStrategyParams;
