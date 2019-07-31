export function getMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  numbers.sort((a, b) => a - b);

  const midIndex = Math.floor(numbers.length / 2);

  if (numbers.length % 2 === 0) {
    return (numbers[midIndex] + numbers[midIndex - 1]) / 2;
  }

  return numbers[midIndex];
}