import {useAppTheme} from '@app-hooks/use-app-theme';
import React from 'react';
import {createStyleSheet} from './style';
import {Text, TouchableOpacity, View} from 'react-native';
import {ImageComponent} from '@components/image-component';
import {dummy, event, pin} from '@assets/images';
import {Result} from '@network/hooks/home-service-hooks/use-event-lists';
import moment from 'moment';

interface EventListProps {
  data: Result;
  onPress?: () => void;
  disabled?: boolean;
}

export const EventList = (props: EventListProps) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {data, onPress, disabled = false} = props || {};
  const {start_date, address, name, event_image} = data || {};

  return (
    <TouchableOpacity
      style={styles.listContainer}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}>
      <ImageComponent
        resizeMode="stretch"
        uri={event_image}
        source={dummy}
        isUrl={!!event_image}
        style={styles.dummy}
      />
      <View style={styles.flex}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.dateText}>{`${moment(start_date).format(
              'ddd, MMM DD',
            )} • ${moment(start_date).format('hh:mm A')}`}</Text>
            <Text style={styles.title}>{name}</Text>
          </View>
          <ImageComponent source={event} style={styles.event} />
        </View>
        <View style={styles.row}>
          <ImageComponent source={pin} style={styles.pin} />
          <Text style={styles.location}>{address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
