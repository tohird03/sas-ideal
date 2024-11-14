export const percentCounter = (total: number, loaded: number) => Math.floor((loaded * 100) / total);

export const multiplier = (percentage: number, previousNum: number, multiplyNum: number) =>
  previousNum + Math.floor(percentage + Math.random() * multiplyNum);
