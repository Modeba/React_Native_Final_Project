import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GuessHistory } from "@/components/guess-history";
import { Keyboard } from "@/components/keyboard";
import { WinCelebration } from "@/components/win-celebration";
import { colors } from "@/styles/theme";
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

  function handleRestart() {
    setGame({
      guess: "",
      targetWord: getRandomWord(),
      guesses: [],
      feedback: "",
      status: "playing",
    });
  }

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
        guess: "",
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
      <View pointerEvents="none" style={styles.backdrop}>
        <View style={styles.orbPurple} />
        <View style={styles.orbMint} />
      </View>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>YOUR LITTLE WORD BREAK</Text>
        <Text style={styles.wordmark}>Vordl<Text style={styles.wordmarkDot}>.</Text></Text>
        <Text style={styles.welcome}>Welcome to Vordl, guess the word</Text>
      </View>
      <View style={styles.attempts}>
        <Text style={styles.guessCount}>
          Guesses: {game.guesses.length}/{MAX_GUESSES}
        </Text>
        <View style={styles.attemptDots} accessibilityElementsHidden>
          {Array.from({ length: MAX_GUESSES }, (_, index) => (
            <View key={index} style={[styles.attemptDot, index < game.guesses.length && styles.attemptDotUsed]} />
          ))}
        </View>
      </View>
      <View style={styles.row}>
        {Array.from({ length: WORD_LENGTH }, (_, index) => (
          <View key={index} style={[
            styles.box,
            game.guess[index] && styles.boxFilled,
            !isGameOver && index === game.guess.length && styles.boxActive,
            game.status === "won" && styles.boxWon,
          ]}>
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
        <GuessHistory guesses={game.guesses} targetWord={game.targetWord ?? ""} />
      )}
      <View style={styles.bottomControls}>
        <Text accessibilityLiveRegion="polite" style={[
          styles.feedback,
          game.status === "won" && styles.feedbackSuccess,
        ]}>
          {game.feedback}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={isGameOver ? handleRestart : handleCheckGuess}
          style={({ pressed }) => [
            styles.checkButton,
            pressed && styles.checkButtonPressed,
          ]}
        >
          <Text style={styles.checkButtonText}>
            {isGameOver ? "Play again" : "Check word"}
          </Text>
        </Pressable>
        <Keyboard onKeyPress={handleKeyPress} disabled={isGameOver} />
      </View>
      {game.status === "won" && <WinCelebration />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    backgroundImage: "linear-gradient(155deg, #30204d 0%, #15152b 52%, #123438 100%)",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
  orbPurple: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    top: -120,
    right: -100,
    backgroundColor: "#b794ff12",
    borderWidth: 1,
    borderColor: "#c9b4ff20",
  },
  orbMint: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    bottom: 120,
    left: -130,
    backgroundColor: "#8cf0c90a",
    borderWidth: 1,
    borderColor: "#8cf0c91a",
  },
  hero: {
    alignItems: "center",
    paddingTop: 8,
    width: "100%",
    maxWidth: 480,
  },
  eyebrow: {
    color: colors.lilac,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
  wordmark: {
    color: colors.text,
    fontFamily: "ShantellSans",
    fontSize: 46,
    lineHeight: 58,
  },
  wordmarkDot: {
    color: colors.mint,
  },
  welcome: {
    color: colors.muted,
    fontFamily: "ShantellSans",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    maxWidth: 480,
    marginTop: 2,
  },
  attempts: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 480,
    marginTop: 20,
  },
  guessCount: {
    color: colors.lilac,
    fontFamily: "ShantellSans",
    fontSize: 13,
  },
  attemptDots: {
    flexDirection: "row",
    gap: 6,
  },
  attemptDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.mint,
  },
  attemptDotUsed: {
    backgroundColor: "#615978",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    maxWidth: 480,
    gap: 8,
    marginTop: 12,
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    borderBottomWidth: 5,
    boxShadow: "0px 6px 12px #08081540",
    alignItems: "center",
    justifyContent: "center",
  },
  boxFilled: {
    backgroundColor: "#39305c",
    borderColor: colors.lilac,
  },
  boxActive: {
    borderColor: colors.mint,
    backgroundColor: "#203b40",
    boxShadow: "0px 0px 16px #8cf0c922",
  },
  boxWon: {
    backgroundColor: "#204b44",
    borderColor: colors.mint,
  },
  letter: {
    color: colors.text,
    fontFamily: "ShantellSans",
    fontSize: 32,
  },
  result: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    maxWidth: 480,
    alignItems: "center",
    marginTop: 16,
    gap: 12,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ff9aaf40",
    backgroundColor: "#ff9aaf0c",
  },
  resultText: {
    color: colors.muted,
    fontFamily: "ShantellSans",
    fontSize: 18,
    textAlign: "center",
  },
  answer: {
    color: colors.yellow,
    fontFamily: "ShantellSans",
    fontSize: 28,
    letterSpacing: 2,
  },
  bottomControls: {
    width: "100%",
    maxWidth: 480,
    marginTop: "auto",
    paddingTop: 12,
  },
  feedback: {
    color: colors.coral,
    fontFamily: "ShantellSans",
    fontSize: 14,
    textAlign: "center",
    minHeight: 24,
    marginBottom: 8,
  },
  feedbackSuccess: {
    color: colors.mint,
  },
  checkButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderBottomWidth: 4,
    borderColor: "#43ad91",
    backgroundColor: colors.mint,
    boxShadow: "0px 6px 20px #8cf0c91a",
  },
  checkButtonPressed: {
    backgroundColor: "#6fddba",
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  checkButtonText: {
    color: colors.ink,
    fontFamily: "ShantellSans",
    fontSize: 18,
  },
});
