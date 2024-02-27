import React from 'react';
import {useAppTheme} from '@app-hooks/use-app-theme';
import {Linking, Text, View} from 'react-native';
import {createStyleSheet} from './style';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {ButtonComponent} from '@components/button-component';

export const AppUpdate = () => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {strings} = useStringsAndLabels();

  const onOpenAppStore = () => {
    const link = 'itms-apps://itunes.apple.com/app/id/1534246640';
    Linking.canOpenURL(link).then(supported => {
      supported && Linking.openURL(link); 
    }, (err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.updateAvailable}</Text>
      <ButtonComponent onPress={onOpenAppStore} title={strings.updateApp} />
    </View>
  );
};
