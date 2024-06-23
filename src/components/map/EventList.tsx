import { View } from "react-native";
import Swiper from "react-native-swiper";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { LocalEvent } from "~/types/local-event";
import { EventInfo } from "./EventInfo";
import { createStyleSheet } from "./style";

interface EventListProps {
  eventList: LocalEvent[];
}
export const EventList = ({ eventList }: EventListProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  // {eventData != undefined && eventData.length > 0 ? (
  <View style={styles.avatarContainer}>
    <Swiper
      onIndexChanged={(value) => {
        changeMarkerColor(value);
        // onswipeSetEventIndex(value);
      }}
      // ref={mileStoneSwiperRef}
      loop={false}
      // centeredSlides={false}
      showsPagination={false}
      bounces={true}
      removeClippedSubviews={false}
    >
      {eventList.map((eventData: any) => EventInfo(eventData))}
    </Swiper>
  </View>;

  const changeMarkerColor = (indexMarker: any) => {
    const resultTemp: any = [...eventList];
    for (let index = 0; index < resultTemp.length; index++) {
      resultTemp[index].isActive = false;
    }
    if (resultTemp.length > indexMarker) {
      resultTemp[indexMarker].isActive = true;
    }

    // eventDataStore(resultTemp);
  };
};
