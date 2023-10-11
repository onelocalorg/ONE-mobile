import {normalScale, verticalScale} from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    pillContainer: {
      alignSelf: 'center',
      marginTop: -verticalScale(15),
    },
    container: {
      paddingHorizontal: normalScale(20),
    },
    heading: {
      marginVertical: verticalScale(8),
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font34,
      color: theme.colors.darkBlack,
    },
    scrollView: {
      paddingBottom: verticalScale(600),
    },
    listContainer: {
      borderColor: theme.colors.red,
      borderWidth: theme.borderWidth.borderWidth2,
      borderRadius: theme.borderRadius.radius16,
      paddingHorizontal: normalScale(8),
      paddingVertical: verticalScale(8),
      marginBottom: verticalScale(10),
    },
    rowOnly: {
      flexDirection: 'row',
    },
    imageView: {
      borderRadius: normalScale(60),
      height: normalScale(60),
      width: normalScale(60),
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.white,
      marginRight: normalScale(8),
    },
    dummy: {
      height: normalScale(60),
      width: normalScale(60),
      borderRadius: normalScale(60),
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1,
    },
    name: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
    },
    eventName: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      marginBottom: verticalScale(2),
      marginTop: verticalScale(4),
    },
    pillStyle: {
      justifyContent: 'center',
    },
  });
};
