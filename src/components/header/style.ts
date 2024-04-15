import { colors } from "~/theme/colors";
import { normalScale, verticalScale } from "~/theme/device/normalize";
import { ThemeProps } from "~/theme/theme";
import { getTopPadding } from "~/utils/platform-padding";
import { StyleSheet } from "react-native";

export const createStyleSheet = (theme: ThemeProps) =>
  StyleSheet.create({
    arrowLeft: {
      height: normalScale(22),
      width: normalScale(22),
    },
    container: {
      borderBottomLeftRadius: theme.borderRadius.radius10,
      borderBottomRightRadius: theme.borderRadius.radius10,
      backgroundColor: theme.colors.headerColor,
      height: 120,
    },
    imageContainer: {
      height: 120,
      overflow: "hidden",
      borderBottomLeftRadius: theme.borderRadius.radius10,
      borderBottomRightRadius: theme.borderRadius.radius10,
      alignItems: "center",
      paddingHorizontal: normalScale(14),
      backgroundColor: theme.colors.headerColor,
    },
    row: {
      flexDirection: "row",
      marginTop: verticalScale(getTopPadding(8)),
      width: "100%",
      justifyContent: "space-between",
    },
    image: {
      height: verticalScale(33),
      width: normalScale(242),
      alignSelf: "center",
    },
    cityClass: {
      // textAlign: 'center',
      paddingVertical: 22,
      paddingHorizontal: 198,
      fontWeight: "400",
      fontSize: 16,
      color: theme.colors.white,
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
    },
    input: {
      flex: 1,
      height: 40,
      justifyContent: "center",
    },
    searchIcon: {
      height: 15,
      width: 15,
      marginTop: 10,
      marginLeft: 5,
    },
    searchInput: {
      flexShrink: 1,
      marginLeft: 7,
      marginRight: 5,
      height: 35,
      width: 120,
      color: theme.colors.white,
    },
    oneContainer: {
      flexDirection: "row",
      justifyContent: "center",
      position: "relative",
      top: 50,
      // left: 75,
    },
    oneContainerImage: {
      height: 60,
      width: 60,
      marginTop: 10,
      marginLeft: 5,
    },
    oneContainerText: {
      textAlign: "center",
      fontSize: 50,
      fontWeight: "400",
      color: theme.colors.white,
      marginLeft: 2,
    },
    arrowClass: {
      height: 25,
      width: 25,
      position: "absolute",
      top: 35,
      left: 16,
    },
    profile: {
      // height: 55,
      // width: 55,
      // borderRadius: theme.borderRadius.radius35
    },
    profileContainer: {
      position: "absolute",
      right: 15,
      bottom: 15,
    },
    bellIcon: {
      height: 22,
      width: 22,
      position: "absolute",
      right: 0,
      zIndex: 11111122,
      borderRadius: 100,
    },
  });
