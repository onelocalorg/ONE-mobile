import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Markdown from "react-native-markdown-display";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { useNavigations } from "~/app-hooks/useNavigations";
import { calendarTime, pinWhite } from "~/assets/images";
import { MultiImageViewer } from "~/components/MultiImageViewer";
import { ButtonComponent } from "~/components/button-component";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { SizedBox } from "~/components/sized-box";
import { useMyUserId } from "~/navigation/AuthContext";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { useEventService } from "~/network/api/services/useEventService";
import { verticalScale } from "~/theme/device/normalize";
import { handleApiError } from "~/utils/common";
import { RsvpView } from "./RsvpView";
import { Tickets } from "./Tickets";
import { createStyleSheet } from "./style";

export const EventDetailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.EVENT_DETAIL>) => {
  const { id: eventId, reply: replyId } = route.params;
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const { gotoUserProfile } = useNavigations();
  const myUserId = useMyUserId();

  const {
    queries: { detail: eventDetail },
  } = useEventService();

  const {
    isPending,
    isError,
    data: event,
    error,
  } = useQuery(eventDetail(eventId));
  if (isError) handleApiError("loading event", error);

  // const { isPending, isLoading, event, rsvpList } = useQueries({
  //   queries: [eventDetail(eventId), rsvpsForEvent(eventId)],
  //   combine: (results) => {
  //     return {
  //       event: results[0].data,
  //       rsvpList: results[1].data,
  //       isLoading: results.some((result) => result.isLoading),
  //       isPending: results.some((result) => result.isPending),
  //     };
  //   },
  // });

  const handleEditEvent = () => {
    navigation.push(Screens.CREATE_EDIT_EVENT, { id: eventId });
  };

  return (
    <ScrollView>
      <Loader visible={isPending} showOverlay />
      {event ? (
        <>
          <View style={styles.container}>
            <Text style={styles.title}>{event.name}</Text>
            <SizedBox height={verticalScale(16)} />
            <Image
              resizeMode="cover"
              source={
                event.images?.[0]
                  ? { uri: event.images?.[0].url }
                  : require("~/assets/images/defaultEvent.png")
              }
              style={styles.eventImage}
            />
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
                onPress={gotoUserProfile(event.host)}
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
              </View>
            </View>
            <SizedBox height={verticalScale(30)} />
            <Text style={styles.event}>{strings.aboutEvent}</Text>
            <Markdown>{event.details}</Markdown>
            <MultiImageViewer images={event.images} />
          </View>
          <Tickets event={event} />
          <RsvpView event={event} />
          {event.host.id === myUserId ? (
            <ButtonComponent
              title={strings.editEvent}
              onPress={handleEditEvent}
            />
          ) : (
            <></>
          )}
        </>
      ) : null}
    </ScrollView>
  );
};
