import { useRef } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import type { ScrollViewInstance } from "react-native";

import { evaluateGuess } from "@/utils/evaluate-guess";

const STATUS_LABELS = {
  correct: "correct position",
  present: "in the word, wrong position",
  absent: "not in the word or no remaining match",
};

type GuessHistoryProps = {
  guesses: string[];
  targetWord: string;
};

export function GuessHistory({ guesses, targetWord }: GuessHistoryProps) {
  const scrollRef = useRef<ScrollViewInstance>(null);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.history}
      contentContainerStyle={styles.content}
      onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
    >
      {guesses.length > 0 && (
        <Text style={styles.heading}>Your guesses</Text>
      )}
      {guesses.map((guess, index) => {
        const statuses = evaluateGuess(guess, targetWord);
        const description = statuses
          .map((status, letterIndex) => `${guess[letterIndex]}: ${STATUS_LABELS[status]}`)
          .join("; ");

        return (
          <Text
            key={index}
            style={styles.guess}
            accessibilityLabel={`Guess ${index + 1}, ${guess}. ${description}`}
          >
            {index + 1}. {statuses.map((status, letterIndex) => (
              <Text key={letterIndex} style={styles[status]}>
                {guess[letterIndex]}
              </Text>
            ))}
          </Text>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  history: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    maxWidth: 480,
    marginTop: 16,
  },
  content: {
    alignItems: "center",
    gap: 8,
    paddingBottom: 8,
  },
  heading: {
    color: "#ffffff",
    fontFamily: "ShantellSans",
    fontSize: 18,
  },
  guess: {
    color: "#ffffff",
    fontFamily: "ShantellSans",
    fontSize: 18,
    letterSpacing: 2,
  },
  correct: {
    color: "#7ad879",
  },
  present: {
    color: "#f4d35e",
  },
  absent: {
    color: "#d0d0d0",
  },
});
