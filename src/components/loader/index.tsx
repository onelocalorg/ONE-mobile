import { useAppTheme } from "@app-hooks/use-app-theme";
import React from "react";
import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native";
import { createStyleSheet } from "./style";

export interface LoaderProps {
  showOverlay?: boolean;
  color?: string;
  visible: boolean;
  paginationLoader?: boolean;
  paginationLoaderStyle?: StyleProp<ViewStyle>;
  loaderStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  size?: number | "small" | "large";
}

export const Loader = (props: LoaderProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const {
    showOverlay = false,
    color,
    visible = false,
    paginationLoader = false,
    paginationLoaderStyle,
    containerStyle,
    size = "large",
  } = props || {};

  if (!visible) {
    return null;
  }

  const renderLoader = () => (
    <ActivityIndicator size={size} color={color ?? theme.colors.purple} />
  );

  if (paginationLoader) {
    return (
      <View style={[styles.spinner, paginationLoaderStyle]}>
        {renderLoader()}
      </View>
    );
  }

  return (
    <View
      style={[styles.container, showOverlay && styles.overlay, containerStyle]}
    >
      {renderLoader()}
    </View>
  );
};
