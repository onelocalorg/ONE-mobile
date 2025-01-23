import { DateTime } from "luxon";
import { Image, Pressable, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { LocalEvent } from "~/types/local-event";
import { createStyleSheet } from "./style";

interface EventProps {
  event: LocalEvent;
}

export const EventInfo = ({ event }: EventProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { gotoEventDetails } = useNavigations();

  return (
    <Pressable style={styles.listContainer} onPress={gotoEventDetails(event)}>
      <Image
        resizeMode="stretch"
        source={
          event?.images && event.images.length > 0
            ? { uri: event?.images[0] }
            : require("~/assets/images/defaultEvent.png")
        }
        style={styles.dummy}
      />
      <View style={styles.flex}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.dateText}>
              {event?.startDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}{" "}
              • {event?.startDate.toLocaleString(DateTime.TIME_SIMPLE)}
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
            {event?.address}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
