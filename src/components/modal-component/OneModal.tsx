import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { createStyleSheet } from "./style";

interface ModalProps {
  children?: JSX.Element | JSX.Element[];
  title?: string;
  viewStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  isVisible: boolean;
  onDismiss?: () => void;
}
export const OneModal = ({
  children,
  title,
  viewStyle,
  titleStyle,
  isVisible,
  onDismiss,
}: ModalProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  return (
    <Modal
      transparent={true}
      onDismiss={onDismiss}
      visible={isVisible}
      onRequestClose={onDismiss}
    >
      <GestureRecognizer
        onSwipeDown={onDismiss}
        style={styles.gesture}
      ></GestureRecognizer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={[styles.gradient, viewStyle]}>
          {!!title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
