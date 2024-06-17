/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { useNavigations } from "~/app-hooks/useNavigations";
import { EventItem } from "~/components/events/EventItem";
import { Loader } from "~/components/loader";
import { EventsStackScreenProps, Screens } from "~/navigation/types";
import { useEventService } from "~/network/api/services/useEventService";
import { LocalEvent } from "~/types/local-event";
import { handleApiError } from "~/utils/common";
import { AddEventView } from "./AddEventView";
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
  const { gotoEventDetails } = useNavigations();

  const {
    queries: { list: listEvents },
  } = useEventService();

  const {
    isPending,
    isError,
    data: eventsList,
    error,
  } = useQuery(listEvents({ isPast: false }));
  if (isPending !== isLoading) setLoading(isPending);
  if (isError) handleApiError("Events", error);

  const renderLocalEvent: ListRenderItem<LocalEvent> = ({ item }) => {
    return (
      <View>
        <EventItem
          style={styles.listContainer}
          event={item}
          onPress={gotoEventDetails}
        />
      </View>
    );
  };

  return (
    <View>
      <Loader visible={isLoading} showOverlay />
      <AddEventView />
      <FlatList
        renderItem={renderLocalEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollView}
        data={eventsList}
      />

      {!isLoading && eventsList?.length === 0 ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.noEventLbl}>{strings.noEventsFound}</Text>
        </View>
      ) : null}
    </View>
  );
};
