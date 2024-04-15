import { normalScale, verticalScale } from "~/theme/device/normalize";
import { ThemeProps } from "~/theme/theme";
import { StyleSheet } from "react-native";

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.white,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font16,
      color: theme.colors.black,
      paddingHorizontal: normalScale(16),
      textAlign: "center",
      marginBottom: verticalScale(40),
    },
  });
};
