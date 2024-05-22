/* eslint-disable react-hooks/exhaustive-deps */
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import { DateTime } from "luxon";
import React, { useCallback, useState } from "react";
import { ListRenderItem, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { EventItem } from "~/components/events/EventItem";
import { Loader } from "~/components/loader";
import { Navbar } from "~/components/navbar/Navbar";
import { navigations } from "~/config/app-navigation/constant";
import {
  featureCollectionToLocalEvents,
  fetchEvents,
} from "~/network/api/services/event-service";
import { useEventLists } from "~/network/hooks/home-service-hooks/use-event-lists";
import { useUserProfile } from "~/network/hooks/user-service-hooks/use-user-profile";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { LocalEvent } from "~/types/local-event";
import { LocalEventData } from "~/types/local-event-data";
import { createStyleSheet } from "./style";

const BOULDER_LON = -105.2705;
const BOULDER_LAT = 40.015;
const DEFAULT_ZOOM = 12;

interface Range {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface EventListScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const EventListScreen = (props: EventListScreenProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const { navigation } = props || {};
  var makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() + 1);
  const [range, setRange] = useState<Range>({
    startDate: new Date(),
    endDate: makeDate,
  });
  const [open, setOpen] = useState(false);
  const [profileData, setUserProfile] = useState();
  const [eventsList, setEventsList] = useState<LocalEvent[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPage] = useState(0);
  const { mutateAsync } = useEventLists();
  const [isLoading, LoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [setFilter, SetToggleFilter] = useState("VF");
  const [loading, onPageLoad] = useState(true);
  const route = useRoute();
  const [isEnabled, setIsEnabled] = useState(false);
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { id: string; pic: string } };
  const { refetch } = useUserProfile({
    userId: user?.id,
  });

  const dispatch = useDispatch();

  // useEffect(() => {
  //   fetchEvents({ startDate: DateTime.now() })
  //     .then(featureCollectionToLocalEvents)
  //     .then(setEventsList);
  // }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEvents({ startDate: DateTime.now() })
        .then(featureCollectionToLocalEvents)
        .then(setEventsList);
    }, [])
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     var tempdataTwo = getData("defaultLocation");
  //     getEventListAPI();
  //   }, [setFilter, page, range, searchQuery])
  // );

  // const getEventListAPI = async () => {
  //   LOG.debug("> getEventListAPI");
  //   if (page === 1) {
  //     LoadingData(true);
  //   }

  //   var eventList_url = `${
  //     process.env.API_URL
  //   }/v2/events/list?start_date=${DateTime.now().toISO()}`;
  //   LOG.debug(eventList_url);
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     const response = await fetch(eventList_url, {
  //       headers: new Headers({
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //       }),
  //     });
  //     const dataItem = await response.json();
  //     LOG.debug("events:", dataItem?.data);

  //     setEventsList(dataItem?.data.events);

  //     // if (page == 1) {
  //     //   var dataTemp = [...eventsList, ...dataItem?.data.results];
  //     //   setEventsList(dataTemp);
  //     // } else {
  //     //   manageSameHeader(dataItem?.data.results);
  //     // }

  //     setTotalPages(dataItem?.data?.totalPages);
  //     setCurrentPage(dataItem?.data?.page);
  //     LoadingData(false);
  //     onPageLoad(true);
  //     LOG.debug("< getEventListAPI");
  //   } catch (error) {
  //     LOG.error("getEventListAPI", error);
  //     LoadingData(false);
  //   }
  // };

  // function manageSameHeader(newEventArray: any) {
  //   var oldEventLastIndex = eventsList.length - 1;
  //   if (
  //     newEventArray[0]["date_title"] ==
  //     eventsList[oldEventLastIndex]["date_title"]
  //   ) {
  //     var oldEventTempOne = [...eventsList];
  //     oldEventTempOne[oldEventLastIndex]["events"] = [
  //       ...eventsList[oldEventLastIndex]["events"],
  //       ...newEventArray[0]["events"],
  //     ];
  //     newEventArray.splice(0, 1);
  //     setEventsList([...oldEventTempOne, ...newEventArray]);
  //   } else {
  //     var dataTempTwo = [...eventsList, ...newEventArray];
  //     setEventsList(dataTempTwo);
  //     console.log("not same date display");
  //   }
  // }

  // const onDismiss = useCallback(() => {
  //   setOpen(false);
  // }, [setOpen]);

  // const onConfirm = useCallback(
  //   (res: Range) => {
  //     const startDate = res?.startDate;
  //     const endDate = res?.endDate;
  //     setOpen(false);
  //     setRange({ startDate, endDate });
  //     setTotalPages(0);
  //     setPage(1);
  //     setEventsList([]);
  //   },
  //   [setOpen, setRange, range?.startDate, range?.endDate]
  // );

  const onNavigate = (item: LocalEventData) => {
    console.log(route.name);
    navigation?.navigate(navigations.EVENT_DETAIL, { id: item?.id });
  };

  // const postDataLoad = () => {
  //   if (totalPages !== currentPages) {
  //     setPage(page + 1);
  //   }
  // };

  // const toggleSwitch = (value: any) => {
  //   onPageLoad(false);
  //   if (isEnabled === false) {
  //     setEventsList([]);
  //     setPage(1);
  //     setIsEnabled(true);
  //     SetToggleFilter("AO");
  //   } else {
  //     setEventsList([]);
  //     setPage(1);
  //     setIsEnabled(false);
  //     SetToggleFilter("VF");
  //   }
  // };

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
      <Navbar navigation={navigation} />
      <Loader visible={page === 1 && isLoading} showOverlay />
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
