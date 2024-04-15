import { useAppTheme } from "@app-hooks/use-app-theme";
import React from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import { createStyleSheet } from "./style";
import { ImageComponent } from "@components/image-component";
import { buttonArrow } from "@assets/images";

interface ButtonComponentProps extends TouchableOpacityProps {
  buttonStyle?: StyleProp<ViewStyle>;
  title: string;
  hasIcon?: boolean;
  disabled?: boolean;
  icon?: number;
}

export const ButtonComponent = (props: ButtonComponentProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const {
    buttonStyle,
    title,
    hasIcon = true,
    disabled = false,
    icon = buttonArrow,
    ...remainingProps
  } = props || {};

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, buttonStyle, disabled && styles.disabled]}
      disabled={disabled}
      {...remainingProps}
    >
      <View />
      <Text style={styles.title}>{title}</Text>
      {hasIcon && <ImageComponent source={icon} style={styles.buttonArrow} />}
    </TouchableOpacity>
  );
};
