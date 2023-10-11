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
      height: normalScale(50),
      width: normalScale(50),
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
  });
};
