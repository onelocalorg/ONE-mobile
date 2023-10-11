import React from 'react';
import {createStyleSheet} from './style';
import {useAppTheme} from '@app-hooks/use-app-theme';
import {Text, View} from 'react-native';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';

export const CalendarScreen = () => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {strings} = useStringsAndLabels();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{strings.comingSoon}</Text>
    </View>
  );
};
