export function leftOrOver(remainingMs: number) {
  return remainingMs >= 0 ? 'left' : 'overtime';
}

export function pluralize(word: string, count: number) {
  if (count === 1) return word;

  return word + 's';
}
