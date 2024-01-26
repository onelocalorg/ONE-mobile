import React from 'react';
import {useAppTheme} from '@app-hooks/use-app-theme';
import {Linking, Text, View} from 'react-native';
import {createStyleSheet} from './style';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {ButtonComponent} from '@components/button-component';
import {appStoreLink} from '@assets/constants';

export const AppUpdate = () => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {strings} = useStringsAndLabels();

  const onOpenAppStore = () => {
    Linking.openURL(appStoreLink);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.updateAvailable}</Text>
      <ButtonComponent onPress={onOpenAppStore} title={strings.updateApp} />
    </View>
  );
};
