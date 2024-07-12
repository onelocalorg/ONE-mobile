import React, { ReactNode, useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface FontAwesomeSpinProps {
  children: ReactNode;
}
export const FontAwesomeSpin = ({ children }: FontAwesomeSpinProps) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [spinAnim]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      {children}
    </Animated.View>
  );
};

export default FontAwesomeSpin;
