import { useMutation, useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { useNavigations } from "~/app-hooks/useNavigations";
import { calendarTime, pinWhite } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { SizedBox } from "~/components/sized-box";
import { useMyUserId } from "~/navigation/AuthContext";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { useEventService } from "~/network/api/services/useEventService";
import { verticalScale } from "~/theme/device/normalize";
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
  const { gotoUserProfile } = useNavigations();

  const {
    queries: { detail: eventDetail, rsvpsForEvent },
    mutations: { createRsvp },
  } = useEventService();

  const mutateCreateRsvp = useMutation(createRsvp);

  const {
    isPending,
    isError,
    data: event,
    error,
  } = useQuery(eventDetail(eventId));

  if (isPending !== isLoading) {
    setLoading(isPending);
  }
  if (isError) handleApiError("Event", error);

  const handleEditEvent = () => {
    navigation.push(Screens.CREATE_EDIT_EVENT, { id: event!.id });
  };

  const addGoingRsvp = () => {
    mutateCreateRsvp.mutate({
      type: RsvpType.GOING,
      eventId: eventId,
    });
  };

  return (
    <View>
      <Loader visible={isLoading} showOverlay />
      {event ? (
        <>
          <View style={styles.container}>
            <Text style={styles.title}>{event.name}</Text>
            <SizedBox height={verticalScale(16)} />
            <View style={{ position: "relative" }}>
              <Image
                resizeMode="cover"
                source={
                  event.image
                    ? { uri: event.image }
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
                <Text style={styles.date}>{event.venue}</Text>
                <Text style={styles.time}>{event.address}</Text>
              </View>
            </View>
            <View style={[styles.row, styles.marginTop]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => gotoUserProfile(event.host)}
              >
                <ImageComponent
                  resizeMode="cover"
                  source={{ uri: event.host.pic }}
                  style={styles.dummy}
                />
              </TouchableOpacity>
              <View style={styles.margin}>
                <Text
                  style={styles.date}
                >{`${event.host.firstName} ${event.host.lastName}`}</Text>
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
          <Tickets event={event} onTicketPurchased={addGoingRsvp} />
          <RsvpView event={event} />
        </>
      ) : null}

      {event?.isMyEvent ? (
        <ButtonComponent title={strings.adminTools} onPress={handleEditEvent} />
      ) : (
        <></>
      )}
    </View>
  );
};
