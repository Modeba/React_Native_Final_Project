import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { colors } from "@/styles/theme";

const CONFETTI_COLORS = [colors.mint, colors.lilac, colors.coral, colors.yellow];
const PIECES = Array.from({ length: 36 }, (_, index) => ({
  left: `${(index * 29 + 7) % 100}%` as `${number}%`,
  delay: (index % 9) * 55,
  drift: ((index * 37) % 160) - 80,
  rotation: index % 2 === 0 ? 320 : -280,
  color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
}));

export function WinCelebration() {
  const { height } = useWindowDimensions();
  const [progress] = useState(() => PIECES.map(() => new Animated.Value(0)));

  useEffect(() => {
    let disposed = false;
    let animation: Animated.CompositeAnimation | undefined;

    function stop() {
      animation?.stop();
      progress.forEach((value) => value.setValue(0));
    }

    function start(reduceMotion: boolean) {
      if (disposed) return;
      stop();
      if (reduceMotion) return;

      animation = Animated.parallel(
        progress.map((value, index) =>
          Animated.timing(value, {
            toValue: 1,
            duration: 2400 + (index % 4) * 180,
            delay: PIECES[index].delay,
            easing: Easing.out(Easing.quad),
            useNativeDriver: Platform.OS !== "web",
            isInteraction: false,
          }),
        ),
      );
      animation.start();
    }

    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", start);
    AccessibilityInfo.isReduceMotionEnabled().then(start).catch(() => start(true));

    return () => {
      disposed = true;
      subscription.remove();
      animation?.stop();
    };
  }, [progress]);

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.overlay}
    >
      {PIECES.map((piece, index) => (
        <Animated.View
          key={index}
          style={[
            styles.piece,
            {
              left: piece.left,
              backgroundColor: piece.color,
              borderRadius: index % 3 === 0 ? 8 : 2,
              opacity: progress[index].interpolate({
                inputRange: [0, 0.04, 0.75, 1],
                outputRange: [0, 1, 1, 0],
              }),
              transform: [
                { translateY: progress[index].interpolate({ inputRange: [0, 1], outputRange: [-30, height + 30] }) },
                { translateX: progress[index].interpolate({ inputRange: [0, 1], outputRange: [0, piece.drift] }) },
                { rotate: progress[index].interpolate({ inputRange: [0, 1], outputRange: ["0deg", `${piece.rotation}deg`] }) },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    zIndex: 10,
  },
  piece: {
    position: "absolute",
    top: 0,
    width: 9,
    height: 15,
  },
});
