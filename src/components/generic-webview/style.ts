import { screenWidth } from "@assets/constants";
import {
  lineHeightScale,
  normalScale,
  verticalScale,
} from "@theme/device/normalize";
import { ThemeProps } from "@theme/theme";
import { StyleSheet } from "react-native";

export const createStyleSheet = (theme: ThemeProps) =>
  StyleSheet.create({
    textStyle: {
      // color: hexToRgbA(theme.colors.primaryColor, 80),
      // fontFamily: theme.fontType.albertSansMedium,
    },
    background: {
      flex: 1,
      width: screenWidth,
    },
    header: {
      marginHorizontal: normalScale(16),
      marginBottom: verticalScale(24),
    },
    smallHeader: {
      height: verticalScale(30),
    },
    webView: {
      flex: 1,
      height: "100%",
      width: "100%",
    },
    text: {
      // fontFamily: theme.fontType.albertSansSemiBold,
      fontSize: theme.fontSize.font20,
      lineHeight: lineHeightScale(20),
      // color: theme.colors.errorColor,
      alignSelf: "center",
    },
  });
