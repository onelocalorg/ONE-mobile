import {normalScale, verticalScale} from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      paddingVertical: verticalScale(8),
      paddingHorizontal: normalScale(24),
    },
    selectedContainer: {
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.black,
      borderWidth: theme.borderWidth.borderWidth1,
      borderRadius: theme.borderRadius.radius20,
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
    },
    label: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: normalScale(25),
    },
  });
};
