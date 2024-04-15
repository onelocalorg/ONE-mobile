import { lineHeightScale, normalScale } from "@theme/device/normalize";
import { ThemeProps } from "@theme/theme";
import { StyleSheet } from "react-native";

export const createStyleSheet = (theme: ThemeProps) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
    errorIcon: {
      width: normalScale(15),
      height: normalScale(15),
    },
    text: {
      fontFamily: theme.fontType.albertSansRegular,
      fontSize: theme.fontSize.font10,
      lineHeight: lineHeightScale(15),
      color: theme.colors.red,
      marginLeft: normalScale(7),
    },
  });
