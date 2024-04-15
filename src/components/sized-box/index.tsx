import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface SizedBoxProps {
  height?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

export const SizedBox = (props: SizedBoxProps) => {
  const { height, width, style } = props || {};

  return <View style={[style, { height, width }]} />;
};
