import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { createStyleSheet } from "./style";

export interface ModalProps {
  children?: JSX.Element | JSX.Element[];
  title?: string;
  viewStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  callBack?: () => void;
  isVisible?: boolean;
}

export type ModalRefProps = {
  onOpenModal: () => void;
  onCloseModal: () => void;
};

const ModalView = (
  {
    children,
    title,
    viewStyle,
    titleStyle,
    callBack,
    isVisible = false,
  }: ModalProps,
  ref: React.Ref<unknown> | undefined
) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [visibility, setVisibility] = useState(isVisible);

  const closeModal = () => {
    setVisibility(false);
    if (callBack) {
      callBack();
    }
  };

  useImperativeHandle(ref, () => ({
    onOpenModal() {
      setVisibility(true);
    },
    onCloseModal() {
      closeModal();
    },
  }));

  return (
    <Modal transparent onDismiss={closeModal} visible={visibility}>
      <GestureRecognizer onSwipeDown={closeModal} style={styles.gesture}>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPress={closeModal}
        />
      </GestureRecognizer>
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

export const ModalComponent = forwardRef(ModalView);
