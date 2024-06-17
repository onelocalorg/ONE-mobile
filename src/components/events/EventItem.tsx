import { DateTime } from "luxon";
import { Image, Pressable, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { pin } from "~/assets/images";
import { LOG } from "~/config";
import { LocalEvent } from "~/types/local-event";
import { createStyleSheet } from "./style";

interface EventItemProps {
  event: LocalEvent;
  onPress?: (event: LocalEvent) => void;
  style?: any;
}

export const EventItem = ({ event, onPress, style }: EventItemProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  LOG.debug(": EventItem:", event);

  return (
    <Pressable
      style={style ?? styles.listContainer}
      onPress={() => onPress?.(event)}
    >
      <Image
        resizeMode="stretch"
        source={
          event.image
            ? { uri: event?.image }
            : require("~/assets/images/defaultEvent.png")
        }
        style={styles.dummy}
      />
      <View style={styles.flex}>
        <View style={styles.rowClass}>
          <View style={styles.flex}>
            <Text style={styles.dateText}>
              {event.startDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} •{" "}
              {event.startDate.toLocaleString(DateTime.TIME_SIMPLE)}
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
            {event.venue || event.address?.split(",")[0]}
          </Text>
        </View>
        {event.isCanceled ? (
          <Text style={styles.cancleText}>CANCELED</Text>
        ) : (
          <View></View>
        )}
      </View>
    </Pressable>
  );
};
