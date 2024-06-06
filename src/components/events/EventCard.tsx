import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { dummy, event, pin } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { LocalEventData } from "~/types/local-event-data";
import { createStyleSheet } from "./style";

interface EventCardProps {
  data: LocalEventData;
  onPress?: () => void;
  disabled?: boolean;
}

export const EventCard = ({
  data,
  onPress,
  disabled = false,
}: EventCardProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { eventImage } = data;

  return (
    <TouchableOpacity
      style={styles.listContainer}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <ImageComponent
        resizeMode="stretch"
        uri={eventImage}
        source={dummy}
        isUrl={!!eventImage}
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
