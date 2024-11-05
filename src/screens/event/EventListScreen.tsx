/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { EventCard } from "~/components/events/EventCard";
import { Loader } from "~/components/loader";
import { useChapterFilter } from "~/navigation/AppContext";
import { useEventService } from "~/network/api/services/useEventService";
import { LocalEvent } from "~/types/local-event";
import { handleApiError } from "~/utils/common";
import { AddEventView } from "./AddEventView";
import { createStyleSheet } from "./style";

export const EventListScreen = () => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() + 1);
  const [isLoading, setLoading] = useState(false);
  const chapterFilter = useChapterFilter();

  const {
    queries: { list: listEvents },
  } = useEventService();

  const {
    isPending,
    isError,
    data: eventsList,
    error,
  } = useQuery(listEvents({ isPast: false, chapterId: chapterFilter?.id }));
  if (isPending !== isLoading) setLoading(isPending);
  if (isError) handleApiError("Events", error);

  const renderLocalEvent: ListRenderItem<LocalEvent> = ({ item }) => {
    return (
      <View>
        <EventCard style={styles.listContainer} event={item} />
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
