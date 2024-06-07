/* eslint-disable react-hooks/exhaustive-deps */
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { calendarTime, pinWhite } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { Navbar } from "~/components/navbar/Navbar";
import { SizedBox } from "~/components/sized-box";
import { navigations } from "~/config/app-navigation/constant";
import {
  getEvent,
  listRsvps,
  updateRsvp,
} from "~/network/api/services/event-service";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { verticalScale } from "~/theme/device/normalize";
import { LocalEvent } from "~/types/local-event";
import { OneUser } from "~/types/one-user";
import { RsvpList, RsvpType } from "~/types/rsvp";
import { handleApiError } from "~/utils/common";
import { RsvpView } from "./RsvpView";
import { Tickets } from "./Tickets";
import { createStyleSheet } from "./style";

interface EventDetailScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      id: string;
    };
  };
}

export const EventDetailScreen = ({
  navigation,
  route,
}: EventDetailScreenProps) => {
  const eventId = route?.params.id;
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { user_type: string; id: string } };
  const [event, setEvent] = useState<LocalEvent>();
  const [rsvpData, setRsvpData] = useState<RsvpList>();

  // const { refetch, isLoading, isRefetching, data } = useEventDetails(eventId);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
      fetchRsvpData();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const event = await getEvent(eventId!);
      setEvent(event);
    } catch (e) {
      handleApiError("Failed getting Event", e);
    }
  };

  const fetchRsvpData = async () => {
    try {
      const rsvps = await listRsvps(eventId!);
      setRsvpData(rsvps);
    } catch (e) {
      handleApiError("Failed getting RSVPs", e);
    }
  };

  const onNavigateToProducerProfile = () => {
    // if (event?.is_event_owner) {
    navigation?.navigate(navigations.PROFILE);
    // } else {
    //   AsyncStorage.setItem("recentUserId", event?.eventProducer?.id);
    //   navigation?.navigate(navigations.RECENTUSERPROFILE);
    // }
  };

  const handleEditEvent = () => {
    navigation?.navigate(navigations.ADMIN_TOOLS, { eventData: event });
  };

  const addGoingRsvp = () => {
    if (
      eventId &&
      rsvpData?.rsvps.find((r) => r.guest.id === user.id)?.rsvp !==
        RsvpType.GOING
    ) {
      updateRsvp(eventId, RsvpType.GOING).then(fetchRsvpData);
    }
  };

  const navigateToUserProfile = (user: OneUser) => {
    // FIXME This works, but the type is incorrect on the navigator
    navigation?.push(navigations.RECENTUSERPROFILE, { userId: user.id });
  };

  return (
    <View>
      <Navbar navigation={navigation} />
      <Loader visible={!event} showOverlay />
      {event ? (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Pressable onPress={() => console.log("click")}>
            <View style={styles.container}>
              <Text style={styles.title}>{event.name}</Text>
              <SizedBox height={verticalScale(16)} />
              <View style={{ position: "relative" }}>
                <Image
                  resizeMode="cover"
                  source={
                    event.eventImage
                      ? { uri: event.eventImage }
                      : require("~/assets/images/defaultEvent.png")
                  }
                  style={styles.eventImage}
                />

                {/* <View style={{position:'absolute',bottom:-10,width:165,height:34,backgroundColor:'#DA9791',alignSelf:'center',borderRadius:7,justifyContent:'center'}}>
              <TouchableOpacity style={{width:46,height:15,backgroundColor:'black',justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'white',textAlign:'center',justifyContent:'center',alignItems:'center',alignSelf:'center'}}>hello</Text>
              </TouchableOpacity>
            </View> */}
              </View>
              <SizedBox height={verticalScale(35)} />
              <View style={styles.row}>
                <View style={styles.circularView}>
                  <ImageComponent
                    source={calendarTime}
                    style={styles.calendarTime}
                  />
                </View>
                <View style={styles.margin}>
                  <Text style={styles.date}>
                    {event.startDate.toLocaleString(DateTime.DATE_MED)}
                  </Text>
                  <Text style={styles.time}>
                    {event.startDate.toLocaleString(DateTime.TIME_SIMPLE)}
                  </Text>
                </View>
              </View>
              <View style={[styles.row, styles.marginTop]}>
                <View style={[styles.circularView, styles.yellow]}>
                  <ImageComponent source={pinWhite} style={styles.pinWhite} />
                </View>
                <View style={styles.margin}>
                  <Text style={styles.date}>{event.address}</Text>
                  <Text style={styles.time}>{event.fullAddress}</Text>
                </View>
              </View>
              <View style={[styles.row, styles.marginTop]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onNavigateToProducerProfile}
                >
                  <ImageComponent
                    resizeMode="cover"
                    source={{ uri: event.eventProducer?.pic }}
                    style={styles.dummy}
                  />
                </TouchableOpacity>
                <View style={styles.margin}>
                  <Text
                    style={styles.date}
                  >{`${event.eventProducer?.first_name} ${event.eventProducer?.last_name}`}</Text>
                  <Text style={styles.time}>
                    {user?.user_type === "player"
                      ? strings.player
                      : strings.producer}
                  </Text>
                </View>
              </View>
              <SizedBox height={verticalScale(30)} />
              <Text style={styles.event}>{strings.aboutEvent}</Text>
              <Text style={styles.desc}>{event.about}</Text>
            </View>

            {eventId ? (
              <>
                <Tickets
                  event={event}
                  onTicketPurchased={() => addGoingRsvp()}
                />
                {rsvpData ? (
                  <RsvpView
                    event={event}
                    rsvpData={rsvpData}
                    onUserPressed={navigateToUserProfile}
                    onRsvpsChanged={() => fetchRsvpData()}
                  />
                ) : null}
              </>
            ) : null}
            {event.is_event_owner ? (
              <ButtonComponent
                title={strings.adminTools}
                onPress={handleEditEvent}
              />
            ) : (
              <></>
            )}
          </Pressable>
        </ScrollView>
      ) : null}
    </View>
  );
};
