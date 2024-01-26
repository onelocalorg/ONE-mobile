/* eslint-disable react-hooks/exhaustive-deps */
import {useAppTheme} from '@app-hooks/use-app-theme';
import React, {useState, useCallback, useEffect} from 'react';
import {createStyleSheet} from './style';
import {
  ActivityIndicator,
  ListRenderItem,
  LogBox,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from '@components/header';
import {ImageComponent} from '@components/image-component';
import {
  Search,
  arrowDown,
  bell,
  calendar,
  close,
  closeCard,
  downImg,
  dummy,
  hamburger,
  notification,
  onelogo,
  pin,
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
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInput} from 'react-native';
import GetLocation from 'react-native-get-location';
import {FlatList} from 'react-native-gesture-handler';

interface Range {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface CalendarScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const CalendarScreen = (props: CalendarScreenProps) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {strings} = useStringsAndLabels();
  const {navigation} = props || {};
  var makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() + 1);
  const [range, setRange] = useState<Range>({
    startDate: new Date(),
    endDate: makeDate,
  });
  const [open, setOpen] = useState(false);
  const [userprofile, setUserProfile] = useState('');
  const [events, setEvents] = useState<Result[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPage] = useState(0);
  const {mutateAsync} = useEventLists();
  const [isLoading, LoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  var [location, setUserLocation]: any = useState();
  const [ismoreData, isMoreDataLoad] = useState(false);
  const [loading, onPageLoad] = useState(false);
  const {user} = useSelector<StoreType, UserProfileState>(
    state => state.userProfileReducer,
  ) as {user: {id: string; pic: string}};
  const {refetch} = useUserProfile({
    userId: user?.id,
  });
  console.log('-------------------', user.id);

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getUserProfileAPI();
    }, [range?.startDate, range?.endDate]),
  );

  useEffect(() => {
    LogBox.ignoreAllLogs();
    getEventLists();
    // setEvents([]);
    setTotalPages(0);
  }, [page]);

  useFocusEffect(
    useCallback(() => {
      console.log('-------user--------', user.id);
      if (user?.id) {
        refetch().then(res => {
          const userData = userProfileParsedData(res?.data?.data);
          console.log('check1===', userData);
          dispatch(onSetUser(userData));
        });
      }
    }, [user?.id]),
  );

  // ======================get User Profile API=========================
  const getUserProfileAPI = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log('token', token);
    try {
      const response = await fetch(
        'https://app.onelocal.one/api/v1/users/' + user.id,
        {
          method: 'get',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          }),
        },
      );
      const dataItem = await response.json();
      console.log('-----------------Response User Profile API------------');
      console.log(dataItem);
      console.log(dataItem.data.pic);
      setUserProfile(dataItem.data.pic);
      AsyncStorage.setItem('profile', dataItem.data.pic);
      AsyncStorage.setItem('uniqueId', dataItem.data.user_unique_id);
    } catch (error) {
      console.log(error);
    }
  };

  const getEventLists = async () => {
    onPageLoad(true);
    LoadingData(true);
    const res = await mutateAsync({
      queryParams: {limit: 10, page},
      bodyParams: {
        start_date: moment(range.startDate).format('YYYY-MM-DD'),
        end_date: moment(range.endDate).format('YYYY-MM-DD'),
      },
    });
    if (totalPages !== page) {
      setEvents(prevData => [...prevData, ...(res?.data?.results || [])]);
      onPageLoad(false);
    }

    setTotalPages(res?.data?.totalPages);
    setCurrentPage(res?.data?.results.length);
    LoadingData(false);
  };

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    (res: Range) => {
      console.log(res, '--------------date pick------------');
      const startDate = res?.startDate;
      const endDate = res?.endDate;
      setOpen(false);
      setRange({startDate, endDate});
      console.log(range, '---------------set range ---------------');
      setEvents([]);
      setTotalPages(0);
      setPage(1);
      console.log(events, '---------------set events ---------------');
    },
    [setOpen, setRange],
  );

  const onNavigateToProfile = () => {
    if (user?.id) {
      refetch().then(res => {
        const userData = userProfileParsedData(res?.data?.data);
        console.log('check1===', userData);
        dispatch(onSetUser(userData));
      });
    }
    navigation.navigate(navigations.PROFILE);
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

  const postDataLoad = () => {
    console.log(
      'fasdfasfajsdofhajsdjfhaskdjfasjkdbfajksdbfajksdbfasjbsajkbdjfbasj',
    );
    if (totalPages !== currentPages) {
      console.log('11111111111111111111111111111111111');
      onPageLoad(true);
      // page = page + 1
      setPage(page + 1);
      getEventLists();
    }
  };

  return (
    <View>
      <Loader visible={page === 1 && isLoading} showOverlay />
      <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
        {/* <View style={styles.searchContainer}>
          <ImageComponent
            style={styles.searchIcon}
            source={Search}></ImageComponent>
          <TextInput
            value={searchQuery}
            placeholderTextColor="#FFFF"
            placeholder="Search"
            style={styles.searchInput}
            onChangeText={value => {
              console.log(value);
              setSearchQuery(value);
            }}></TextInput>
        </View> */}
        <View style={styles.oneContainer}>
          <ImageComponent
            style={styles.oneContainerImage}
            source={onelogo}></ImageComponent>
          <Text style={styles.oneContainerText}>NE</Text>
        </View>
        <View style={styles.profileContainer}>
          <ImageComponent
            style={styles.bellIcon}
            source={bell}></ImageComponent>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNavigateToProfile}
            style={styles.profileView}>
            <ImageComponent
              resizeMode="cover"
              isUrl={!!user?.pic}
              source={dummy}
              uri={userprofile}
              style={styles.profile}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
          closeIcon={close}
          editIcon={close}
          calendarIcon={close}
        />

        <ImageComponent source={arrowDown} style={styles.arrowDown} />
      </TouchableOpacity>

      <FlatList
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollView}
        data={events}
        onMomentumScrollEnd={postDataLoad}
        onEndReached={postDataLoad}
        onEndReachedThreshold={ 0.001}></FlatList>

      {/* <FlatListComponent 
        renderItem={renderItem} 
        data={events}
        onLoadMoreData={onLoadMoreData}
        emptyComponentData={{ title: strings.noEventsFound }}
        totalPages={totalPages}
        currentPage={page}
        dataLength={events.length}
        enablePagination
        contentContainerStyle={styles.scrollView}
      /> */}
    </View>
  );
};
