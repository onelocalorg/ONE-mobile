/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { EventCard } from "~/components/events/EventCard";
import { Loader } from "~/components/loader";
import { useEventService } from "~/network/api/services/useEventService";
import { Group } from "~/types/group";
import { LocalEvent } from "~/types/local-event";
import { UserProfile } from "~/types/user-profile";
import { handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";

interface MyEventsProps {
  user?: UserProfile;
  group?: Group;
  onEventPress?: (event: LocalEvent) => void;
}

export const MyEvents = ({ user, group }: MyEventsProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [isLoading, setLoading] = useState(false);

  const {
    queries: { list: listEvents },
  } = useEventService();

  const {
    isPending,
    isError,
    data: events,
    error,
  } = useQuery(
    listEvents({ host: user?.id, groupIds: group ? [group.id] : undefined })
  );
  if (isPending !== isLoading) setLoading(isPending);
  if (isError) handleApiError("My events", error);

  const renderItem: ListRenderItem<LocalEvent> = ({ item }) => {
    return <EventCard key={item.id} event={item} />;
  };

  return (
    <View>
      <Loader containerStyle={styles.loader} visible={isLoading} />
      <FlatList
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.scrollViewEvent}
        data={events}
        initialNumToRender={10}
        onEndReached={() => {
          if (isLoading) {
            setLoading(false);
          }
        }}
        onEndReachedThreshold={0.8}
      ></FlatList>
      {!events ? (
        <Text style={styles.noMoreTitle}>{strings.noEventsFound}</Text>
      ) : (
        <></>
      )}
    </View>
  );
};
