export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function getRandomThree(min: number, max: number): number[] | null {
  if (max - min + 1 < 3) {
    return null;
  }

  const result = new Set<number>();

  while (result.size < 3) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    result.add(num);
  }

  return Array.from(result);
}
