import { describe, it, expect } from 'vitest';
import { selectQuestions } from './select-questions';

describe('practice selection', () => {
  it('selects ten unique questions from the full bank, not the first ten', () => {
    const bank = Array.from({ length: 293 }, (_, id) => id);
    const result = selectQuestions(bank, 10, () => 0);
    expect(result).toHaveLength(10);
    expect(new Set(result).size).toBe(10);
    expect(result).toContain(10);
    expect(bank[0]).toBe(0);
  });
  it('different random draws select different ten-question sets', () => {
    const bank = Array.from({ length: 293 }, (_, id) => id);
    expect(selectQuestions(bank, 10, () => 0)).not.toEqual(selectQuestions(bank, 10, () => 0.99));
  });
});