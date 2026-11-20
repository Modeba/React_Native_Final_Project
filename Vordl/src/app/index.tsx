import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Keyboard } from "@/components/keyboard";

const WORD_LENGTH = 5;

export default function Index() {
  const [word, setWord] = useState("");

  function handleKeyPress(key: string) {
    setWord((currentWord) => {
      if (key === "BACKSPACE") {
        return currentWord.slice(0, -1);
      }

      return currentWord.length < WORD_LENGTH ? currentWord + key : currentWord;
    });
  }

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <View style={styles.row}>
        {Array.from({ length: WORD_LENGTH }, (_, index) => (
          <View key={index} style={styles.box}>
            <Text style={styles.letter}>{word[index] ?? ""}</Text>
          </View>
        ))}
      </View>
      <Keyboard onKeyPress={handleKeyPress} />
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
    marginTop: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
  },
});
