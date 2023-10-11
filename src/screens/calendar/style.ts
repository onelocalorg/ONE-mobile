import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      flex: 1,
    },
    text: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      color: theme.colors.black,
    },
  });
};
