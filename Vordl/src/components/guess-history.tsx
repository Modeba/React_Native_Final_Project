import { useRef } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import type { ScrollViewInstance } from "react-native";

type GuessHistoryProps = {
  guesses: string[];
};

export function GuessHistory({ guesses }: GuessHistoryProps) {
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
      {guesses.map((guess, index) => (
        <Text key={index} style={styles.guess}>
          {index + 1}. {guess}
        </Text>
      ))}
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
});
