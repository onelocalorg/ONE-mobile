import {normalScale, verticalScale} from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {getTopPadding} from '@utils/platform-padding';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) =>
  StyleSheet.create({
    arrowLeft: {
      height: normalScale(22),
      width: normalScale(22),
    },
    container: {
      borderBottomLeftRadius: theme.borderRadius.radius10,
      borderBottomRightRadius: theme.borderRadius.radius10,
    },
    imageContainer: {
      height: verticalScale(getTopPadding(120)),
      overflow: 'hidden',
      borderBottomLeftRadius: theme.borderRadius.radius10,
      borderBottomRightRadius: theme.borderRadius.radius10,
      alignItems: 'center',
      paddingHorizontal: normalScale(14),
    },
    row: {
      flexDirection: 'row',
      marginTop: verticalScale(getTopPadding(20)),
      width: '100%',
      justifyContent: 'space-between',
    },
    image: {
      height: verticalScale(33),
      width: normalScale(242),
      alignSelf: 'center',
    },
  });
