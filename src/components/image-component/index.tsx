import {contain, cover, stretch} from '@assets/constants';
import React, {FC} from 'react';
import {StyleProp} from 'react-native';
import FastImage, {FastImageProps, ImageStyle} from 'react-native-fast-image';
import {SvgUri} from 'react-native-svg';

export interface ImageProps extends FastImageProps {
  style?: StyleProp<ImageStyle>;
  isUrl?: boolean;
  uri?: string;
  hide?: boolean;
}

export const ImageComponent: FC<ImageProps> = props => {
  const {
    style,
    resizeMode = contain,
    isUrl = false,
    source,
    hide = false,
    uri,
    ...remainingProps
  } = props;
  let src = source;
  let isSvg = false;

  if (isUrl) {
    const uriArray = uri?.split('.') || [];

    if (uriArray[uriArray.length - 1] === 'svg') {
      isSvg = true;
    } else {
      src = {
        uri,
        priority: FastImage.priority.normal,
      };
    }
  }

  function getResizeMode() {
    switch (resizeMode) {
      case stretch:
        return FastImage.resizeMode.stretch;
      case cover:
        return FastImage.resizeMode.cover;
      default:
        return FastImage.resizeMode.contain;
    }
  }

  if (hide) {
    return null;
  }

  if (isSvg) {
    return <SvgUri uri={uri as string} style={style} />;
  }

  return (
    <FastImage
      style={style}
      source={src}
      resizeMode={getResizeMode()}
      {...remainingProps}
    />
  );
};
