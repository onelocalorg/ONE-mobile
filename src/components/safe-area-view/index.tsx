import React from "react";
import { useAppTheme } from "@app-hooks/use-app-theme";
import { SafeAreaView } from "react-native";
import { createStyleSheet } from "./style";

interface SafeAreaComponentProps {
  children: React.ReactNode;
}

export const SafeAreaComponent = (props: SafeAreaComponentProps) => {
  const { children } = props || {};
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};
