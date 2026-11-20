import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GuessHistory } from "@/components/guess-history";
import { Keyboard } from "@/components/keyboard";
import { getRandomWord, WORD_LENGTH } from "@/utils/words";

const MAX_GUESSES = 6;

type GameState = {
  guess: string;
  targetWord: string | null;
  guesses: string[];
  feedback: string;
  status: "playing" | "won" | "lost";
};

export default function Index() {
  const [game, setGame] = useState<GameState>(() => ({
    guess: "",
    targetWord: getRandomWord(),
    guesses: [],
    feedback: "",
    status: "playing",
  }));
  const isGameOver = game.status !== "playing";

  function handleKeyPress(key: string) {
    setGame((currentGame) => {
      if (currentGame.status !== "playing") {
        return currentGame;
      }

      if (key === "BACKSPACE") {
        return {
          ...currentGame,
          guess: currentGame.guess.slice(0, -1),
          feedback: "",
        };
      }

      if (currentGame.guess.length === WORD_LENGTH) {
        return currentGame;
      }

      return { ...currentGame, guess: currentGame.guess + key, feedback: "" };
    });
  }

  function handleCheckGuess() {
    setGame((currentGame) => {
      if (currentGame.status !== "playing") {
        return currentGame;
      }

      if (!currentGame.targetWord) {
        return { ...currentGame, feedback: "No words are available yet." };
      }

      if (currentGame.guess.length !== WORD_LENGTH) {
        return {
          ...currentGame,
          feedback: `Enter all ${WORD_LENGTH} letters first.`,
        };
      }

      const guesses = [...currentGame.guesses, currentGame.guess];
      const isCorrect = currentGame.guess === currentGame.targetWord;
      const isLastGuess = guesses.length >= MAX_GUESSES;

      return {
        ...currentGame,
        guesses,
        status: isCorrect ? "won" : isLastGuess ? "lost" : "playing",
        feedback: isCorrect
          ? "Correct! You guessed the word!"
          : isLastGuess ? "" : "Incorrect!",
      };
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>
        Welcome to Vordl, guess the word
      </Text>
      <Text style={styles.guessCount}>
        Guesses: {game.guesses.length}/{MAX_GUESSES}
      </Text>
      <View style={styles.row}>
        {Array.from({ length: WORD_LENGTH }, (_, index) => (
          <View key={index} style={styles.box}>
            <Text style={styles.letter}>{game.guess[index] ?? ""}</Text>
          </View>
        ))}
      </View>
      {game.status === "lost" ? (
        <View style={styles.result}>
          <Text accessibilityLiveRegion="polite" style={styles.resultText}>
            Out of guesses! The correct word was:
          </Text>
          <Text style={styles.answer}>{game.targetWord}</Text>
        </View>
      ) : (
        <GuessHistory guesses={game.guesses} />
      )}
      <View style={styles.bottomControls}>
        <Text accessibilityLiveRegion="polite" style={styles.feedback}>
          {game.feedback}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isGameOver }}
          disabled={isGameOver}
          onPress={handleCheckGuess}
          style={({ pressed }) => [
            styles.checkButton,
            pressed && styles.checkButtonPressed,
            isGameOver && styles.checkButtonDisabled,
          ]}
        >
          <Text style={styles.checkButtonText}>Check word</Text>
        </Pressable>
        <Keyboard onKeyPress={handleKeyPress} disabled={isGameOver} />
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
  guessCount: {
    color: "#ffffff",
    fontFamily: "ShantellSans",
    fontSize: 16,
    marginTop: 12,
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
  result: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    maxWidth: 480,
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  resultText: {
    color: "#ffffff",
    fontFamily: "ShantellSans",
    fontSize: 18,
    textAlign: "center",
  },
  answer: {
    color: "#ffffff",
    fontFamily: "ShantellSans",
    fontSize: 28,
    letterSpacing: 2,
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
  checkButtonDisabled: {
    opacity: 0.5,
  },
  checkButtonText: {
    color: "#242424",
    fontFamily: "ShantellSans",
    fontSize: 18,
  },
});
