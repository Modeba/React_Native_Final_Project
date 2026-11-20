import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Keyboard } from "@/components/keyboard";
import { getRandomWord, WORD_LENGTH } from "@/utils/words";

export default function Index() {
  const [game, setGame] = useState(() => ({
    guess: "",
    targetWord: getRandomWord(),
  }));
  const [feedback, setFeedback] = useState("");

  function handleKeyPress(key: string) {
    setFeedback("");
    setGame((currentGame) => {
      if (key === "BACKSPACE") {
        return { ...currentGame, guess: currentGame.guess.slice(0, -1) };
      }

      if (currentGame.guess.length === WORD_LENGTH) {
        return currentGame;
      }

      return { ...currentGame, guess: currentGame.guess + key };
    });
  }

  function handleCheckGuess() {
    if (!game.targetWord) {
      setFeedback("No words are available yet.");
      return;
    }

    if (game.guess.length !== WORD_LENGTH) {
      setFeedback(`Enter all ${WORD_LENGTH} letters first.`);
      return;
    }

    setFeedback(
      game.guess === game.targetWord
        ? "Correct! You guessed the word!"
        : "Not quite. Try another word!",
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>
        Welcome to Vordl
      </Text>
      <Text style={styles.welcome}>
        guess the word
      </Text>
      <View style={styles.row}>
        {Array.from({ length: WORD_LENGTH }, (_, index) => (
          <View key={index} style={styles.box}>
            <Text style={styles.letter}>{game.guess[index] ?? ""}</Text>
          </View>
        ))}
      </View>
      <View style={styles.bottomControls}>
        <Text accessibilityLiveRegion="polite" style={styles.feedback}>
          {feedback}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={handleCheckGuess}
          style={({ pressed }) => [
            styles.checkButton,
            pressed && styles.checkButtonPressed,
          ]}
        >
          <Text style={styles.checkButtonText}>Check word</Text>
        </Pressable>
        <Keyboard onKeyPress={handleKeyPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#434343",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  welcome: {
    color: "#ffffff",
    fontFamily: "ShantellSans",
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
    maxWidth: 480,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    maxWidth: 480,
    gap: 8,
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#535353",
    borderWidth: 2,
    borderColor: "#a0a0a0",
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
  },
  bottomControls: {
    width: "100%",
    maxWidth: 480,
    marginTop: "auto",
    paddingTop: 24,
  },
  feedback: {
    color: "#ffffff",
    fontFamily: "ShantellSans",
    fontSize: 16,
    textAlign: "center",
    minHeight: 24,
    marginBottom: 12,
  },
  checkButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  checkButtonPressed: {
    backgroundColor: "#bdbdbd",
  },
  checkButtonText: {
    color: "#242424",
    fontFamily: "ShantellSans",
    fontSize: 18,
  },
});
