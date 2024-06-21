import { DateTime } from "luxon";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { dummy, event as eventIcon, pin } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { LocalEvent } from "~/types/local-event";
import { createStyleSheet } from "./style";

interface EventCardProps {
  event: LocalEvent;
  disabled?: boolean;
}

export const EventCard = ({ event, disabled = false }: EventCardProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { gotoEventDetails } = useNavigations();

  return (
    <TouchableOpacity
      style={styles.listContainer}
      onPress={gotoEventDetails(event)}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <ImageComponent
        resizeMode="stretch"
        uri={event.image?.url}
        source={dummy}
        isUrl={!!event.image}
        style={styles.dummy}
      />
      <View style={styles.flex}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.dateText}>
              {event.startDate.toLocaleString(DateTime.DATE_MED)}
              {" • "}
              {event.startDate.toLocaleString(DateTime.TIME_SIMPLE)}
            </Text>
            <Text numberOfLines={2} style={styles.title}>
              {event.name}
            </Text>
          </View>
          <ImageComponent source={eventIcon} style={styles.event} />
        </View>

        <View style={styles.row}>
          <ImageComponent source={pin} style={styles.pin} />
          <Text numberOfLines={3} style={styles.location}>
            {event.venue || event.address?.split(",")[0]}
          </Text>
          {/* <ImageComponent style={styles.addressDot} source={activeRadio}></ImageComponent> */}
          {/* <Text style={styles.fullAddress}>{full_address}</Text> */}
        </View>
        {event.isCanceled ? (
          <Text style={styles.cancleText}>CANCELED</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
