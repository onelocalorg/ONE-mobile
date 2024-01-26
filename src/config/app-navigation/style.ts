import { normalScale, verticalScale } from '@theme/device/normalize';
import { ThemeProps } from '@theme/theme';
import { StyleSheet } from 'react-native';

export const createStyleSheet = (theme: ThemeProps) =>
  StyleSheet.create({
    addGreen: {
      height: normalScale(50),
      width: normalScale(50),
      marginTop: -verticalScale(25),
    },
    container: {
      paddingBottom : 10,
      backgroundColor: theme.colors.darkRed,
      height: verticalScale(65),
      justifyContent: 'center',
      alignItems: 'center',
      borderTopLeftRadius: theme.borderRadius.radius10,
      borderTopRightRadius: theme.borderRadius.radius10,
    },
    innerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      marginTop: 20,
      width: normalScale(28),
      height: normalScale(24),
      resizeMode: 'contain',
    },
  });
