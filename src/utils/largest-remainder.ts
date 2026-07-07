export interface RemainderItem {
  index: number;
  rawValue: number;
  flooredValue: number;
  remainder: number;
}

/**
 * Applies largest-remainder rounding so floored values sum to the target total.
 * @param rawValues - unrounded values per line
 * @param decimalPlaces - precision for the output values
 * @returns rounded values in the same order as rawValues
 */
export function applyLargestRemainder(rawValues: number[], decimalPlaces: number): number[] {
  if (rawValues.length === 0) {
    return [];
  }

  const factor = Math.pow(10, decimalPlaces);
  const targetTotal = Math.round(rawValues.reduce((sum, v) => sum + v, 0) * factor);

  const items: RemainderItem[] = rawValues.map((raw, index) => {
    const scaled = raw * factor;
    const floored = Math.floor(scaled);
    return {
      index,
      rawValue: raw,
      flooredValue: floored,
      remainder: scaled - floored,
    };
  });

  let currentTotal = items.reduce((sum, item) => sum + item.flooredValue, 0);
  let unitsToDistribute = targetTotal - currentTotal;

  const sortedByRemainder = [...items].sort((a, b) => {
    if (b.remainder !== a.remainder) {
      return b.remainder - a.remainder;
    }
    return a.index - b.index;
  });

  let distributeIndex = 0;
  while (unitsToDistribute > 0) {
    sortedByRemainder[distributeIndex % sortedByRemainder.length].flooredValue += 1;
    unitsToDistribute -= 1;
    distributeIndex += 1;
  }

  const result = new Array<number>(rawValues.length);
  for (const item of items) {
    result[item.index] = item.flooredValue / factor;
  }

  return result;
}
