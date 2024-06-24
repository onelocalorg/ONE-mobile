import { DateTime } from "luxon";
import { Image, Pressable, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { pin } from "~/assets/images";
import { Mappable } from "~/types/mappable";
import { createStyleSheet } from "../../components/events/style";

interface MapCardProps {
  item: Mappable;
  onPress?: () => void;
}

export const MapCard = ({ item, onPress }: MapCardProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const forceDateTime = (v: unknown) =>
    v instanceof DateTime ? v : DateTime.fromISO(v as string);

  return (
    <Pressable style={styles.listContainer} onPress={onPress}>
      {item.image && (
        <Image
          resizeMode="stretch"
          source={
            item.image
              ? { uri: item?.image.url }
              : require("~/assets/images/defaultEvent.png")
          }
          style={styles.dummy}
        />
      )}
      <View style={styles.flex}>
        <View style={styles.rowClass}>
          <View style={styles.flex}>
            <Text style={styles.dateText}>
              {item.startDate && (
                <>
                  {forceDateTime(item.startDate).toLocaleString()} •{" "}
                  {forceDateTime(item.startDate).toLocaleString(
                    DateTime.TIME_SIMPLE
                  )}
                </>
              )}
            </Text>
            <Text numberOfLines={2} style={styles.title}>
              {item.name}
            </Text>
          </View>
          {/* <Image source={item} style={styles.item} /> */}
        </View>

        <View style={styles.rowClass}>
          <Image source={pin} style={styles.pin} />
          <Text numberOfLines={1} style={styles.location}>
            {item.venue || item.address?.split(",")[0]}
          </Text>
        </View>
        {/* {item.isCanceled ? (
          <Text style={styles.cancleText}>CANCELED</Text>
        ) : (
          <View></View>
        )} */}
      </View>
    </Pressable>
  );
};
