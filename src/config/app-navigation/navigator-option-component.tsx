import {useAppTheme} from '@app-hooks/use-app-theme';
import {ImageComponent} from '@components/image-component';
import React from 'react';
import {StyleProp, View} from 'react-native';
import {ImageStyle} from 'react-native-fast-image';
import {createStyleSheet} from './style';

export interface NavigatorOptionProps {
  focused: boolean;
  selectedImage: number;
  unSelectedImage: number;
  iconStyle?: StyleProp<ImageStyle>;
}

export const NavigatorOptionComponent = (props: NavigatorOptionProps) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {
    focused = false,
    selectedImage,
    unSelectedImage,
    iconStyle,
  } = props || {};

  return (
    <View style={styles.innerContainer}>
      <ImageComponent
        source={focused ? selectedImage : unSelectedImage}
        style={[styles.icon, iconStyle]}
      />
    </View>
  );
};
