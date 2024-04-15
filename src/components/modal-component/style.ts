import { normalScale, verticalScale } from "@theme/device/normalize";
import { ThemeProps } from "@theme/theme";
import { StyleSheet } from "react-native";

export const createStyleSheet = (theme: ThemeProps) =>
  StyleSheet.create({
    gesture: {
      flex: 1,
    },
    container: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.modalOverlay,
    },
    keyboardView: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    gradient: {
      borderTopRightRadius: theme.borderRadius.radius16,
      borderTopLeftRadius: theme.borderRadius.radius16,
      paddingVertical: verticalScale(20),
      maxHeight: verticalScale(700),
      borderColor: theme.colors.lightPurple,
      backgroundColor: theme.colors.white,
      borderTopWidth: theme.borderWidth.borderWidth6,
      borderLeftWidth: theme.borderWidth.borderWidth6,
      borderRightWidth: theme.borderWidth.borderWidth6,
    },
    swipeIcon: {
      height: verticalScale(10),
      width: normalScale(30),
      alignSelf: "center",
    },
    title: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font24,
      color: theme.colors.black,
      paddingHorizontal: normalScale(16),
      alignSelf: "center",
    },
  });
