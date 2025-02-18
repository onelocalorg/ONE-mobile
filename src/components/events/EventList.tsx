/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { EventCard } from "~/components/events/EventCard";
import { Loader } from "~/components/loader";
import { useChapterFilter } from "~/navigation/AppContext";
import { useMyUserId } from "~/navigation/AuthContext";
import { useEventService } from "~/network/api/services/useEventService";
import { Group } from "~/types/group";
import { LocalEvent } from "~/types/local-event";
import { handleApiError } from "~/utils/common";
import { Box } from "../ui/box";
import { AddEventView } from "./AddEventView";
import { createStyleSheet } from "./style";

interface EventListProps {
  placeholder?: string;
  group?: Group;
}
export const EventList = ({ placeholder, group }: EventListProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() + 1);
  const [isLoading, setLoading] = useState(false);
  const chapterFilter = useChapterFilter();
  const myId = useMyUserId();

  const isAdmin = group && group.admins?.find((a) => a.id === myId);
  const isEditor =
    isAdmin || (group && group.editors?.find((a) => a.id === myId));
  const isMember =
    isEditor || (group && group.members?.find((a) => a.id === myId));

  const {
    queries: { list: listEvents },
  } = useEventService();

  const groupIds = group ? [group.id] : undefined;
  if (group?.parentId) {
    groupIds?.push(group.parentId);
  }

  const {
    isPending,
    isError,
    data: eventsList,
    error,
  } = useQuery(
    listEvents({
      isPast: false,
      chapterId: chapterFilter?.id,
      groupIds,
    })
  );
  if (isPending !== isLoading) setLoading(isPending);
  if (isError) handleApiError("Events", error);

  const renderLocalEvent: ListRenderItem<LocalEvent> = ({ item }) => {
    return (
      <Box className="my-1 mx-4">
        <EventCard style={styles.listContainer} event={item} />
      </Box>
    );
  };

  return (
    <View>
      <Loader visible={isLoading} showOverlay />
      {(!group || isMember) && (
        <AddEventView placeholder={placeholder} group={group} />
      )}
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
