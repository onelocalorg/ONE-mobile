import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { createStyleSheet } from "./style";

interface OneModalProps {
  children?: JSX.Element | JSX.Element[];
  title?: string;
  viewStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  isVisible: boolean;
  onRequestClose: () => void;
}
export const OneModal = ({
  children,
  title,
  viewStyle,
  titleStyle,
  isVisible,
  onRequestClose,
}: OneModalProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  return (
    <View style={{ height: "100%" }}>
      <Modal
        transparent={true}
        visible={isVisible}
        onRequestClose={onRequestClose}
      >
        <GestureRecognizer onSwipeDown={onRequestClose} style={styles.gesture}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <View style={[styles.gradient, viewStyle]}>
              <Pressable onPress={onRequestClose}></Pressable>
              {!!title && (
                <Text style={[styles.title, titleStyle]}>{title}</Text>
              )}
              {children}
            </View>
          </KeyboardAvoidingView>
        </GestureRecognizer>
      </Modal>
    </View>
  );
};
