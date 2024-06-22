import { StyleSheet } from "react-native";
import { colors } from "~/theme/colors";
import { normalScale, verticalScale } from "~/theme/device/normalize";
import { ThemeProps } from "~/theme/theme";

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    loginLogo: {
      height: normalScale(85),
      width: normalScale(85),
      alignSelf: "center",
    },
    container: {
      backgroundColor: theme.colors.appColor,
      paddingHorizontal: normalScale(50),
      flex: 1,
    },
    tncStyle: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 16,
    },
    radio: {
      height: normalScale(16),
      width: normalScale(16),
      marginRight: normalScale(15),
    },
    agreeText: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      color: theme.colors.white,
    },
    bold: {
      fontFamily: theme.fontType.bold,
      color: theme.colors.lightBlueTwo,
      fontSize: theme.fontSize.font16,
    },
    temsCont: {
      // borderBottomWidth:theme.borderWidth.borderWidth1,
      // borderBottomColor:theme.colors.blue
    },
    forgot: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      color: theme.colors.white,
      marginHorizontal: 5,
      // alignSelf: 'center',
    },
    googleButton: {
      borderRadius: theme.borderRadius.radius18,
      borderWidth: theme.borderWidth.borderWidth2,
      borderColor: theme.colors.black,
      backgroundColor: theme.colors.gray,
      paddingHorizontal: normalScale(10),
      paddingVertical: verticalScale(7),
      alignSelf: "center",
      flexDirection: "row",
      width: "60%",
    },

    appleButton: {
      borderRadius: theme.borderRadius.radius18,
      borderWidth: theme.borderWidth.borderWidth2,
      borderColor: theme.colors.black,
      backgroundColor: theme.colors.black,
      paddingHorizontal: normalScale(10),
      paddingVertical: verticalScale(4),
      alignSelf: "center",
      flexDirection: "row",
      width: "60%",
    },
    google: {
      height: normalScale(24),
      width: normalScale(24),
    },
    apple: {
      height: 30,
      width: 30,
    },
    loginGoogle: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      color: theme.colors.black,
      marginLeft: normalScale(10),
      alignSelf: "center",
    },
    loginApple: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      color: theme.colors.white,
      marginLeft: normalScale(10),
      alignSelf: "center",
    },
    signUpBtn: {
      backgroundColor: theme.colors.lightBlueTwo,
      borderRadius: theme.borderRadius.radius14,
      paddingVertical: verticalScale(8),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      borderColor: theme.colors.white,
      borderWidth: theme.borderWidth.borderWidth2,
      color: theme.colors.black,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
      paddingHorizontal: normalScale(10),
      marginTop: 12,
    },

    loginBtn: {
      backgroundColor: "#BF820A",
      borderRadius: theme.borderRadius.radius14,
      paddingVertical: verticalScale(8),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      borderColor: theme.colors.white,
      borderWidth: theme.borderWidth.borderWidth2,
      color: theme.colors.black,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
      paddingHorizontal: normalScale(10),
      marginTop: 12,
    },

    signUpText: {
      fontSize: 14,
      textAlign: "center",
      color: theme.colors.black,
    },

    HeaderContainerTwo: {
      flexDirection: "row",
    },
    row2: {
      // position: 'absolute',
      // top: 45,
      // left: 10,
      height: normalScale(30),
      width: normalScale(30),
      zIndex: 11111222222,
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
    },

    localText: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "400",
      color: theme.colors.white,
    },

    errorText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.red,
    },
    oneContainerImage: {
      height: normalScale(100),
      width: normalScale(100),
      marginLeft: 5,
    },
    oneContainerText: {
      textAlign: "center",
      fontSize: 75,
      fontWeight: "400",
      color: theme.colors.white,
      marginLeft: 2,
      marginBottom: -10,
    },
    texClass: {
      fontSize: 15,
      fontFamily: theme.fontType.medium,
      color: theme.colors.white,
      fontWeight: "600",
      marginBottom: 3,
    },
    orText: {
      fontSize: 16,
      fontFamily: theme.fontType.medium,
      color: theme.colors.white,
      fontWeight: "600",
      textAlign: "center",
    },
    textInput: {
      backgroundColor: "white",
      borderRadius: 8,
      fontSize: 14,
      borderColor: "#8B8888",
      borderWidth: 1,
      padding: normalScale(10),
      fontFamily: theme.fontType.medium,
      height: verticalScale(38),
      color: "black",
    },
    modal: {
      backgroundColor: colors.lightGrey,
      padding: 20,
    },
  });
};
