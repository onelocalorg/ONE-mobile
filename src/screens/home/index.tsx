import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createStyleSheet} from './style';
import {useAppTheme} from '@app-hooks/use-app-theme';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  LogBox,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {ImageComponent} from '@components/image-component';
import {
  Gratis,
  Search,
  Vector,
  activeRadio,
  addGreen,
  arrowDown,
  bell,
  blackOffer,
  buttonArrowGreen,
  calendar,
  close,
  closeCard,
  comment,
  dummy,
  gratitudeBlack,
  greenOffer,
  logoblack,
  mapEvent,
  mapGifting,
  mapService,
  minus,
  money,
  moving,
  onelogo,
  painting,
  pin,
  plus,
  postCalender,
  request,
  send,
} from '@assets/images';
import {useDispatch, useSelector} from 'react-redux';
import {StoreType} from '@network/reducers/store';
import {
  UserProfileState,
  onSetUser,
} from '@network/reducers/user-profile-reducer';
import {
  useUserProfile,
  userProfileParsedData,
} from '@network/hooks/user-service-hooks/use-user-profile';
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {navigations} from '@config/app-navigation/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';
import {DatePickerModal, TimePickerModal} from 'react-native-paper-dates';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import GetLocation from 'react-native-get-location';
import {Loader} from '@components/loader';
import Popover, {PopoverPlacement, Rect} from 'react-native-popover-view';
import {SizedBox} from '@components/sized-box';
import {verticalScale} from '@theme/device/normalize';
import {
  DatePickerRefProps,
  DateRangePicker,
} from '@components/date-range-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Toast from 'react-native-simple-toast';
import GestureRecognizer from 'react-native-swipe-gestures';
import {Result} from '@network/hooks/home-service-hooks/use-event-lists';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [userprofile, setUserProfile] = useState('');
  const [userList, recentlyJoinUser] = useState([]);
  var [postList, postListData]: any = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [pagination, postLoadData] = useState(false);
  const [offerModal, CreateOfferModal] = useState(false);
  const [replyofferModal, openReplyOfferModal] = useState(false);
  var [location, setUserLocation]: any = useState();
  const [addnewCmt, onAddComment] = useState('');
  const [addnewCmtReply, onAddCommentReply] = useState('');
  const [isLoading, LodingData] = useState(false);
  const [loading, onPageLoad] = useState(false);
  const [commentLoading, onPageLoadComment] = useState(false);
  const [ismoreData, isMoreDataLoad] = useState(false);
  const [ismoreComment, isMoreCommentData] = useState(false);
  const [replyId, commentReplyPostId] = useState('');
  const [setReplyId, setReplyCommentId] = useState('');
  var [postId, postIdData]: any = useState();
  var [gratisIndex, gratisIndexData]: any = useState();
  var [showComment, showCommentPost] = useState(false);
  var [addComment, addCommentModal] = useState(false);
  var [gratisNo, totalGratisData]: any = useState(10);
  var [page, setPage] = useState(1);
  const initialValue = 1;
  const [pageCmt, setCmtPage] = useState(initialValue);
  const [starttimePicker, startTimePicker] = useState(false);
  const [endtimePicker, endTimePicker] = useState(false);
  const [setStartTime, setStartTimeData]: any = useState(new Date());
  const [setEndTime, setEndTimeData]: any = useState(new Date());
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPage] = useState(0);
  const [gratisCmtID, setreplyGratisId] = useState();
  const [gratisCmtKey, setreplyGratisKey] = useState();
  const [postlistTtl,postListTotalResult] = useState();
  const {user} = useSelector<StoreType, UserProfileState>(
    state => state.userProfileReducer,
  ) as {user: {id: string; pic: string}};
  const {refetch} = useUserProfile({
    userId: user?.id,
  });

  var makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() + 1);
  const [range, setRange] = useState<Range>({
    startDate: new Date(),
    endDate: makeDate,
  });

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      LogBox.ignoreAllLogs();
      postListAPI();
      requestLocationPermission();
      setPage(page);
      setCmtPage(pageCmt);
    }, [range?.startDate, range?.endDate,page, pageCmt]),
  );

  useEffect(() => {
    LogBox.ignoreAllLogs();
    postListAPI();
    getUserProfileAPI();
    requestLocationPermission();
    setPage(page);
    setCmtPage(pageCmt);
  }, [page, pageCmt]);

  const requestLocationPermission = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 6000,
    })
      .then(location => {
        setUserLocation(location);
        console.log(
          '---------------------location---------------------',
          location,
        );
        if (location) {
          getRecentlyJoinUserAPI();
          // postListAPI();
        }
      })
      .catch(error => {
        console.log('---------------------error---------------------', error);
        const {code, message} = error;
        console.log(code, message);
      });
  };

  const onNavigateToCreatePost = () => {
    navigation?.navigate(navigations?.CREATEPOST);
  };

  const OfferModalShow = (postIds: any, index: any) => {
    postIdData(postIds);
    gratisIndexData(index);
    CreateOfferModal(true);
    totalGratisData(10);
  };

  const OfferModalHide = () => {
    CreateOfferModal(false);
    addGratisAPI();
  };

  const replyOfferModalHide = () => {
    openReplyOfferModal(false);
    addReplyGratisAPI();
  };

  const openReplyGratis = (
    postIds: any,
    replyId: any,
    replyKey: any,
    index: any,
  ) => {
    openReplyOfferModal(true);
    totalGratisData(10);
    setreplyGratisId(replyId);
    setreplyGratisKey(replyKey);
    postIdData(postIds);
    gratisIndexData(index);
  };

  const OfferModalClose = () => {
    CreateOfferModal(false);
  };

  const gratisPlusClick = () => {
    gratisNo = gratisNo + 1;
    totalGratisData(gratisNo);
  };
  const gratisMinusClick = () => {
    if (gratisNo > 10) {
      gratisNo = gratisNo - 1;
      totalGratisData(gratisNo);
    }
  };

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
      requestLocationPermission();
      LodingData(true);
      postListAPI();
      console.log(range, '---------------set range ---------------');
    },
    [setOpen, setRange],
  );

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

  async function commentOnPost(postID: any, index: any) {
    const token = await AsyncStorage.getItem('token');
    var data: any = {
      content: addnewCmt,
      // comment_id:'65a6784abcbd1588bcde8f95'
    };
    console.log('===========Comment on Post API Request ==============');
    console.log(data);
    console.log(
      'https://app.onelocal.one/api/v1/posts/' + postID + '/comments/create',
    );
    try {
      const response = await fetch(
        'https://app.onelocal.one/api/v1/posts/' + postID + '/comments/create',
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          body: Object.keys(data)
            .map(key => key + '=' + data[key])
            .join('&'),
        },
      );
      const dataItem = await response.json();
      console.log('=========== Comment on Post API Response ==============');
      console.log(dataItem);
      onAddComment('');
      onAddCommentReply('');
      getCommentList(postID, index);
      // postListAPI()
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function getCommentList(postID: any, index: any) {
    isMoreCommentData(true);
    const token = await AsyncStorage.getItem('token');
    var data: any = {
      post_id: postID,
    };
    console.log('===========Get Comment List API Request ==============');
    console.log(
      'https://app.onelocal.one/api/v1/comments?limit=5&+page=' +
        pageCmt +
        '&post_id=' +
        postID,
    );
    console.log(data);
    try {
      const response = await fetch(
        'https://app.onelocal.one/api/v1/comments?limit=5&page=' +
          pageCmt +
          '&post_id=' +
          postID,
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          body: Object.keys(data)
            .map(key => key + '=' + data[key])
            .join('&'),
        },
      );
      // setCmtPage(pageCmt)
      const dataItem = await response.json();
      console.log('===========Get Comment List API Response ==============');
      console.log(dataItem);
      LodingData(false);

      var cmtList = dataItem?.data?.results;
      var dataTemp = postList[index]['commentListData'];
      console.log(dataTemp);

      for (let jindex = 0; jindex < cmtList.length; jindex++) {
        dataTemp.push(cmtList[jindex]);
      }

      console.log(dataTemp);

      var dataTempTwo = postList;
      dataTempTwo[index]['commentListData'] = dataTemp;
      dataTempTwo[index]['comment'] = dataItem?.data?.totalResults;
      console.log(dataTemp);
      postListData(dataTempTwo);

      console.log(postList, '------------post List---------------');

      onPageLoadComment(false);
      setTotalPages(dataItem?.data?.totalPages);
      setCurrentPage(dataItem?.data?.page);
      if (pageCmt === dataItem?.data?.totalPages) {
        isMoreCommentData(false);
      }
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function replyCommentOnPost() {
    const token = await AsyncStorage.getItem('token');
    var data: any = {
      content: addnewCmtReply,
      comment_id: replyId,
    };
    console.log('===========Comment on Post API Request ==============');
    console.log(data);
    try {
      const response = await fetch(
        'https://app.onelocal.one/api/v1/posts/' +
          setReplyId +
          '/comments/create',
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          body: Object.keys(data)
            .map(key => key + '=' + data[key])
            .join('&'),
        },
      );
      const dataItem = await response.json();
      console.log('=========== Comment on Post API Response ==============');
      LodingData(false);
      postListAPI();
      console.log(dataItem);
    } catch (error) {
      console.error(error);
    }
  }

  async function postListAPI() {
    isMoreDataLoad(true);
    const token = await AsyncStorage.getItem('token');
    var data: any = {
      start_date:
        moment(range.startDate).format('YYYY-MM-DD') +
        ' ' +
        moment(setStartTime).format('HH:mm'),
      end_date:
        moment(range.endDate).format('YYYY-MM-DD') +
        ' ' +
        moment(setEndTime).format('HH:mm'),
      type: 'offer',
    };
    console.log(
      '=========== Post List API Request https://app.onelocal.one/api/v1/posts/list?limit=10&page=' +
        page +
        '==============',
    );
    console.log(data);
    try {
      const response = await fetch(
        'https://app.onelocal.one/api/v1/posts/list?limit=10&page=' + page,
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          body: Object.keys(data)
            .map(key => key + '=' + data[key])
            .join('&'),
        },
      );
      const dataItem = await response.json();
      console.log('=========== Post List API Response ==============');
      console.log(dataItem);

      postLoadData(false);
      onPageLoad(false);

      if (page === 1) {
        const result = dataItem?.data?.results.map((item: any) => {
          return {...item, isComment: false, commentListData: []};
        });
        postListData(result);

        console.log(result, '111111111111');
      }
      if (page > 1) {
        const result = dataItem?.data?.results.map((item: any) => {
          var resultData = {...item, isComment: false, commentListData: []};
          return {...postList, resultData};
        });
        postListData(result);
      }
      postListTotalResult(dataItem?.data?.totalResults)
      LodingData(false);
      if (dataItem?.data?.page === dataItem?.data?.totalPages) {
        isMoreDataLoad(false);
      }
    } catch (error) {
      LodingData(false);
      console.error(
        '----------------https://app.onelocal.one/api/v1/posts/list?limit=10&page=',
        error,
      );
    }
  }

  async function addGratisAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem('token');
    var data: any = {
      postId: postId,
      points: gratisNo,
    };
    console.log('=========== Gratis Data API Request ==============');
    console.log(data);
    try {
      const response = await fetch(
        'https://app.onelocal.one/api/v1/posts/gratis-sharing',
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          body: Object.keys(data)
            .map(key => key + '=' + data[key])
            .join('&'),
        },
      );
      const dataItem = await response.json();
      console.log('=========== Gratis Data API Response ==============');
      console.log(dataItem);
      let markers = [...postList];
      markers[gratisIndex] = {
        ...markers[gratisIndex],
        gratis: dataItem?.data?.data?.postGratis,
      };
      console.log(dataItem?.data?.data?.postGratis);
      console.log(postList, '------------post List---------------');
      postListData(markers);
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function addReplyGratisAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem('token');
    var data: any = {
      postId: postId,
      points: gratisNo,
      commentId: gratisCmtID,
      commentKey: gratisCmtKey,
    };
    console.log(
      '=========== Gratis Reply Data API Request https://app.onelocal.one/api/v1/posts/gratis-sharing ==============',
    );
    console.log(data);
    try {
      const response = await fetch(
        'https://app.onelocal.one/api/v1/posts/gratis-sharing',
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          body: Object.keys(data)
            .map(key => key + '=' + data[key])
            .join('&'),
        },
      );
      const dataItem = await response.json();
      console.log('=========== Gratis Data Reply API Response ==============');
      console.log(dataItem);
      let markers = [...postList];
      markers[gratisIndex] = {
        ...markers[gratisIndex],
        gratis: dataItem?.data?.data?.postGratis,
      };
      console.log(dataItem?.data?.data?.postGratis);
      console.log(postList, '------------post List---------------');
      postListData(markers);
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function getRecentlyJoinUserAPI() {
    const token = await AsyncStorage.getItem('token');
    var data: any = {
      radius: 25,
      user_lat: location?.latitude,
      user_long: location?.longitude,
    };
    console.log('=========== Get Recentely Join API Request ==============');
    console.log(data);
    try {
      const response = await fetch(
        'https://app.onelocal.one/api/v1/users/recently-joined',
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          body: Object.keys(data)
            .map(key => key + '=' + data[key])
            .join('&'),
        },
      );
      const dataItem = await response.json();
      console.log('=========== Get Recentely Join API Response ==============');
      console.log(dataItem);
      recentlyJoinUser(dataItem?.data);
    } catch (error) {
      console.error(error);
    }
  }

  const postDataLoad = () => {
    console.log(
      'fasdfasfajsdofhajsdjfhaskdjfasjkdbfajksdbfajksdbfasjbsajkbdjfbasj',
    );
    if (ismoreData) {
      onPageLoad(true);
      // page = page + 1;
      setPage(page);
      postListAPI();
    }
  };

  const showCommentonPost = (data: any, jindex: any) => {
    setCmtPage(initialValue);
    console.log(pageCmt, '--------------COMMENT COUNT--------------');

    setTimeout(() => {
      if (postList[jindex]['isComment'] === true) {
        postList[jindex]['isComment'] = false;
        let markers = [...postList];
        markers[jindex] = {
          ...markers[jindex],
          isComment: false,
        };
        postList[jindex]['commentListData'] = []
        postListData(markers);
      } else {
        postList[jindex]['commentListData'] = []
        postList[jindex]['isComment'] = true;
        // if(ismoreComment){
        LodingData(true);
        setReplyCommentId(data.id);
        getCommentList(data.id, jindex);
        // }
      }
    }, 2000);
  };

  const addNewComment = (commentID: any, index: any) => {
    if (showComment === false) {
      showCommentPost(true);
      commentOnPost(commentID, index);
    } else if (showComment === true) {
      showCommentPost(false);
    }
  };

  const addCommentHide = (commentData: any, index: any) => {
    if (addnewCmt === '') {
      Toast.show('Add Comment', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else {
      LodingData(true);
      commentOnPost(commentData.id, index);
      setTimeout(() => {
        commentData.isComment = true;
      }, 3000);
    }
  };

  const onReplyClick = (postId: any) => {
    commentReplyPostId(postId);

    addCommentModal(true);
  };

  const onReplyClose = () => {
    if (addnewCmtReply === '') {
      Toast.show('Add Comment', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else {
      LodingData(true);
      replyCommentOnPost();
      addCommentModal(false);
    }
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const CommentListCall = (post_id: any, indexId: any) => {
    console.log(
      '-----------------------pagination of comment list-----------------------',
    );
    if (totalPages !== currentPages) {
      onPageLoadComment(true);
      setCmtPage(pageCmt + 1);
      getCommentList(post_id, indexId);
    }
  };

  const onConfirmEndTime = useCallback((res: any) => {
    console.log(res);
    setEndTimeData(res);
    endTimePicker(false);
    LodingData(true);
    postListAPI();
  }, []);

  const onConfirmStrtTime = useCallback(
    (res: any) => {
      console.log(res);
      setStartTimeData(res);
      startTimePicker(false);
      LodingData(true);
      postListAPI();
    },
    [],
  );
  const onDismissTimePicker = () => {
    startTimePicker(false);
    endTimePicker(false);
  };

  const recentUserProfilePress = (id:any) => {
    AsyncStorage.setItem('recentUserId', id);
    navigation.navigate(navigations.RECENTUSERPROFILE);
  }
  

  return (
    <>
      {/* <ScrollView></ScrollView> */}
      {/* <TouchableOpacity activeOpacity={1} onPress={keyboardDismiss}> */}
      <View>
      <Loader visible={isLoading} showOverlay />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          data={postList}
          onEndReachedThreshold={0.01}
          ListHeaderComponent={
            <View>
              <TouchableOpacity
                style={styles.HeaderContainerTwo}
                activeOpacity={1}>
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
              <View style={styles.filterTags}>
                {/* <TouchableOpacity style={styles.container2} activeOpacity={0.8}>
                  <ImageComponent source={mapEvent} style={[styles.icon1]} />
                  <Text style={styles.label1Event}>Events</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.container2} activeOpacity={0.8}>
                  <ImageComponent source={mapService} style={[styles.icon1]} />
                  <Text style={styles.label1Service}>Services</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.container2} activeOpacity={0.8}>
                  <ImageComponent source={mapGifting} style={[styles.icon1]} />
                  <Text style={styles.label1}>Gifting</Text>
                </TouchableOpacity> */}
              </View>
              {userList.length !== 0 ? (
                <View style={styles.avatarContainer}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {userList.map((userList: any) => {
                      return (
                        <TouchableOpacity onPress={() => recentUserProfilePress(userList.id)}>
                          <ImageComponent
                          style={styles.avatarImage}
                          isUrl={!!userList?.pic}
                          resizeMode="cover"
                          uri={userList?.pic}></ImageComponent>
                        </TouchableOpacity>
                        
                      );
                    })}
                  </ScrollView>
                </View>
              ) : (
                <View></View>
              )}

              <TouchableOpacity  activeOpacity={0.1} style={styles.mainPostCont} onPress={onNavigateToCreatePost}>
                <View style={styles.postContainer}>
                  <ImageComponent style={styles.avatar} resizeMode="cover"
                      isUrl={!!user?.pic}
                      source={dummy}
                      uri={userprofile}></ImageComponent>
                  <TouchableOpacity
                    style={styles.postInput}
                    // onPress={CreateNewPost}>
                    >
                    <Text style={{textAlign: 'left', color: 'gray'}}>
                      What do you want to post?
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* <View
                  style={{
                    height: 1,
                    backgroundColor: 'gray',
                    marginHorizontal: 15,
                  }}></View> */}

                {/* <View style={styles.postFilter}>
                  <TouchableOpacity
                    style={styles.container3}
                    activeOpacity={0.8}>
                    <ImageComponent source={blackOffer} style={styles.icon1} />
                    <Text style={styles.label2}>Offer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.container3}
                    activeOpacity={0.8}>
                    <ImageComponent source={request} style={styles.icon1} />
                    <Text style={styles.label2}>Request</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.container3}
                    activeOpacity={0.8}>
                    <ImageComponent
                      source={gratitudeBlack}
                      style={styles.icon1}
                    />
                    <Text style={styles.label2}>Gratitude</Text>
                  </TouchableOpacity>
                </View> */}
              </TouchableOpacity>

              {/* <View>
                <TouchableOpacity
                  style={styles.listContainer}
                  activeOpacity={0.8}>
                  <ImageComponent
                    resizeMode="stretch"
                    source={dummy}
                    style={styles.dummy}
                  />
                  <View style={styles.flex}>
                    <View style={styles.row}>
                      <View style={styles.flex}>
                        <Text style={styles.dateText}>
                          {' '}
                          Sat May 1 • 2:00 PM
                        </Text>
                        <Text style={styles.title}>Garden Party</Text>
                        <Text style={styles.sposerLabel}>Sponsored</Text>
                      </View>
                      <ImageComponent source={mapEvent} style={styles.event} />
                    </View>
                    <View style={styles.row}>
                      <ImageComponent source={pin} style={styles.pin} />
                      <Text style={styles.location}>Lot 13</Text>
                      <ImageComponent
                        style={styles.addressDot}
                        source={activeRadio}></ImageComponent>
                      <Text style={styles.fullAddress}>Oakland,CA</Text>
                    </View>
                    <Image
                      style={styles.gretitude}
                      source={gratitudeBlack}></Image>
                  </View>
                </TouchableOpacity>
              </View> */}

              <View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.dateContainer}>
                  <ImageComponent
                    source={postCalender}
                    style={styles.calendar}
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => startTimePicker(true)}>
                    <Text style={styles.date}>{`${moment(setStartTime).format(
                      'h:mm a',
                    )}`}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setOpen(true)}>
                    <Text style={styles.date}>{`${moment(
                      range?.startDate,
                    ).format('MMM DD, YYYY')}`}</Text>
                  </TouchableOpacity>
                  <ImageComponent source={arrowDown} style={styles.arrowDown} />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => endTimePicker(true)}>
                    <Text style={styles.date}>{`${moment(setEndTime).format(
                      'h:mm a',
                    )}`}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setOpen(true)}>
                    <Text style={styles.date}>{`${moment(range?.endDate).format(
                      'MMM DD, YYYY',
                    )}`}</Text>
                  </TouchableOpacity>
                  <ImageComponent source={arrowDown} style={styles.arrowDown} />

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
                    closeIcon={close}
                  />
                  <TimePickerModal
                    visible={starttimePicker}
                    onDismiss={onDismissTimePicker}
                    onConfirm={onConfirmStrtTime}
                    hours={12}
                    minutes={14}
                    keyboardIcon={calendar}
                    clockIcon={calendar}
                  />
                  <TimePickerModal
                    visible={endtimePicker}
                    onDismiss={onDismissTimePicker}
                    onConfirm={onConfirmEndTime}
                    hours={12}
                    minutes={14}
                    keyboardIcon={calendar}
                    clockIcon={calendar}
                  />
                </TouchableOpacity>
              </View>
            </View>
          }
          onEndReached={postDataLoad}
          renderItem={({item, index}) => (
            <View style={styles.feedContainer}>
              <Text style={styles.posttitle}>{item?.type}</Text>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 14,
                  top: 10,
                  zIndex: 111122,
                }}>
                <Image
                  style={styles.postfilterImage}
                  source={greenOffer}></Image>
              </TouchableOpacity>
              <View style={styles.userDetailcont}>
                <Image
                  style={styles.postProfile}
                  source={{uri: item?.user_id?.pic}}></Image>
                <View>
                  <Text style={styles.userName}>
                    {item?.user_id?.first_name} {item?.user_id?.last_name}
                  </Text>
                  <Text style={styles.postTime}>{item?.date}</Text>
                </View>
              </View>
              <Text style={styles.postDes}>{item?.content}</Text>
              {/* <Image source={postImage}style={styles.userPost}></Image> */}
              {item?.image[0] != '' ? (
                <Image
                  source={{uri: item?.image[0]}}
                  style={styles.userPost}></Image>
              ) : (
                <View></View>
              )}
              <View style={styles.postDetailCont}>
                <Text style={styles.postDetail}>What:</Text>
                <Image source={painting} style={styles.detailImage}></Image>
                <Text style={styles.postDetail}>{item?.what?.name}</Text>
              </View>
              <View style={styles.postDetailCont}>
                <Text style={styles.postDetail}>For:</Text>
                <Image source={moving} style={styles.detailImage}></Image>
                <Text style={styles.postDetail}>{item?.what?.name}</Text>
              </View>
              <View style={styles.postDetailCont}>
                <Text style={styles.postDetail}>Where:</Text>
                <Image source={pin} style={styles.detailImage}></Image>
                <Text style={styles.postDetail}>{item?.where?.address}</Text>
              </View>
              <View style={styles.postDetailCont}>
                <Text style={styles.postDetail}>When:</Text>
                <Image source={postCalender} style={styles.detailImage}></Image>
                <Text style={styles.postDetail}>{item?.when}</Text>
              </View>
              <View style={styles.commentTitle}>
                <Text style={styles.likeCount}>{item?.gratis}</Text>
                <TouchableOpacity activeOpacity={1} style={styles.commentCont}>
                  <Text style={styles.msgCount}>{item?.comment}</Text>
                  <Image style={styles.commentImage} source={comment}></Image>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: 'gray',
                  marginHorizontal: 12,
                }}></View>
              <View style={styles.commentContTwo}>
                <TouchableOpacity
                  onPress={() => OfferModalShow(item.id, index)}>
                  <Image
                    source={gratitudeBlack}
                    style={styles.commentImgTwo}></Image>
                </TouchableOpacity>
                <View
                  style={{
                    height: 20,
                    backgroundColor: 'gray',
                    marginHorizontal: 15,
                    width: 2,
                  }}></View>
                <TouchableOpacity onPress={() => addNewComment(item.id, index)}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#000000',
                      alignItems: 'center',
                    }}>
                    Comment
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: 'gray',
                  marginHorizontal: 12,
                }}></View>
              {item?.comment !== 0 ? (
                <View>
                  {item.isComment ? (
                    <TouchableOpacity
                      onPress={() => showCommentonPost(item, index)}>
                      <Text style={styles.commentContShow}>hide comments</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => showCommentonPost(item, index)}>
                      <Text style={styles.commentContShow}>show comments</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View></View>
              )}

              {item.isComment && item.commentListData.length !== 0 ? (
                <View
                  style={{height: 'auto', maxHeight: 250, overflow: 'hidden'}}>
                  <ScrollView
                    onTouchEnd={() => CommentListCall(item.id, index)}>
                    <FlatList
                      // onEndReached={}
                      onEndReachedThreshold={0.8}
                      data={item.commentListData}
                      renderItem={({item}) => (
                        <View>
                          <View style={styles.commentImgProfile}>
                            <Image
                              style={styles.postProfile}
                              source={{uri: item?.commenter?.pic}}></Image>
                            <View style={styles.commentDisplayCont}>
                              <Text style={{fontSize: 12, color: '#110101'}}>
                                {item?.commenter?.first_name}{' '}
                                {item?.commenter?.last_name}
                              </Text>
                              <Text style={styles.replyMsgCont}>
                                {item?.content}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.replyContainer}>
                            <TouchableOpacity
                              onPress={() =>
                                openReplyGratis(
                                  item.post_id,
                                  item.id,
                                  '',
                                  index,
                                )
                              }>
                              <Image
                                style={styles.replyImg}
                                source={gratitudeBlack}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => onReplyClick(item.id)}>
                              <Text style={styles.replyLbl}>reply</Text>
                            </TouchableOpacity>

                            <Text style={styles.minuteCont}>{item.date}</Text>
                          </View>

                          {/* {commentList?.reply?.content ? ( */}

                          {item.reply.map((subItem: any, jindex: any) => {
                            return (
                              <>
                                <View>
                                  <View style={styles.commentImgProfileTwo}>
                                    <Image
                                      style={styles.postProfile}
                                      source={{
                                        uri: subItem?.commenter?.pic,
                                      }}></Image>
                                    <View
                                      style={[
                                        styles.commentDisplayCont,
                                        {width: 210},
                                      ]}>
                                      <Text
                                        style={{
                                          fontSize: 12,
                                          color: '#110101',
                                        }}>
                                        {subItem.commenter.first_name}{' '}
                                        {subItem.commenter.last_name}
                                      </Text>
                                      <Text style={styles.replyMsgCont}>
                                        {subItem.content}
                                      </Text>
                                    </View>
                                  </View>

                                  <View style={styles.replyContainerTwo}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        openReplyGratis(
                                          item.post_id,
                                          item.id,
                                          subItem.key,
                                          index,
                                        )
                                      }>
                                      <Image
                                        style={styles.replyImg}
                                        source={gratitudeBlack}></Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() => onReplyClick(item.id)}>
                                      <Text style={styles.replyLbl}>reply</Text>
                                    </TouchableOpacity>

                                    <Text style={styles.minuteCont}>
                                      {subItem.date}
                                    </Text>
                                  </View>
                                </View>
                              </>
                            );
                          })}

                          {/* ) : (
                              <View></View>
                            )} */}
                        </View>
                      )}></FlatList>
                  </ScrollView>
                </View>
              ) : (
                <View></View>
              )}

              {commentLoading ? (
                <ActivityIndicator
                  color="black"
                  style={{marginLeft: 8}}></ActivityIndicator>
              ) : (
                <View></View>
              )}
              {showComment ? (
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Make a Comment"
                    value={addnewCmt}
                    onChangeText={text => onAddComment(text)}></TextInput>
                  <TouchableOpacity
                    style={{alignSelf: 'center'}}
                    onPress={() => addCommentHide(item, index)}>
                    <Image
                      style={{height: 40, width: 40}}
                      source={send}></Image>
                  </TouchableOpacity>
                </View>
              ) : (
                <View></View>
              )}
            </View>
          )}></FlatList>
      </KeyboardAvoidingView>
      {loading ? (
        <ActivityIndicator
          color="black"
          style={{marginLeft: 8}}></ActivityIndicator>
      ) : ( 
        <View></View>
      )}
      </View>
{postlistTtl === 0 ? <View><Text style={{fontSize:18,fontWeight:'400',textAlign:'center',marginTop:20}}>No Record Found</Text></View>: <View></View>}
      
      {/* </TouchableOpacity> */}
      <Modal transparent onDismiss={OfferModalClose} visible={offerModal}>
        <GestureRecognizer onSwipeDown={OfferModalClose} style={styles.gesture}>
          <TouchableOpacity
            style={styles.containerGallery}
            activeOpacity={1}
            onPress={OfferModalClose}
          />
        </GestureRecognizer>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <TouchableOpacity activeOpacity={1} style={styles.gratiescontainer}>
            <View>
              <Text style={styles.gratiesTitle}>Give some Gratis</Text>
              <View style={styles.gratisCont}>
                <TouchableOpacity onPress={gratisMinusClick}>
                  <Image
                    source={minus}
                    style={{height: 30, width: 30, marginRight: 50}}></Image>
                </TouchableOpacity>
                <Image
                  resizeMode="cover"
                  style={styles.gratisimg}
                  source={Gratis}></Image>
                <Text style={styles.gratistext}>{gratisNo}</Text>
                <TouchableOpacity onPress={gratisPlusClick}>
                  <Image
                    source={plus}
                    style={{height: 30, width: 30, marginLeft: 50}}></Image>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => OfferModalHide()}
                activeOpacity={0.8}
                style={styles.purchaseContainer}>
                <View />
                <Text style={styles.titleTwo}>Give</Text>
                <TouchableOpacity>
                  <ImageComponent
                    source={buttonArrowGreen}
                    style={styles.buttonArrow}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        transparent
        onDismiss={() => openReplyOfferModal(false)}
        visible={replyofferModal}>
        <GestureRecognizer
          onSwipeDown={() => openReplyOfferModal(false)}
          style={styles.gesture}>
          <TouchableOpacity
            style={styles.containerGallery}
            activeOpacity={1}
            onPress={() => openReplyOfferModal(false)}
          />
        </GestureRecognizer>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <TouchableOpacity activeOpacity={1} style={styles.gratiescontainer}>
            <View>
              <Text style={styles.gratiesTitle}>Give some Gratis Comment</Text>
              <View style={styles.gratisCont}>
                <TouchableOpacity onPress={gratisMinusClick}>
                  <Image
                    source={minus}
                    style={{height: 30, width: 30, marginRight: 50}}></Image>
                </TouchableOpacity>
                <Image
                  resizeMode="cover"
                  style={styles.gratisimg}
                  source={Gratis}></Image>
                <Text style={styles.gratistext}>{gratisNo}</Text>
                <TouchableOpacity onPress={gratisPlusClick}>
                  <Image
                    source={plus}
                    style={{height: 30, width: 30, marginLeft: 50}}></Image>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => replyOfferModalHide()}
                activeOpacity={0.8}
                style={styles.purchaseContainer}>
                <View />
                <Text style={styles.titleTwo}>Give</Text>
                <TouchableOpacity>
                  <ImageComponent
                    source={buttonArrowGreen}
                    style={styles.buttonArrow}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      {/* <Modal transparent={true} visible={offerModal} animationType="slide">
       
      </Modal> */}
      <Modal
        transparent={true}
        visible={addComment}
        animationType="slide"
        //  onDismiss={() => addCommentModal(false)}
      >
        <GestureRecognizer
          // onSwipeDown={() => addCommentModal(false)}
          style={styles.gesture}>
          <TouchableOpacity
            style={[styles.containerGallery]}
            activeOpacity={1}
            onPress={keyboardDismiss}
          />
        </GestureRecognizer>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[
            styles.keyboardView,
            {position: 'absolute', left: 0, right: 0},
          ]}>
          <TouchableOpacity activeOpacity={1} style={styles.commentContainer}>
            <View>
              <TouchableOpacity
                style={{position: 'absolute', right: 0, zIndex: 111122}}
                activeOpacity={0.5}
                onPress={() => addCommentModal(false)}>
                <Image
                  source={closeCard}
                  style={{height: 25, width: 25}}></Image>
              </TouchableOpacity>
              <Text style={styles.gratiesTitle}>Add Comment</Text>
              <View>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Comment"
                  onChangeText={text => onAddCommentReply(text)}></TextInput>
              </View>
              <TouchableOpacity
                onPress={() => onReplyClose()}
                activeOpacity={0.8}
                style={styles.purchaseContainer}>
                <View />
                <Text style={styles.titleTwo}>Add Comment</Text>
                <TouchableOpacity>
                  <ImageComponent
                    source={buttonArrowGreen}
                    style={styles.buttonArrow}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};
