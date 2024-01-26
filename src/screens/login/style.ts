import {normalScale, verticalScale} from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    loginLogo: {
      height: normalScale(85),
      width: normalScale(85),
      alignSelf: 'center',
    },
    container: {
      paddingHorizontal: normalScale(50),
    },
    tncStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    radio: {
      height: normalScale(18),
      width: normalScale(18),
      marginRight: normalScale(15),
    },
    agreeText: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      color: theme.colors.black,
    },
    bold: {
      fontFamily: theme.fontType.bold,
    },
    forgot: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      color: theme.colors.black,
      alignSelf: 'center',
    },
    googleButton: {
      borderRadius: theme.borderRadius.radius14,
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.black,
      paddingHorizontal: normalScale(14),
      paddingVertical: verticalScale(15),
      alignItems: 'center',
      flexDirection: 'row',
    },
    google: {
      height: normalScale(24),
      width: normalScale(24),
    },
    loginGoogle: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      color: theme.colors.black,
      marginLeft: normalScale(18),
    },
    signUpBtn:{
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
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: normalScale(16),
      marginTop:15
    },

    HeaderContainerTwo: {
      borderBottomLeftRadius: theme.borderRadius.radius10,
      borderBottomRightRadius: theme.borderRadius.radius10,
      backgroundColor: theme.colors.darkRed,
      height: 160,
      // position: 'relative',
    },
    row2: {
      position: 'absolute',
      top: 45,
      left: 10,
      height: normalScale(30),
      width: normalScale(30),
      zIndex:11111222222
    },
    arrowLeft: {
      height: normalScale(22),
      width: normalScale(22),
    },
    searchContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      height: 35,
      width: 100,
      borderRadius: 10,
      flexDirection: 'row',
      marginLeft: 8,
      position: 'absolute',
      bottom: 20,
      color: theme.colors.white,
      zIndex:11111222
    },
    searchInput: {
      flexShrink: 1,
      marginLeft: 7,
      marginRight: 5,
      height: 35,
      width: 120,
      color: theme.colors.white
    },
    searchIcon: {
      height: 15,
      width: 15,
      marginTop: 10,
      marginLeft: 5
    },
    oneContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      position: 'relative',
      top: 50,
    },
    oneContainerImage: {
      height: 60,
      width: 60,
      marginTop: 10,
      marginLeft: 5
    },
    oneContainerText: {
      textAlign: 'center',
      fontSize: 60,
      fontWeight: '400',
      color: theme.colors.white,
      marginLeft: 2,
    },
  });
};
