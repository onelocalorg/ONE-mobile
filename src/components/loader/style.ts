import {screenHeight} from '@assets/constants';
import {verticalScale} from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.white,
      flex: 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: screenHeight,
    },
    overlay: {
      zIndex: 10,
      backgroundColor: theme.colors.modalOverlay,
    },
    spinner: {
      height: verticalScale(40),
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
  });
