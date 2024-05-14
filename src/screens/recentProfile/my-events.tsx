/* eslint-disable react-hooks/exhaustive-deps */
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ListRenderItem, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { EventList } from "~/components/events/EventList";
import { FlatListComponent } from "~/components/flatlist-component";
import { Loader } from "~/components/loader";
import { navigations } from "~/config/app-navigation/constant";
import {
  EventData,
  useEventLists,
} from "~/network/hooks/home-service-hooks/use-event-lists";
import { createStyleSheet } from "./style";

interface RecentMyEventsProps {
  userId: string;
  navigation: NavigationContainerRef<ParamListBase>;
}

export const RecentMyEvents = (props: RecentMyEventsProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const { userId, navigation } = props || {};
  const [events, setEvents] = useState<EventData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const { mutateAsync, isLoading } = useEventLists();
  const [page, setPage] = useState(1);

  useEffect(() => {
    getEventLists();
  }, [page]);

  const getEventLists = async () => {
    const res = await mutateAsync({
      queryParams: { limit: 10, page },
      userId,
    });

    setEvents((prevData) => [...prevData, ...(res?.data?.results || [])]);
    setTotalPages(res?.data?.totalPages);
  };

  const onLoadMoreData = () => {
    setPage(page + 1);
  };

  const renderItem: ListRenderItem<EventData> = ({ item }) => {
    const { name } = item || {};

    return (
      <EventList key={name} onPress={() => onNavigate(item)} data={item} />
    );
  };

  const onNavigate = (item: EventData) => {
    navigation.navigate(navigations.EVENT_DETAIL, { id: item?.id });
  };

  if (isLoading) {
    return (
      <Loader
        containerStyle={styles.loader}
        visible={page === 1 && isLoading}
      />
    );
  }

  return (
    <View style={styles.eventContainer}>
      <FlatListComponent
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        data={events}
        onLoadMoreData={onLoadMoreData}
        emptyComponentData={{ title: strings.noEventsFound }}
        totalPages={totalPages}
        currentPage={page}
        dataLength={events.length}
        // enablePagination
        contentContainerStyle={styles.scrollView}
      />
    </View>
  );
};
