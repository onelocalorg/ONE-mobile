/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import moment from "moment";
import React, { useCallback, useState } from "react";
import {
  ListRenderItem,
  Platform,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { DatePickerModal } from "react-native-paper-dates";
import { useDispatch, useSelector } from "react-redux";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { arrowDown, calendar, close, dummy, event, pin } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { Navbar } from "~/components/navbar/Navbar";
import { LOG } from "~/config";
import { navigations } from "~/config/app-navigation/constant";
import { getData } from "~/network/constant";
import { useEventLists } from "~/network/hooks/home-service-hooks/use-event-lists";
import { useUserProfile } from "~/network/hooks/user-service-hooks/use-user-profile";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { EventData } from "~/types/event-data";
import { createStyleSheet } from "./style";

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
  const [profileData, setUserProfile]: any = useState();
  const [eventsList, setEventsList]: any = useState([]);
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

  useFocusEffect(
    useCallback(() => {
      onPageLoad(false);
      setPage(1);
      setSearchQuery("");
      setEventsList([]);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      var tempdataTwo = getData("defaultLocation");
      getEventListAPI(tempdataTwo);
    }, [setFilter, page, range, searchQuery])
  );

  const getEventListAPI = async (getLatitude: any) => {
    LOG.debug("> getEventListAPI");
    if (page === 1) {
      LoadingData(true);
    }

    var eventData = {
      start_date: moment(range.startDate).format("YYYY-MM-DD"),
      end_date: moment(range.endDate).format("YYYY-MM-DD"),
      event_type: setFilter,
      only_upcoming: 0,
      searchtext: searchQuery,
      latitude: getLatitude.latitude,
      longitude: getLatitude.longitude,
      zoom_level: getLatitude.zoomLevel,
      device_type: Platform.OS,
    };
    var eventList_url =
      process.env.API_URL + "/v2/events/list?limit=10&page=" + page;
    LOG.debug(eventList_url);
    LOG.debug(eventData);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(eventList_url, {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(eventData),
      });
      const dataItem = await response.json();
      LOG.debug("getEventListAPI:", dataItem?.data);

      if (page == 1) {
        var dataTemp = [...eventsList, ...dataItem?.data.results];
        setEventsList(dataTemp);
      } else {
        manageSameHeader(dataItem?.data.results);
      }

      setTotalPages(dataItem?.data?.totalPages);
      setCurrentPage(dataItem?.data?.page);
      LoadingData(false);
      onPageLoad(true);
      LOG.debug("< getEventListAPI");
    } catch (error) {
      LOG.error("getEventListAPI", error);
      LoadingData(false);
    }
  };

  function manageSameHeader(newEventArray: any) {
    var oldEventLastIndex = eventsList.length - 1;
    if (
      newEventArray[0]["date_title"] ==
      eventsList[oldEventLastIndex]["date_title"]
    ) {
      var oldEventTempOne = [...eventsList];
      oldEventTempOne[oldEventLastIndex]["events"] = [
        ...eventsList[oldEventLastIndex]["events"],
        ...newEventArray[0]["events"],
      ];
      newEventArray.splice(0, 1);
      setEventsList([...oldEventTempOne, ...newEventArray]);
    } else {
      var dataTempTwo = [...eventsList, ...newEventArray];
      setEventsList(dataTempTwo);
      console.log("not same date display");
    }
  }

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    (res: Range) => {
      const startDate = res?.startDate;
      const endDate = res?.endDate;
      setOpen(false);
      setRange({ startDate, endDate });
      setTotalPages(0);
      setPage(1);
      setEventsList([]);
    },
    [setOpen, setRange, range?.startDate, range?.endDate]
  );

  const onNavigate = (item: EventData) => {
    console.log(route.name);
    navigation?.navigate(navigations.EVENT_DETAIL, { id: item?.id });
  };

  const postDataLoad = () => {
    if (totalPages !== currentPages) {
      setPage(page + 1);
    }
  };

  const toggleSwitch = (value: any) => {
    onPageLoad(false);
    if (isEnabled === false) {
      setEventsList([]);
      setPage(1);
      setIsEnabled(true);
      SetToggleFilter("AO");
    } else {
      setEventsList([]);
      setPage(1);
      setIsEnabled(false);
      SetToggleFilter("VF");
    }
  };

  const renderItem: ListRenderItem<EventData> = ({ item }) => {
    return (
      <View>
        {/* Header */}
        <View style={styles.dateDisplyContainer}>
          <Text style={styles.displayDate}>
            {item?.date_title} {item.day_title}
          </Text>
        </View>

        {item.events.map((subitem: any) => {
          return (
            <TouchableOpacity
              style={styles.listContainer}
              onPress={() => onNavigate(subitem)}
              activeOpacity={0.8}
              key={Math.random()}
              // disabled={disabled}
            >
              <ImageComponent
                resizeMode="stretch"
                uri={subitem.event_image}
                source={dummy}
                isUrl={!!subitem.event_image}
                style={styles.dummy}
              />
              <View style={styles.flex}>
                <View style={styles.rowClass}>
                  <View style={styles.flex}>
                    <Text style={styles.dateText}>
                      {subitem.start_date_label}
                      {" • "}
                      {subitem.start_time_label}
                    </Text>
                    <Text numberOfLines={2} style={styles.title}>
                      {subitem.name}
                    </Text>
                  </View>
                  <ImageComponent source={event} style={styles.event} />
                </View>

                <View style={styles.rowClass}>
                  <ImageComponent source={pin} style={styles.pin} />
                  <Text numberOfLines={1} style={styles.location}>
                    {subitem.address}
                  </Text>
                </View>
                {subitem.cancelled ? (
                  <Text style={styles.cancleText}>CANCELED</Text>
                ) : (
                  <View></View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View>
      <Loader visible={page === 1 && isLoading} showOverlay />
      <Navbar
        navigation={
          navigation as unknown as NavigationContainerRef<ParamListBase>
        }
      />
      <View style={styles.backgroundToggle}>
        <View style={styles.toggleCont}>
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
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.dateContainer}>
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
        </TouchableOpacity>
      </View>

      <FlatList
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollView}
        data={eventsList}
        initialNumToRender={10}
        onEndReached={() => {
          console.log("-------------onEndReached---------------");
          if (loading) {
            onPageLoad(false);
            postDataLoad();
          }
        }}
        onEndReachedThreshold={0.1}
      ></FlatList>
      {eventsList.length === 0 ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.noEventLbl}>{strings.noEventsFound}</Text>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};
