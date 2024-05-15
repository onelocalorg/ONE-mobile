import { StyleSheet } from "react-native";
import { ThemeProps } from "~/theme/theme";

export const createStyleSheet = (theme: ThemeProps) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      // backgroundColor: theme.colors.white,
      flex: 1,
      // position: "absolute",
      top: 200,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      // height: screenHeight,
      height: "100%",
    },
    overlay: {
      zIndex: 10,
      // backgroundColor: theme.colors.modalOverlay,
    },
    spinner: {
      // height: verticalScale(40),
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
  });
