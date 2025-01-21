import { StyleSheet } from "react-native";
import { normalScale, verticalScale } from "~/theme/device/normalize";
import { ThemeProps } from "~/theme/theme";

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    mapcard: {
      width: "80%",
      height: 100,
      // flex: 1,
      flexDirection: "row",
      // borderRadius: theme.borderRadius.radius16,
      // borderWidth: theme.borderWidth.borderWidth1,
      // borderColor: theme.colors.red,
      // paddingVertical: verticalScale(8),
      // paddingHorizontal: normalScale(8),
      // backgroundColor: theme.colors.white,
      // flexDirection: "row",
      // margin: verticalScale(13),
      // shadowColor: theme.colors.darkGrey,
      // shadowOffset: { width: 1, height: 2 },
      // shadowOpacity: 0.9,
      // shadowRadius: 4,
    },
    image: {
      width: normalScale(80),
      height: verticalScale(92),
      marginRight: normalScale(18),
      // borderRadius: theme.borderRadius.radius10,
    },
    content: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-end",
    },

    dateText: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      marginBottom: verticalScale(4),
    },
    title: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font16,
      color: theme.colors.black,
      // marginBottom: verticalScale(7),
      maxWidth: normalScale(200),
      flexShrink: 1,
    },
    event: {
      height: normalScale(32),
      width: normalScale(32),
      marginLeft: normalScale(12),
    },
    row: {
      flexDirection: "row",
      flex: 1,
    },
    pin: {
      height: normalScale(14),
      width: normalScale(14),
      marginRight: normalScale(8),
      marginTop: normalScale(6),
    },
    location: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      flexShrink: 1,
      marginTop: normalScale(6),
    },
    fullAddress: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
    },
    addressDot: {
      height: 6,
      width: 6,
      marginVertical: 5,
      marginHorizontal: 5,
    },
    cancelText: {
      position: "absolute",
      right: 0,
      top: 35,
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font14,
      color: theme.colors.redTwo,
    },
    rowClass: {
      flexDirection: "row",
      paddingTop: 5,
    },
  });
};
