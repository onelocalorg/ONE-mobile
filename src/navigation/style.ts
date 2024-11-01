import { StyleSheet } from "react-native";
import { normalScale, verticalScale } from "~/theme/device/normalize";
import { ThemeProps } from "~/theme/theme";

export const createStyleSheet = (theme: ThemeProps) =>
  StyleSheet.create({
    addGreen: {
      height: normalScale(50),
      width: normalScale(50),
      marginTop: -verticalScale(25),
    },
    container: {
      paddingBottom: 20,
      backgroundColor: theme.colors.footerColor,
      height: verticalScale(65),
      justifyContent: "center",
      alignItems: "center",
      // borderTopLeftRadius: theme.borderRadius.radius10,
      // borderTopRightRadius: theme.borderRadius.radius10,
    },
    innerContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    icon: {
      marginTop: 20,
      width: normalScale(35),
      height: normalScale(35),
      resizeMode: "contain",
    },
  });
