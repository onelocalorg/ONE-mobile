import {normalScale, verticalScale} from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    hamburger: {
      height: verticalScale(20),
      width: normalScale(30),
    },
    notification: {
      height: normalScale(18),
      width: normalScale(18),
    },
    profileView: {
      marginTop: verticalScale(10),
      alignSelf: 'flex-end',
    },
    profile: {
      height: normalScale(55),
      width: normalScale(55),
      borderRadius: normalScale(50),
    },
    dateContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: verticalScale(25),
    },
    calendar: {
      height: normalScale(18),
      width: normalScale(18),
    },
    date: {
      marginHorizontal: normalScale(10),
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
    },
    arrowDown: {
      width: normalScale(10),
      height: verticalScale(5),
    },
    scrollView: {
      paddingBottom: verticalScale(200),
      paddingHorizontal: normalScale(22),
    },
    container: {
      paddingHorizontal: normalScale(22),
    },
    view: {
      borderColor: theme.colors.red,
      borderWidth: theme.borderWidth.borderWidth2,
      borderRadius: theme.borderRadius.radius16,
      width: normalScale(102),
      height: verticalScale(66),
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      height: normalScale(30),
      width: normalScale(30),
    },
    name: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      marginTop: verticalScale(3),
    },
    modalContainer: {
      borderColor: theme.colors.green,
      height: verticalScale(300),
    },
    optionsView: {
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: verticalScale(12),
    },
    greenView: {
      borderColor: theme.colors.green,
      marginHorizontal: normalScale(6),
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
      bottom: 50,
      color: theme.colors.white,
      zIndex:11111222

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
    profileContainer: {
      position: 'absolute',
      right: 15,
      bottom: 40
    },
    bellIcon: {
      height: 22,
      width: 22,
      position: 'absolute',
      right: 0,
      zIndex: 11111122,
      borderRadius:100
    },
  });
};
