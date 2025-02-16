
export function calculateBinomialProbability(n: bigint, totalDice: bigint, p: bigint): number {
    let probability = 0n;
    for (let i = n; i <= totalDice; i++) {
        probability += binomialPMF(totalDice, i, p);
    }
    return Number(probability) / Number(binomialCoefficient(totalDice, totalDice));
}

function binomialPMF(n: bigint, k: bigint, p: bigint): bigint {
    return binomialCoefficient(n, k) * power(p, k) * power(1n - p, n - k);
}

function binomialCoefficient(n: bigint, k: bigint): bigint {
    if (k === 0n || k === n) return 1n;
    return factorial(n) / (factorial(k) * factorial(n - k));
}

function factorial(n: bigint): bigint {
    if (n === 0n || n === 1n) return 1n;
    let result = 1n;
    for (let i = 2n; i <= n; i++) {
        result *= i;
    }
    return result;
}

function power(base: bigint, exponent: bigint): bigint {
    let result = 1n;
    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result *= base;
        }
        exponent /= 2n;
        base *= base;
    }
    return result;
}

export function getMostCommonNumber(numbers: number[]): number {
    if (numbers.length === 0) {
        throw new Error("Array cannot be empty");
    }

    const frequency: { [key: number]: number } = {};
    let maxFreq = 0;
    let mostCommon = numbers[0];

    for (const num of numbers) {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
            mostCommon = num;
        }
    }

    return mostCommon;
}
