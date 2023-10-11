import {useAppTheme} from '@app-hooks/use-app-theme';
import {getTheme} from '@theme/index';
import React, {FC} from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';
import {ImageComponent} from '../image-component';
import {createStyleSheet} from './style';
import {error} from '@assets/images';

export interface InputErrorProps {
  errorMsg?: string;
  image?: number;
  viewStyle?: StyleProp<ViewStyle>;
  isError?: boolean;
}

export const InputError: FC<InputErrorProps> = props => {
  const {errorMsg, image, viewStyle, isError} = props;
  const {themeType} = useAppTheme();
  const theme = getTheme(themeType);
  const styles = createStyleSheet(theme);

  if (!isError) {
    return null;
  }

  return (
    <View style={[styles.container, viewStyle]}>
      <ImageComponent source={image || error} style={styles.errorIcon} />
      <Text style={styles.text}>{errorMsg}</Text>
    </View>
  );
};
