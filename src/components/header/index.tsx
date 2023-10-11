import {arrowLeft, headerBg, headerTitle} from '@assets/images';
import React from 'react';
import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet} from './style';
import {useAppTheme} from '@app-hooks/use-app-theme';
import {ImageComponent} from '@components/image-component';
import {launchCamera} from 'react-native-image-picker';
import {
  UserProfileState,
  onSetCoverImage,
} from '@network/reducers/user-profile-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {StoreType} from '@network/reducers/store';

interface HeaderProps {
  title?: string;
  hasBackButton?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  onBackPress?: () => void;
  fromProfile?: boolean;
}

export const Header = (props: HeaderProps) => {
  const {
    title,
    leftIcon,
    rightIcon,
    children,
    onBackPress,
    hasBackButton,
    fromProfile = false,
  } = props || {};
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {user} = useSelector<StoreType, UserProfileState>(
    state => state.userProfileReducer,
  ) as {user: {coverImage: string}};
  const dispatch = useDispatch();

  const renderBackButton = () => {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onBackPress}>
        <ImageComponent source={arrowLeft} style={styles.arrowLeft} />
      </TouchableOpacity>
    );
  };

  const onUploadImage = async () => {
    const {assets} = await launchCamera({
      mediaType: 'photo',
    });
    if (assets) {
      const img = assets?.[0];
      dispatch(onSetCoverImage(img?.uri ?? ''));
    }
  };

  return (
    <TouchableOpacity
      disabled={!fromProfile}
      activeOpacity={1}
      onPress={onUploadImage}
      style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        source={user?.coverImage ? {uri: user?.coverImage} : headerBg}
        style={styles.imageContainer}>
        <View style={styles.row}>
          <View>{leftIcon || (hasBackButton && renderBackButton())}</View>
          <ImageComponent source={headerTitle} style={styles.image} />
          {!!title && <Text>{title}</Text>}
          <View>{rightIcon}</View>
        </View>
        {children}
      </ImageBackground>
    </TouchableOpacity>
  );
};
