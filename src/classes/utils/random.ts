export function getRandomInt(min: number, max: number): number {
    min = min || 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function getRandom<T>(...values: T[]): T {
    return values[getRandomInt(0, values.length)];
}

export function getUniqId(length: number = 5): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
