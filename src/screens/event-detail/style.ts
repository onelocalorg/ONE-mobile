import {normalScale, verticalScale} from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    scrollView: {
      paddingBottom: verticalScale(200),
    },
    container: {
      paddingHorizontal: normalScale(16),
    },
    title: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font34,
      color: theme.colors.darkBlack,
      marginTop: verticalScale(44),
      marginBottom: verticalScale(6),
    },
    row: {
      flexDirection: 'row',
    },
    circularView: {
      backgroundColor: theme.colors.red,
      borderRadius: theme.borderRadius.radius16,
      paddingVertical: verticalScale(8),
      paddingHorizontal: normalScale(8),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
      height: normalScale(58),
      width: normalScale(58),
      alignItems: 'center',
      justifyContent: 'center',
    },
    calendarTime: {
      height: normalScale(40),
      width: normalScale(40),
    },
    margin: {
      marginLeft: normalScale(8),
    },
    date: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font16,
      color: theme.colors.darkBlack,
      marginBottom: verticalScale(10),
    },
    time: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
    },
    marginTop: {
      marginTop: verticalScale(14),
    },
    yellow: {
      backgroundColor: theme.colors.yellow,
      height: normalScale(58),
      width: normalScale(58),
    },
    pinWhite: {
      height: normalScale(30),
      width: normalScale(30),
    },
    dummy: {
      height: normalScale(52),
      width: normalScale(52),
      borderRadius: normalScale(52),
    },
    eventImage: {
      height: normalScale(144),
    },
    event: {
      marginBottom: verticalScale(8),
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font18,
      color: theme.colors.darkBlack,
    },
    rowOnly: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: verticalScale(8),
      alignItems: 'center',
    },
    ticket: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      maxWidth: normalScale(320),
    },
    copy: {
      height: normalScale(20),
      width: normalScale(20),
    },
    desc: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font16,
      color: theme.colors.black,
      marginBottom: verticalScale(23),
    },
    modalContainer: {
      paddingHorizontal: normalScale(16),
    },
    amount: {
      marginTop: verticalScale(12),
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font64,
      color: theme.colors.black,
      alignSelf: 'center',
    },
    radio: {
      height: normalScale(18),
      width: normalScale(18),
    },
    text: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      marginLeft: normalScale(8),
    },
    line: {
      height: verticalScale(1),
      marginTop: verticalScale(32),
      marginBottom: verticalScale(70),
      backgroundColor: theme.colors.lightGrey,
    },
  });
};
