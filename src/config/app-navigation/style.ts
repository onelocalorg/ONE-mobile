import {normalScale, verticalScale} from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) =>
  StyleSheet.create({
    addGreen: {
      height: normalScale(60),
      width: normalScale(60),
      marginTop: -verticalScale(30),
    },
    container: {
      backgroundColor: theme.colors.blue,
      height: verticalScale(90),
      justifyContent: 'center',
      alignItems: 'center',
    },
    innerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: normalScale(40),
      height: normalScale(40),
      resizeMode: 'contain',
    },
  });
