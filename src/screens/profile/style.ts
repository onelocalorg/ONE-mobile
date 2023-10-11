import {normalScale, verticalScale} from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    logout: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font14,
      color: theme.colors.white,
    },
    container: {
      flex: 1,
    },
    profileContainer: {
      borderColor: theme.colors.white,
      borderRadius: normalScale(56),
      borderWidth: theme.borderWidth.borderWidth1,
      marginTop: verticalScale(100),
      alignSelf: 'flex-start',
      marginLeft: normalScale(7),
      position: 'absolute',
    },
    profile: {
      height: normalScale(112),
      width: normalScale(112),
      borderRadius: normalScale(112),
    },
    center: {
      alignSelf: 'center',
      marginTop: verticalScale(2),
      marginLeft: normalScale(50),
      alignItems: 'center',
    },
    name: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font24,
      color: theme.colors.darkBlack,
      marginBottom: verticalScale(4),
      maxWidth: normalScale(150),
    },
    circularView: {
      paddingVertical: verticalScale(2),
      paddingHorizontal: normalScale(30),
      borderColor: theme.colors.lightWhite,
      borderWidth: theme.borderWidth.borderWidth1,
      borderRadius: theme.borderRadius.radius12,
    },
    des: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    payView: {
      backgroundColor: theme.colors.lightPurple,
      alignSelf: 'flex-start',
      borderRadius: theme.borderRadius.radius20,
      paddingVertical: verticalScale(8),
      paddingHorizontal: normalScale(8),
      marginLeft: normalScale(6),
      marginTop: verticalScale(11),
    },
    pay: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
    },
    aboutView: {
      marginTop: verticalScale(6),
      marginHorizontal: normalScale(6),
    },
    input: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.lightWhite,
      borderWidth: theme.borderWidth.borderWidth1,
    },
    about: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    line: {
      height: verticalScale(4),
      backgroundColor: theme.colors.greyLine,
      marginVertical: verticalScale(10),
    },
    marginBottom: {
      marginBottom: verticalScale(10),
    },
    innerConatiner: {
      marginHorizontal: normalScale(12),
    },
    rowOnly: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    membership: {
      marginVertical: verticalScale(8),
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font18,
      color: theme.colors.darkBlack,
    },
    flexWrap: {
      flexWrap: 'wrap',
    },
    save: {
      height: normalScale(25),
      width: normalScale(25),
    },
    buttonView: {
      flexDirection: 'row',
    },
    aboutContainer: {
      borderColor: theme.colors.lightWhite,
      borderRadius: normalScale(12),
      borderWidth: theme.borderWidth.borderWidth1,
      paddingVertical: verticalScale(6),
      paddingHorizontal: normalScale(6),
    },
    row: {
      flexDirection: 'row',
      marginTop: verticalScale(8),
    },
    modalContainer: {
      marginTop: verticalScale(20),
    },
    pillStyle: {
      alignSelf: 'center',
    },
    selectContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: normalScale(24),
      marginTop: verticalScale(20),
    },
    selectView: {
      paddingHorizontal: normalScale(8),
      paddingVertical: verticalScale(8),
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedSelectView: {
      borderColor: theme.colors.lightPurple,
      borderRadius: normalScale(10),
      borderWidth: theme.borderWidth.borderWidth6,
    },
    amount: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font64,
      color: theme.colors.black,
    },
    bill: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    button: {
      marginHorizontal: normalScale(44),
      marginTop: verticalScale(200),
    },
    eventContainer: {
      paddingHorizontal: normalScale(22),
    },
    loader: {
      height: verticalScale(450),
      backgroundColor: 'transparent',
    },
    scrollView: {
      paddingBottom: verticalScale(200),
      paddingHorizontal: normalScale(22),
    },
  });
};
