import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "~/assets/constants";
import { verticalScale } from "~/theme/device/normalize";
import { ThemeProps } from "~/theme/theme";

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.black,
    },
    background: {
      height: screenHeight + verticalScale(50),
      width: screenWidth,
    },
  });
};
