import React from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import {createStyleSheet} from './style';
import {useAppTheme} from '@app-hooks/use-app-theme';
import {InputError} from '@components/input-error';
import {verticalScale} from '@theme/device/normalize';

interface InputProps extends TextInputProps {
  inputStyle?: StyleProp<ViewStyle>;
  isError?: boolean;
  hasMobile?: boolean;
  errorMsg?: string;
  children?: React.ReactNode;
  height?: number;
}

export const Input = (props: InputProps) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);

  const {
    inputStyle,
    isError = false,
    hasMobile = false,
    errorMsg = '',
    children,
    height = verticalScale(52),
    ...remainingProps
  } = props || {};

  let mobileProps = {};
  if (hasMobile) {
    mobileProps = {
      ...mobileProps,
      maxLength: 10,
      keyboardType: 'number-pad',
      returnKeyType: 'done',
    };
  }

  return (
    <View>
      <TextInput
        style={[styles.inputStyle, inputStyle, {height}]}
        placeholderTextColor={theme.colors.lightBlack}
        {...mobileProps}
        {...remainingProps}
      />
      <InputError
        isError={isError}
        errorMsg={errorMsg}
        viewStyle={styles.inputError}
      />
      {children}
    </View>
  );
};
 