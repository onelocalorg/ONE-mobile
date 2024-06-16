/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { EventItem } from "~/components/events/EventItem";
import { Loader } from "~/components/loader";
import { EventsStackScreenProps, Screens } from "~/navigation/types";
import { useEventService } from "~/network/api/services/event-service";
import { LocalEvent } from "~/types/local-event";
import { handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";

export const EventListScreen = ({
  navigation,
}: EventsStackScreenProps<Screens.EVENTS_LIST>) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() + 1);
  const [isLoading, setLoading] = useState(false);

  const { listEvents } = useEventService();

  const {
    isPending,
    isError,
    data: eventsList,
    error,
  } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: () => listEvents({ startDate: DateTime.now() }),
  });
  if (isPending !== isLoading) setLoading(isPending);
  if (isError) handleApiError("Profile", error);

  const onNavigate = (item: LocalEvent) => {
    navigation.push(Screens.EVENT_DETAIL, { id: item.id });
  };

  const renderLocalEvent: ListRenderItem<LocalEvent> = ({ item }) => {
    return (
      <View>
        {/* Header */}
        {/* <View style={styles.dateDisplyContainer}>
          <Text style={styles.displayDate}>
            {item?.date_title} {item.day_title}
          </Text>
        </View> */}
        <EventItem
          style={styles.listContainer}
          event={item}
          onPress={() => onNavigate(item)}
        />
        {/* <TouchableOpacity
          style={styles.listContainer}
          onPress={() => onNavigate(item)}
          activeOpacity={0.8}
          key={Math.random()}
          // disabled={disabled}
        >
          <ImageComponent
            resizeMode="stretch"
            uri={item.event_image}
            source={dummy}
            isUrl={!!item.event_image}
            style={styles.dummy}
          />
          <View style={styles.flex}>
            <View style={styles.rowClass}>
              <View style={styles.flex}>
                <Text style={styles.dateText}>
                  {item.start_date_label}
                  {" • "}
                  {item.start_time_label}
                </Text>
                <Text numberOfLines={2} style={styles.title}>
                  {item.name}
                </Text>
              </View>
              <ImageComponent source={event} style={styles.event} />
            </View>

            <View style={styles.rowClass}>
              <ImageComponent source={pin} style={styles.pin} />
              <Text numberOfLines={1} style={styles.location}>
                {item.address || item.full_address?.split(",")[0]}
              </Text>
            </View>
            {item.cancelled ? (
              <Text style={styles.cancleText}>CANCELED</Text>
            ) : (
              <View></View>
            )}
          </View>
        </TouchableOpacity> */}
      </View>
    );
  };

  return (
    <View>
      <Loader visible={isLoading} showOverlay />
      <View style={styles.backgroundToggle}>
        {/* <View style={styles.toggleCont}>
          <Text style={styles.villageLbl}>Village Friendly </Text>
          <View style={styles.switchToggle}>
            {Platform.OS === "ios" ? (
              <Switch
                style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.5 }] }}
                thumbColor={"white"}
                ios_backgroundColor="#008000"
                onChange={() => toggleSwitch(isEnabled)}
                value={isEnabled}
              />
            ) : (
              <Switch
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.0 }] }}
                trackColor={{ false: "#008000", true: "#008000" }}
                thumbColor={"white"}
                ios_backgroundColor="#008000"
                onChange={() => toggleSwitch(isEnabled)}
                value={isEnabled}
              />
            )}
          </View>
          <Text style={styles.villageLbl}> Adult Oriented</Text>
        </View> */}
        {/* <TouchableOpacity activeOpacity={0.8} style={styles.dateContainer}>
          <ImageComponent source={calendar} style={styles.calendar} />
          <TouchableOpacity activeOpacity={0.8} onPress={() => setOpen(true)}>
            <Text style={styles.date}>{`${moment(range?.startDate).format(
              "MMM DD, YYYY"
            )} - ${moment(range?.endDate).format("MMM DD, YYYY")}`}</Text>
          </TouchableOpacity>

          <DatePickerModal
            locale="en"
            mode="range"
            visible={open}
            onDismiss={onDismiss}
            startDate={range.startDate}
            endDate={range.endDate}
            onConfirm={onConfirm}
            validRange={{ startDate: new Date() }}
            closeIcon={close}
            editIcon={close}
            calendarIcon={close}
          />

          <ImageComponent source={arrowDown} style={styles.arrowDown} />
        </TouchableOpacity> */}
      </View>

      <FlatList
        renderItem={renderLocalEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollView}
        data={eventsList}
        // initialNumToRender={10}
        // onEndReached={() => {
        //   console.log("-------------onEndReached---------------");
        //   if (loading) {
        //     onPageLoad(false);
        //     postDataLoad();
        //   }
        // }}
        // onEndReachedThreshold={0.1}
      ></FlatList>
      {!isLoading && eventsList?.length === 0 ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.noEventLbl}>{strings.noEventsFound}</Text>
        </View>
      ) : null}
    </View>
  );
};
