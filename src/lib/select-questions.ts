/** Shuffle the whole available bank before selecting a session, never a limited prefix. */
export function selectQuestions<T>(questions: readonly T[], limit?: number, random = Math.random): T[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return limit === undefined ? shuffled : shuffled.slice(0, limit);
}