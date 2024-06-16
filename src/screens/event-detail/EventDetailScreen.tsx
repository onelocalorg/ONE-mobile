import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { calendarTime, pinWhite } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { SizedBox } from "~/components/sized-box";
import { useMyUserId } from "~/navigation/AuthContext";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { useEventService } from "~/network/api/services/event-service";
import { verticalScale } from "~/theme/device/normalize";
import { OneUser } from "~/types/one-user";
import { RsvpType } from "~/types/rsvp";
import { handleApiError } from "~/utils/common";
import { RsvpView } from "./RsvpView";
import { Tickets } from "./Tickets";
import { createStyleSheet } from "./style";

export const EventDetailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.EVENT_DETAIL>) => {
  const eventId = route.params.id;
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const [isLoading, setLoading] = useState(false);
  const myUserId = useMyUserId();
  const queryClient = useQueryClient();

  const { getEvent, listRsvps } = useEventService();

  const eventQuery = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId),
  });
  const rsvpQuery = useQuery({
    queryKey: ["rsvps", eventId],
    queryFn: () => listRsvps(eventId),
  });

  if (eventQuery.isPending && rsvpQuery.isPending !== isLoading) {
    setLoading(eventQuery.isPending);
  }
  if (eventQuery.isError) handleApiError("Event", eventQuery.error);
  if (rsvpQuery.isError) handleApiError("RSVP", rsvpQuery.error);

  const event = eventQuery.data;
  const rsvpList = rsvpQuery.data;

  const onNavigateToProducerProfile = () => {
    navigation.push(Screens.USER_PROFILE, {
      id: event!.eventProducer.id,
    });
  };

  const handleEditEvent = () => {
    navigation.push(Screens.CREATE_EDIT_EVENT, { id: event!.id });
  };

  const addGoingRsvp = () => {
    if (
      rsvpList?.rsvps.find((r) => r.guest.id === myUserId)?.rsvp !==
      RsvpType.GOING
    ) {
      void updateRsvp(eventId, RsvpType.GOING)
        .then(fetchRsvpData)
        .catch(handleApiError("RSVP"));
    }
  };

  const refreshRsvps = () => {
    void queryClient.invalidateQueries({
      queryKey: ["rsvps", eventId],
    });
  };

  const navigateToUserProfile = (user: OneUser) => {
    navigation.push(Screens.USER_PROFILE, { id: user.id });
  };

  return (
    <View>
      <Loader visible={isLoading} showOverlay />
      {event ? (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Pressable
            onPress={() => {
              console.log("click");
            }}
          >
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
                    source={{ uri: event.eventProducer.pic }}
                    style={styles.dummy}
                  />
                </TouchableOpacity>
                <View style={styles.margin}>
                  <Text
                    style={styles.date}
                  >{`${event.eventProducer.first_name} ${event.eventProducer.last_name}`}</Text>
                  {/* <Text style={styles.time}>
                    {user.user_type === "player"
                      ? strings.player
                      : strings.producer}
                  </Text> */}
                </View>
              </View>
              <SizedBox height={verticalScale(30)} />
              <Text style={styles.event}>{strings.aboutEvent}</Text>
              <Text style={styles.desc}>{event.about}</Text>
            </View>

            {event.id ? (
              <>
                <Tickets event={event} onTicketPurchased={addGoingRsvp} />
                {rsvpList ? (
                  <RsvpView
                    event={event}
                    rsvpData={rsvpList}
                    onUserPressed={navigateToUserProfile}
                    // TODO Instead invoke the focus logic
                    onRsvpsChanged={refreshRsvps}
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
