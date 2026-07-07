import { describe, it, expect } from 'vitest';
import { applyLargestRemainder } from '../src/utils/largest-remainder';

describe('applyLargestRemainder', () => {
  it('rounds share quantities for the PDF example', () => {
    const rawQuantities = [0.6, 0.4];
    const result = applyLargestRemainder(rawQuantities, 3);
    expect(result).toEqual([0.6, 0.4]);
  });

  it('ensures dollar amounts sum to the target total', () => {
    const rawAmounts = [33.333, 33.333, 33.334];
    const result = applyLargestRemainder(rawAmounts, 2);
    const sum = result.reduce((acc, value) => acc + value, 0);
    expect(sum).toBeCloseTo(100, 2);
  });

  it('distributes remainder units to lines with largest fractional parts', () => {
    const rawValues = [1.004, 1.004, 1.004];
    const result = applyLargestRemainder(rawValues, 2);
    expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(3.01, 2);
  });

  it('returns empty array for empty input', () => {
    expect(applyLargestRemainder([], 3)).toEqual([]);
  });
});
