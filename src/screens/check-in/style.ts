import { width } from "~/theme/device/device";
import { normalScale, verticalScale } from "~/theme/device/normalize";
import { ThemeProps } from "~/theme/theme";
import { StyleSheet } from "react-native";

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    pillContainer: {
      alignSelf: "center",
      marginTop: -verticalScale(15),
      paddingBottom: 15,
    },
    container: {
      paddingHorizontal: normalScale(20),
    },
    heading: {
      marginVertical: verticalScale(8),
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font22,
      color: theme.colors.darkBlack,
    },
    scrollView: {
      paddingBottom: verticalScale(800),
    },
    listContainer: {
      borderColor: theme.colors.red,
      borderWidth: theme.borderWidth.borderWidth2,
      borderRadius: theme.borderRadius.radius16,
      paddingHorizontal: normalScale(8),
      paddingVertical: verticalScale(8),
      marginBottom: verticalScale(10),
    },
    rowOnly: {
      flexDirection: "row",
    },
    imageView: {
      borderRadius: normalScale(60),
      height: normalScale(60),
      width: normalScale(60),
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.white,
      marginRight: normalScale(8),
    },
    dummy: {
      height: normalScale(60),
      width: normalScale(60),
      borderRadius: normalScale(60),
    },
    row: {
      // flexDirection: 'row',
      // justifyContent: 'space-between',
      flex: 1,
    },
    name: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
    },
    eventName: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      marginBottom: verticalScale(2),
      marginTop: verticalScale(4),
      flexShrink: 1,
    },
    pillStyle: {
      justifyContent: "center",
    },
    localText: {
      textAlign: "center",
      fontSize: 14,
      fontWeight: "400",
      color: "white",
      position: "relative",
      bottom: 13,
    },
    profileView: {
      // marginTop: verticalScale(10),
      alignSelf: "flex-end",
      position: "absolute",
      right: 5,
      bottom: 30,
    },

    HeaderContainerTwo: {
      // borderBottomLeftRadius: theme.borderRadius.radius10,
      // borderBottomRightRadius: theme.borderRadius.radius10,
      backgroundColor: theme.colors.headerColor,
      height: 150,
      // position: 'relative',
    },
    row2: {
      position: "absolute",
      top: 52,
      left: 10,
      height: normalScale(30),
      width: normalScale(30),
      zIndex: 11111222222,
      paddingLeft: 4,
      paddingTop: 4,
    },
    arrowLeft: {
      height: normalScale(22),
      width: normalScale(22),
    },
    searchContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      height: 35,
      width: 100,
      borderRadius: 10,
      flexDirection: "row",
      marginLeft: 8,
      position: "absolute",
      bottom: 20,
      color: theme.colors.white,
      zIndex: 11111222,
    },
    searchInput: {
      flexShrink: 1,
      marginLeft: 7,
      marginRight: 5,
      height: 35,
      width: 120,
      color: theme.colors.white,
    },
    searchIcon: {
      height: 15,
      width: 15,
      marginTop: 10,
      marginLeft: 5,
    },
    oneContainer: {
      flexDirection: "row",
      justifyContent: "center",
      position: "relative",
      top: 50,
    },
    oneContainerImage: {
      height: 60,
      width: 60,
      marginTop: 10,
      marginLeft: 5,
    },
    oneContainerText: {
      textAlign: "center",
      fontSize: 60,
      fontWeight: "400",
      color: theme.colors.white,
      marginLeft: 2,
    },
    profileContainer: {
      position: "absolute",
      right: 10,
      bottom: 0,
    },
    bellIcon: {
      height: 22,
      width: 22,
      position: "absolute",
      right: 0,
      bottom: 50,
      zIndex: 11111122,
      borderRadius: 100,
    },
    profileImage: {
      height: normalScale(55),
      width: normalScale(55),
      borderRadius: normalScale(50),
    },
  });
};
