import type { XOR } from 'ts-xor'

import { decideBetSimple, SimpleBettingStrategyParams } from "./SimpleBettingStrategy"
import { decideStartSimple, SimpleStartingStrategyParams } from "./SimpleStartingStrategy"

export enum BettingStrategy {
    Simple = 'simple',
}

export enum StartingStrategy {
    Simple = 'simple',
}

export const bettingStrategies = {
    [BettingStrategy.Simple]: decideBetSimple,
}

export const startingStrategies = {
    [StartingStrategy.Simple]: decideStartSimple,
}

export type BettingStrategyParams = XOR<SimpleBettingStrategyParams, undefined>;
export type StartingStrategyParams = XOR<SimpleStartingStrategyParams, undefined>;