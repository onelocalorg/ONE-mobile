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
import { EventList } from "~/components/events/EventList";
import { Loader } from "~/components/loader";
import { navigations } from "~/config/app-navigation/constant";
import {
  EventData,
  useEventLists,
} from "~/network/hooks/home-service-hooks/use-event-lists";
import { createStyleSheet } from "./style";

interface MyEventsProps {
  userId: string;
  navigation: NavigationContainerRef<ParamListBase>;
}

export const MyEvents = (props: MyEventsProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const { userId, navigation } = props || {};
  const [events, setEvents] = useState<EventData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPage] = useState(0);
  const [loading, onPageLoad] = useState(false);
  const { mutateAsync, isLoading } = useEventLists();
  const [page, setPage] = useState(0);

  useFocusEffect(
    useCallback(() => {
      console.log(
        "--------------useFocusEffect getEventListAPI------------------"
      );
      getEventListsAPI();
    }, [page])
  );

  useFocusEffect(
    useCallback(() => {
      onPageLoad(false);
      setPage(1);
      setEvents([]);
    }, [])
  );

  const getEventListsAPI = async () => {
    const res = await mutateAsync({
      queryParams: { limit: 15, page },
      userId,
    });

    var dataTemp = [...events, ...res?.data.results];
    setEvents(dataTemp);

    setTotalPages(res?.data?.totalPages);
    setCurrentPage(res?.data?.page);
    if (events.length !== 0) {
      onPageLoad(true);
    }
  };

  const onLoadMoreData = () => {
    if (totalPages !== currentPages) {
      setPage(page + 1);
    }
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
    <View>
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
          console.log("-------------onEndReached---------------");
          if (loading) {
            onPageLoad(false);
            onLoadMoreData();
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
