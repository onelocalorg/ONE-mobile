import { useAppTheme } from "~/app-hooks/use-app-theme";
import React from "react";
import { createStyleSheet } from "./style";
import { Text, TouchableOpacity, View } from "react-native";
import { ImageComponent } from "~/components/image-component";
import { activeRadio, dummy, event, pin } from "~/assets/images";
import { EventData } from "~/network/hooks/home-service-hooks/use-event-lists";
import moment from "moment";

interface EventListProps {
  data: EventData;
  onPress?: () => void;
  disabled?: boolean;
}

export const EventList = (props: EventListProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { data, onPress, disabled = false } = props || {};
  const {
    start_date,
    address,
    name,
    event_image,
    full_address,
    cancelled,
    start_date_label,
    start_time_label,
  } = data || {};

  return (
    <TouchableOpacity
      style={styles.listContainer}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
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
            <Text style={styles.dateText}>
              {start_date_label}
              {" • "}
              {start_time_label}
            </Text>
            <Text numberOfLines={2} style={styles.title}>
              {name}
            </Text>
          </View>
          <ImageComponent source={event} style={styles.event} />
        </View>

        <View style={styles.row}>
          <ImageComponent source={pin} style={styles.pin} />
          <Text numberOfLines={3} style={styles.location}>
            {address || full_address?.split(",")[0]}
          </Text>
          {/* <ImageComponent style={styles.addressDot} source={activeRadio}></ImageComponent> */}
          {/* <Text style={styles.fullAddress}>{full_address}</Text> */}
        </View>
        {cancelled ? <Text style={styles.cancleText}>CANCELED</Text> : <></>}
      </View>
    </TouchableOpacity>
  );
};
