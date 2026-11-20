import words from "../data/words.json";

export const WORD_LENGTH = 5;

const validWords = Array.from(
  new Set(
    words
      .map((word) => word.trim().toUpperCase())
      .filter((word) => word.length === WORD_LENGTH && /^[A-Z]+$/.test(word)),
  ),
);

export function getRandomWord(): string | null {
  if (validWords.length === 0) {
    return null;
  }

  return validWords[Math.floor(Math.random() * validWords.length)];
}
