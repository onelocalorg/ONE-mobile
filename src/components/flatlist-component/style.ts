import { StyleSheet } from "react-native";
import { verticalScale } from "~/theme/device/normalize";
import { ThemeProps } from "~/theme/theme";

export const createStyleSheet = (theme: ThemeProps) =>
  StyleSheet.create({
    text: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      alignSelf: "center",
      paddingBottom: verticalScale(10),
      marginTop: verticalScale(10),
    },
    emptyView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginTop: verticalScale(160),
    },
    title: {
      fontFamily: theme.fontType.bold,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      marginTop: verticalScale(24),
      marginBottom: verticalScale(12),
      textAlign: "center",
    },
  });
