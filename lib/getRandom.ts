export const getRandomFromLength = (range: number) => Math.floor(Math.random() * range);

export const getRandomFromArray = <T>(array: T[]) => array[getRandomFromLength(array.length)];
