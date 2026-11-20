import { Pressable, StyleSheet, Text, View } from "react-native";

const KEY_ROWS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  [..."ZXCVBNM".split(""), "BACKSPACE"],
];

type KeyboardProps = {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
};

export function Keyboard({ onKeyPress, disabled = false }: KeyboardProps) {
  return (
    <View style={styles.keyboard}>
      {KEY_ROWS.map((row, index) => (
        <View key={index} style={styles.row}>
          {row.map((key) => (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={key === "BACKSPACE" ? "Backspace" : key}
              accessibilityState={{ disabled }}
              disabled={disabled}
              onPress={() => onKeyPress(key)}
              style={({ pressed }) => [
                styles.key,
                key === "BACKSPACE" && styles.backspace,
                pressed && styles.keyPressed,
                disabled && styles.keyDisabled,
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
  keyDisabled: {
    opacity: 0.5,
  },
  keyText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
