import { normalScale, verticalScale } from "~/theme/device/normalize";
import { ThemeProps } from "~/theme/theme";
import { StyleSheet } from "react-native";

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    inputStyle: {
      backgroundColor: theme.colors.grey,
      color: theme.colors.lightBlack,
      borderRadius: theme.borderRadius.radius8,
      fontSize: theme.fontSize.font14,
      borderColor: theme.colors.darkGrey,
      borderWidth: theme.borderWidth.borderWidth1,
      padding: normalScale(10),
      fontFamily: theme.fontType.regular,
    },
    inputError: {
      marginTop: verticalScale(12),
    },
  });
};
