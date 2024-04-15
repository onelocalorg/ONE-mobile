import { useAppTheme } from "@app-hooks/use-app-theme";
import React from "react";
import { createStyleSheet } from "./style";
import { StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";
import { ImageComponent } from "@components/image-component";
import { ImageStyle } from "react-native-fast-image";

interface PillProps {
  label: string;
  icon?: number;
  onPressPill?: () => void;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  foreGroundColor?: string;
  pillStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  disabled?: boolean;
  uri?: string;
}

export const Pill = (props: PillProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const {
    label,
    icon,
    onPressPill,
    backgroundColor = theme.colors.lightGreen,
    pillStyle,
    iconStyle,
    borderColor,
    borderWidth,
    foreGroundColor = theme.colors.white,
    disabled = false,
    uri,
  } = props || {};

  return (
    <TouchableOpacity
      onPress={onPressPill}
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        styles.container,
        pillStyle,
        { backgroundColor },
        { borderColor },
        { borderWidth },
      ]}
    >
      {!!icon && (
        <ImageComponent source={icon} style={[styles.icon, iconStyle]} />
      )}
      <Text style={[styles.label, { color: foreGroundColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};
