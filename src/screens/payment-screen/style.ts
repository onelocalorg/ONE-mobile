import {normalScale, verticalScale} from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      paddingHorizontal: normalScale(16),
      paddingVertical: verticalScale(30),
    },
    cardStyle: {
      backgroundColor: theme.colors.white,
      textColor: theme.colors.black,
    },
    card: {
      width: '100%',
      height: verticalScale(50),
      marginVertical: verticalScale(30),
    },
  });
};
