import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/styles/theme";

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
              <Text style={[styles.keyText, key === "BACKSPACE" && styles.backspaceText]}>
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
    paddingTop: 16,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  key: {
    flex: 1,
    minWidth: 0,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: "#524b70",
    borderBottomColor: "#111325",
    backgroundColor: "#393554",
  },
  backspace: {
    flex: 1.5,
    backgroundColor: "#484062",
    borderColor: "#82729e",
    borderBottomColor: "#211d36",
  },
  backspaceText: {
    color: colors.lilac,
    fontSize: 22,
  },
  keyPressed: {
    backgroundColor: "#62547e",
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  keyDisabled: {
    opacity: 0.4,
  },
  keyText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
});
