import {normalScale, verticalScale} from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.radius20,
      paddingVertical: verticalScale(8),
      paddingHorizontal: normalScale(8),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginRight: normalScale(8),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
    },
    icon: {
      height: normalScale(30),
      width: normalScale(30),
      marginRight: normalScale(8),
    },
    label: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.white,
    },
  });
};
