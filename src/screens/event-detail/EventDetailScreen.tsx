/* eslint-disable react-hooks/exhaustive-deps */
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from "@react-navigation/native";
import { DateTime } from "luxon";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
import { getData } from "~/network/constant";
import { usePurchaseTicket } from "~/network/hooks/home-service-hooks/use-purchase-ticket";
import { useCreatePayoutIntent } from "~/network/hooks/payment-service-hooks/use-create-payout-intent";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { verticalScale } from "~/theme/device/normalize";
import { LocalEvent } from "~/types/local-event";
import { Rsvp } from "./Rsvp";
import { createStyleSheet } from "./style";

interface EventDetailScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      id: string;
    };
  };
}

interface RSVP {
  _id: string;
  rsvp: string;
  user_id: {
    first_name: string;
    last_name: string;
    pic: string;
    id: string;
  };
}

interface RsvpData {
  success: boolean;
  code: number;
  message: string;
  data: {
    rsvps: RSVP[];
    going: number;
    interested: number;
    cantgo: number;
  };
}

interface User {
  id: string;
}

export const EventDetailScreen = (props: EventDetailScreenProps) => {
  const eventId = props.route?.params.id;
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const { navigation, route } = props || {};
  const [Loading, LodingData] = useState(false);
  const styles = createStyleSheet(theme);
  const modalRef: React.Ref<ModalRefProps> = useRef(null);
  const [showLoader, LoadingData] = useState(false);
  const [isTicketAvailable, setIsTicketAvailable] = useState(false);
  const [rsvpData, setRsvpData] = useState<RsvpData | null>(null);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { stripeCustomerId: string; user_type: string; id: string } };
  const [event, setEvent] = useState<LocalEvent>();
  // const { refetch, isLoading, isRefetching, data } = useEventDetails(eventId);

  const { mutateAsync: createPayoutIntent } = useCreatePayoutIntent();
  const { mutateAsync: purchaseTicket, isLoading: purchaseTicketLoading } =
    usePurchaseTicket();
  const [searchQuery, setSearchQuery] = useState("");
  const isShowPaymentCheck = getData("isShowPaymentFlow");
  const [issLoading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId).then(eventResponseToLocalEvent).then(setEvent);
    }
  }, [eventId]);

  useFocusEffect(
    useCallback(() => {
      // const ticketLength = event?.ticketTypes.filter(
      //   (ele) => !ele?.is_ticket_purchased
      // )?.length;
      if (event && event.ticketTypes.length > 0) {
        setIsTicketAvailable(true);
      } else {
        setIsTicketAvailable(false);
      }
    }, [event])
  );

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
      <Navbar navigation={props.navigation} />
      <Loader visible={!event} showOverlay />
      {event ? (
        <ScrollView contentContainerStyle={styles.scrollView}>
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
              {/* <Tickets event={event} /> */}
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
        </ScrollView>
      ) : null}
      {/* {event ? (
        <TicketCheckoutModal
          eventData={event}
          onPurchase={onPurchaseTicketThroughCard}
          ref={modalRef}
          loader={showLoader}
        />
      ) : null} */}
    </View>
  );
};
