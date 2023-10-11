/* eslint-disable react-hooks/exhaustive-deps */
import {useAppTheme} from '@app-hooks/use-app-theme';
import React, {useState, useCallback} from 'react';
import {createStyleSheet} from './style';
import {ListRenderItem, Text, TouchableOpacity, View} from 'react-native';
import {Header} from '@components/header';
import {ImageComponent} from '@components/image-component';
import {
  arrowDown,
  calendar,
  dummy,
  hamburger,
  notification,
} from '@assets/images';
import {DatePickerModal} from 'react-native-paper-dates';
import moment from 'moment';
import {EventList} from '@components/event-list';
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {navigations} from '@config/app-navigation/constant';
import {
  Result,
  useEventLists,
} from '@network/hooks/home-service-hooks/use-event-lists';
import {Loader} from '@components/loader';
import {FlatListComponent} from '@components/flatlist-component';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {
  useUserProfile,
  userProfileParsedData,
} from '@network/hooks/user-service-hooks/use-user-profile';
import {useDispatch, useSelector} from 'react-redux';
import {StoreType} from '@network/reducers/store';
import {
  UserProfileState,
  onSetUser,
} from '@network/reducers/user-profile-reducer';

interface Range {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface HomeScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const HomeScreen = (props: HomeScreenProps) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {strings} = useStringsAndLabels();
  const {navigation} = props || {};
  const [range, setRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<Result[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const {mutateAsync, isLoading} = useEventLists();
  const [page, setPage] = useState(1);
  const {user} = useSelector<StoreType, UserProfileState>(
    state => state.userProfileReducer,
  ) as {user: {id: string; pic: string}};
  const {refetch} = useUserProfile({
    userId: user?.id,
  });
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getEventLists();
      setEvents([]);
      setTotalPages(0);
      setPage(1);
    }, [page, range?.startDate, range?.endDate]),
  );

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        refetch().then(res => {
          const userData = userProfileParsedData(res?.data?.data);
          console.log('check1===', userData);
          dispatch(onSetUser(userData));
        });
      }
    }, [user?.id]),
  );

  const getEventLists = async () => {
    const res = await mutateAsync({
      queryParams: {limit: 10, page},
      bodyParams: {
        start_date: moment(range.startDate).format('YYYY-MM-DD'),
        end_date: moment(range.endDate).format('YYYY-MM-DD'),
      },
    });

    setEvents(prevData => [...prevData, ...(res?.data?.results || [])]);
    setTotalPages(res?.data?.totalPages);
  };

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    (res: Range) => {
      const startDate = res?.startDate;
      const endDate = res?.endDate;
      setOpen(false);
      setRange({startDate, endDate});
      setPage(1);
      setEvents([]);
    },
    [setOpen, setRange],
  );

  const renderHamburgerIcon = () => {
    return <ImageComponent source={hamburger} style={styles.hamburger} />;
  };

  const renderNotificationIcon = () => {
    return <ImageComponent source={notification} style={styles.notification} />;
  };

  const onNavigateToProfile = () => {
    navigation.navigate(navigations.PROFILE);
  };

  const renderProfile = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onNavigateToProfile}
        style={styles.profileView}>
        <ImageComponent
          isUrl={!!user?.pic}
          source={dummy}
          uri={user?.pic}
          style={styles.profile}
        />
      </TouchableOpacity>
    );
  };

  const onLoadMoreData = () => {
    setPage(page + 1);
  };

  const renderItem: ListRenderItem<Result> = ({item}) => {
    const {name} = item || {};

    return (
      <EventList key={name} onPress={() => onNavigate(item)} data={item} />
    );
  };

  const onNavigate = (item: Result) => {
    navigation.navigate(navigations.EVENT_DETAIL, {id: item?.id});
  };

  return (
    <View>
      <Loader visible={page === 1 && isLoading} />
      <Header
        leftIcon={renderHamburgerIcon()}
        rightIcon={renderNotificationIcon()}
        children={renderProfile()}
      />
      <TouchableOpacity activeOpacity={0.8} style={styles.dateContainer}>
        <ImageComponent source={calendar} style={styles.calendar} />
        <TouchableOpacity activeOpacity={0.8} onPress={() => setOpen(true)}>
          <Text style={styles.date}>{`${moment(range?.startDate).format(
            'MMM DD, YYYY',
          )} - ${moment(range?.endDate).format('MMM DD, YYYY')}`}</Text>
        </TouchableOpacity>
        <DatePickerModal
          locale="en"
          mode="range"
          visible={open}
          onDismiss={onDismiss}
          startDate={range.startDate}
          endDate={range.endDate}
          onConfirm={onConfirm}
          validRange={{startDate: new Date()}}
          editIcon="none"
        />
        <ImageComponent source={arrowDown} style={styles.arrowDown} />
      </TouchableOpacity>
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
