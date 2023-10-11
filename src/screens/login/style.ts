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
  });
};
