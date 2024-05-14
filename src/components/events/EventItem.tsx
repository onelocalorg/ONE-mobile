import { DateTime } from "luxon";
import { Image, Pressable, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { pin } from "~/assets/images";
import { LocalEventData } from "~/types/local-event-data";
import { createStyleSheet } from "./style";

interface EventItemProps {
  event: LocalEventData;
  onPressed?: () => void;
}

export const EventItem = ({ event, onPressed }: EventItemProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  return (
    <Pressable style={styles.listContainer} onPress={onPressed}>
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
        <View style={styles.rowClass}>
          <View style={styles.flex}>
            <Text style={styles.dateText}>
              {event?.start_date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}{" "}
              • {event?.start_date.toLocaleString(DateTime.TIME_SIMPLE)}
            </Text>
            <Text numberOfLines={2} style={styles.title}>
              {event.name}
            </Text>
          </View>
          {/* <Image source={event} style={styles.event} /> */}
        </View>

        <View style={styles.rowClass}>
          <Image source={pin} style={styles.pin} />
          <Text numberOfLines={1} style={styles.location}>
            {event.address || event.full_address?.split(",")[0]}
          </Text>
        </View>
        {event.isCancelled ? (
          <Text style={styles.cancleText}>CANCELED</Text>
        ) : (
          <View></View>
        )}
      </View>
    </Pressable>
  );
};