export interface Bet {
    quantity: number;
    faceValue: number;
}

export function isGreaterBet(bet: Bet | null, otherBet: Bet | null): boolean {
    if (!bet || !otherBet) {
        throw new Error('Bet or otherBet is null');
    }
    if (bet.quantity > otherBet.quantity) return true;
    if (bet.quantity === otherBet.quantity && bet.faceValue > otherBet.faceValue) return true;
    return false;
}

export function betToString(bet: Bet): string {
    return `${bet.quantity} of ${bet.faceValue}'s`;
}