import { DateTime } from "luxon";
import { Image, Pressable, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { LocalEventData } from "~/types/local-event-data";
import { createStyleSheet } from "./style";

interface EventProps {
  event: LocalEventData;
}

export const EventInfo = ({ event }: EventProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  return (
    <Pressable
      style={styles.listContainer}
      // FIXME
      //   onPress={() => onNavigateEventDetail(eventData)}
    >
      <Image
        resizeMode="stretch"
        source={
          event?.event_image
            ? { uri: event?.event_image }
            : require("~/assets/images/defaultEvent.png")
        }
        style={styles.dummy}
      />
      <View style={styles.flex}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.dateText}>
              {event?.start_date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}{" "}
              • {event?.start_date.toLocaleString(DateTime.TIME_SIMPLE)}
            </Text>
            <Text numberOfLines={2} style={styles.title}>
              {event?.name}
            </Text>
          </View>
          {/* <Image
            source={event.event_image ? event.event_image : defaultImage}
            style={styles.event}
          /> */}
        </View>
        <View style={styles.row}>
          {/* <Image source={pin} style={styles.pin} /> */}
          <Text style={styles.location}>{event?.address}</Text>
          {/* <Image style={styles.addressDot} source={activeRadio}></Image> */}
          <Text numberOfLines={1} style={styles.fullAddress}>
            {event?.full_address}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
