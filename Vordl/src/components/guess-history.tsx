import { useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { ScrollViewInstance } from "react-native";

import { evaluateGuess } from "@/utils/evaluate-guess";
import { colors } from "@/styles/theme";

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
      {guesses.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.sparkle}>✦</Text>
          <Text style={styles.emptyText}>Every letter is a little clue.</Text>
        </View>
      )}
      {guesses.map((guess, index) => {
        const statuses = evaluateGuess(guess, targetWord);
        const description = statuses
          .map((status, letterIndex) => `${guess[letterIndex]}: ${STATUS_LABELS[status]}`)
          .join("; ");

        return (
          <View
            key={index}
            style={styles.guess}
            accessible
            accessibilityLabel={`Guess ${index + 1}, ${guess}. ${description}`}
          >
            <Text style={styles.guessNumber}>{index + 1}</Text>
            {statuses.map((status, letterIndex) => (
              <Text key={letterIndex} style={[styles.historyLetter, styles[status]]}>
                {guess[letterIndex]}
              </Text>
            ))}
          </View>
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
    marginTop: 12,
  },
  content: {
    alignItems: "center",
    gap: 8,
    paddingBottom: 8,
    paddingTop: 8,
  },
  heading: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 2,
  },
  guess: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
    gap: 6,
  },
  guessNumber: {
    color: colors.muted,
    fontSize: 11,
    width: 16,
    textAlign: "center",
  },
  historyLetter: {
    flex: 1,
    height: 40,
    lineHeight: 38,
    borderRadius: 9,
    borderWidth: 1,
    textAlign: "center",
    fontFamily: "ShantellSans",
    fontSize: 18,
  },
  correct: {
    color: "#8cf0a2",
    backgroundColor: "#8cf0a218",
    borderColor: "#8cf0a260",
  },
  present: {
    color: colors.yellow,
    backgroundColor: "#ffe18a18",
    borderColor: "#ffe18a60",
  },
  absent: {
    color: colors.muted,
    backgroundColor: "#252239",
    borderColor: "#49415e",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 12,
    gap: 6,
  },
  sparkle: {
    color: colors.yellow,
    fontSize: 26,
  },
  emptyText: {
    color: colors.muted,
    fontFamily: "ShantellSans",
    fontSize: 13,
  },
});
