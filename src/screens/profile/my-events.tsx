/* eslint-disable react-hooks/exhaustive-deps */
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { EventCard } from "~/components/events/EventCard";
import { Loader } from "~/components/loader";
import { LOG } from "~/config";
import { navigations } from "~/config/app-navigation/constant";
import { listEvents } from "~/network/api/services/event-service";
import { LocalEvent } from "~/types/local-event";
import { UserProfile } from "~/types/user-profile";
import { handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";

interface MyEventsProps {
  navigation: NavigationContainerRef<ParamListBase>;
  user: UserProfile;
}

export const MyEvents = ({ user, navigation }: MyEventsProps) => {
  LOG.debug("MyEvents", user);
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [isLoading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getMyEvents();
    }, [user])
  );

  const getMyEvents = async () => {
    try {
      setLoading(true);
      const events = await listEvents({ host: user.id });
      setEvents(events);
    } catch (e) {
      handleApiError("Error getting events", e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem: ListRenderItem<LocalEvent> = ({ item }) => {
    return (
      <EventCard key={item.id} onPress={() => onNavigate(item)} event={item} />
    );
  };

  const onNavigate = (item: LocalEvent) => {
    navigation.navigate(navigations.EVENT_DETAIL, { id: item?.id });
  };

  return (
    <View>
      <Loader containerStyle={styles.loader} visible={isLoading} />
      {/* <FlatListComponent
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        data={events}
        onLoadMoreData={onLoadMoreData}
        emptyComponentData={{ title: strings.noEventsFound }}
        totalPages={totalPages}
        currentPage={page}
        dataLength={events.length}
        enablePagination
        contentContainerStyle={styles.scrollViewEvent}
      /> */}
      <FlatList
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
      {events.length === 0 ? (
        <Text style={styles.noMoreTitle}>{strings.noEventsFound}</Text>
      ) : (
        <></>
      )}
    </View>
  );
};
