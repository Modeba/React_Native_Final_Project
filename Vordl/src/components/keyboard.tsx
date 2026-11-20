import { Pressable, StyleSheet, Text, View } from "react-native";

const KEY_ROWS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  [..."ZXCVBNM".split(""), "BACKSPACE"],
];

type KeyboardProps = {
  onKeyPress: (key: string) => void;
};

export function Keyboard({ onKeyPress }: KeyboardProps) {
  return (
    <View style={styles.keyboard}>
      {KEY_ROWS.map((row, index) => (
        <View key={index} style={styles.row}>
          {row.map((key) => (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={key === "BACKSPACE" ? "Backspace" : key}
              onPress={() => onKeyPress(key)}
              style={({ pressed }) => [
                styles.key,
                key === "BACKSPACE" && styles.backspace,
                pressed && styles.keyPressed,
              ]}
            >
              <Text style={styles.keyText}>
                {key === "BACKSPACE" ? "⌫" : key}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    width: "100%",
    maxWidth: 480,
    paddingTop: 24,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  key: {
    flex: 1,
    minWidth: 0,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    backgroundColor: "#757575",
  },
  backspace: {
    flex: 1.5,
  },
  keyPressed: {
    backgroundColor: "#a0a0a0",
  },
  keyText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
