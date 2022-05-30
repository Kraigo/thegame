export function getRandomInt(min: number, max: number): number {
    min = min || 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandom<T>(...values: T[]): T {
    return values[getRandomInt(0, values.length)];
}