/* eslint-disable react-hooks/exhaustive-deps */
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import { DateTime } from "luxon";
import React, { useEffect, useRef, useState } from "react";
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
import { ModalRefProps } from "~/components/modal-component";
import { Navbar } from "~/components/navbar/Navbar";
import { SizedBox } from "~/components/sized-box";
import { navigations } from "~/config/app-navigation/constant";
import {
  eventResponseToLocalEvent,
  fetchEvent,
} from "~/network/api/services/event-service";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { verticalScale } from "~/theme/device/normalize";
import { LocalEvent } from "~/types/local-event";
import { Rsvp } from "./Rsvp";
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
  const modalRef: React.Ref<ModalRefProps> = useRef(null);
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { stripeCustomerId: string; user_type: string; id: string } };
  const [event, setEvent] = useState<LocalEvent>();
  // const { refetch, isLoading, isRefetching, data } = useEventDetails(eventId);

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId).then(eventResponseToLocalEvent).then(setEvent);
    }
  }, [eventId]);

  // useFocusEffect(
  //   useCallback(() => {
  //     getUserProfileAPI();
  //     eventViewAPI();
  //     refetch();
  //   }, [])
  // );

  // async function eventViewAPI() {
  //   // LodingData(true);
  //   const token = await AsyncStorage.getItem("token");

  //   try {
  //     const response = await fetch(
  //       process.env.API_URL + "/v1/events/event-count/" + eventId,
  //       // process.env.API_URL + '/v1/events/event-count/6565af618267f45414608d66',
  //       {
  //         method: "post",
  //         headers: new Headers({
  //           Authorization: "Bearer " + token,
  //           "Content-Type": "application/json",
  //         }),
  //       }
  //     );

  //     const dataItem = await response.json();
  //     // LodingData(false);
  //     console.log("=========== eventViewAPI response==============");
  //     console.log("eventId....................", response);
  //     console.log(dataItem);
  //   } catch (error) {
  //     console.error(error);
  //     // LodingData(false);
  //   }
  // }

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
                    event.event_image
                      ? { uri: event.event_image }
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
                    {event.start_date.toLocaleString(DateTime.DATE_MED)}
                  </Text>
                  <Text style={styles.time}>
                    {event.start_date.toLocaleString(DateTime.TIME_SIMPLE)}
                  </Text>
                </View>
              </View>
              <View style={[styles.row, styles.marginTop]}>
                <View style={[styles.circularView, styles.yellow]}>
                  <ImageComponent source={pinWhite} style={styles.pinWhite} />
                </View>
                <View style={styles.margin}>
                  <Text style={styles.date}>{event.address}</Text>
                  <Text style={styles.time}>{event.full_address}</Text>
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
                <Tickets event={event} />
                <Rsvp eventId={eventId} />
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
