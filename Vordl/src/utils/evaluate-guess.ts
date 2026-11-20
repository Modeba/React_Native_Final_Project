export type LetterStatus = "correct" | "present" | "absent";

export function evaluateGuess(guess: string, targetWord: string): LetterStatus[] {
  const statuses: LetterStatus[] = Array(guess.length).fill("absent");
  const remainingLetters = new Map<string, number>();

  // Reserve exact matches before assigning any misplaced letters.
  Array.from(targetWord).forEach((letter, index) => {
    if (guess[index] === letter) {
      statuses[index] = "correct";
    } else {
      remainingLetters.set(letter, (remainingLetters.get(letter) ?? 0) + 1);
    }
  });

  Array.from(guess).forEach((letter, index) => {
    if (statuses[index] === "correct") {
      return;
    }

    const remaining = remainingLetters.get(letter) ?? 0;
    if (remaining > 0) {
      statuses[index] = "present";
      remainingLetters.set(letter, remaining - 1);
    }
  });

  return statuses;
}
