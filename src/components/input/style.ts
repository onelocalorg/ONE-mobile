import { StyleSheet } from "react-native";
import { normalScale, verticalScale } from "~/theme/device/normalize";
import { ThemeProps } from "~/theme/theme";

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    inputStyle: {
      backgroundColor: "white",
      borderRadius: 8,
      fontSize: 14,
      borderColor: "#8B8888",
      borderWidth: 1,
      paddingVertical: normalScale(4),
      paddingHorizontal: normalScale(10),
      lineHeight: 20,
      color: "black",
    },
    inputError: {
      marginTop: verticalScale(12),
    },
  });
};
