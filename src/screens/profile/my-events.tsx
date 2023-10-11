/* eslint-disable react-hooks/exhaustive-deps */
import {useAppTheme} from '@app-hooks/use-app-theme';
import React, {useEffect, useState} from 'react';
import {createStyleSheet} from './style';
import {ListRenderItem, View} from 'react-native';
import {EventList} from '@components/event-list';
import {
  Result,
  useEventLists,
} from '@network/hooks/home-service-hooks/use-event-lists';
import {FlatListComponent} from '@components/flatlist-component';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {Loader} from '@components/loader';

interface MyEventsProps {
  userId: string;
}

export const MyEvents = (props: MyEventsProps) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {strings} = useStringsAndLabels();
  const {userId} = props || {};
  const [events, setEvents] = useState<Result[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const {mutateAsync, isLoading} = useEventLists();
  const [page, setPage] = useState(1);

  useEffect(() => {
    getEventLists();
  }, [page]);

  const getEventLists = async () => {
    const res = await mutateAsync({
      queryParams: {limit: 10, page},
      userId,
    });

    setEvents(prevData => [...prevData, ...(res?.data?.results || [])]);
    setTotalPages(res?.data?.totalPages);
  };

  const onLoadMoreData = () => {
    setPage(page + 1);
  };

  const renderItem: ListRenderItem<Result> = ({item}) => {
    const {name} = item || {};

    return <EventList key={name} disabled data={item} />;
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
        emptyComponentData={{title: strings.noEventsFound}}
        totalPages={totalPages}
        currentPage={page}
        dataLength={events.length}
        enablePagination
        contentContainerStyle={styles.scrollView}
      />
    </View>
  );
};
