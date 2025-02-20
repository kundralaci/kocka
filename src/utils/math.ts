
export function calculateBinomialProbability(n: number, totalDice: number, p: number): number {
    let probability = 0;
    for (let i = n; i <= totalDice; i++) {
        probability += binomialPMF(totalDice, i, p);
    }
    return probability / binomialCoefficient(totalDice, totalDice);
}

function binomialPMF(n: number, k: number, p: number): number {
    return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function binomialCoefficient(n: number, k: number): number {
    if (k === 0 || k === n) return 1;
    return factorial(n) / (factorial(k) * factorial(n - k));
}

function factorial(n: number): number {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
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
