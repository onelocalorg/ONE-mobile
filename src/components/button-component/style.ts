import { normalScale, verticalScale } from "~/theme/device/normalize";
import { ThemeProps } from "~/theme/theme";
import { StyleSheet } from "react-native";

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.purple,
      borderRadius: theme.borderRadius.radius14,
      paddingVertical: verticalScale(14),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: normalScale(16),
    },
    disabled: {
      opacity: 0.5,
    },
    title: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font16,
      color: theme.colors.white,
    },
    buttonArrow: {
      height: normalScale(30),
      width: normalScale(30),
      marginLeft: normalScale(10),
    },
  });
};
