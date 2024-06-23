import React from "react";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { createStyleSheet } from "./style";

interface OneModalProps {
  children?: JSX.Element | JSX.Element[];
  title?: string;
  viewStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  isVisible: boolean;
  onDismiss: () => void;
}
export const OneModal = ({
  children,
  title,
  viewStyle,
  titleStyle,
  isVisible,
  onDismiss,
}: OneModalProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  return (
    <Portal>
      <Modal visible={isVisible} onDismiss={onDismiss}>
        <View style={[styles.gradient, viewStyle]}>
          {!!title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
          {children}
        </View>
      </Modal>
    </Portal>
  );
};
