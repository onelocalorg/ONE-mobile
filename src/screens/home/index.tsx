import React, { useCallback, useEffect, useRef, useState } from "react";
import { createStyleSheet } from "./style";
import { useAppTheme } from "@app-hooks/use-app-theme";
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
  TextComponent,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useStringsAndLabels } from "@app-hooks/use-strings-and-labels";
import { ImageComponent } from "@components/image-component";
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
  gratisGreen,
  gratitudeBlack,
  greenImage,
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
} from "@assets/images";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "@network/reducers/store";
import {
  UserProfileState,
  onSetUser,
} from "@network/reducers/user-profile-reducer";
import {
  useUserProfile,
  userProfileParsedData,
} from "@network/hooks/user-service-hooks/use-user-profile";
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from "@react-navigation/native";
import { navigations } from "@config/app-navigation/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GetLocation from "react-native-get-location";
import { Loader } from "@components/loader";
import Popover, { PopoverPlacement, Rect } from "react-native-popover-view";
import { SizedBox } from "@components/sized-box";
import { verticalScale } from "@theme/device/normalize";
import {
  DatePickerRefProps,
  DateRangePicker,
} from "@components/date-range-picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Toast from "react-native-simple-toast";
import GestureRecognizer from "react-native-swipe-gestures";
import { Result } from "@network/hooks/home-service-hooks/use-event-lists";
import { Alert } from "react-native";
import { API_URL, setData } from "@network/constant";
import Swiper from "react-native-swiper";
import { CommentList } from "./commetList";

interface Range {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface HomeScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const HomeScreen = (props: HomeScreenProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const { navigation } = props || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [ProfileData, setUserProfile]: any = useState("");
  const [userList, recentlyJoinUser] = useState([]);
  var [postList, postListData]: any = useState([]);
  const [open, setOpen] = useState(false);
  const [pagination, postLoadData] = useState(false);
  const [offerModal, CreateOfferModal] = useState(false);
  const [replyofferModal, openReplyOfferModal] = useState(false);
  var [location, setUserLocation]: any = useState(); 
  const [addnewCmt, onAddComment] = useState("");
  const [addnewCmtReply, onAddCommentReply] = useState("");
  const [isLoading, LodingData] = useState(false);
  const [loading, onPageLoad] = useState(false);
  const [commentListScrollEnable, setCommentListScrollEnable] = useState(true);
  const [commentLoading, onPageLoadComment] = useState(false);
  const [ismoreData, isMoreDataLoad] = useState(false);
  const [ismoreCommentLoad, isMoreCommentData] = useState(true);
  const [replyId, commentReplyPostId] = useState("");
  const [replyIndex, setReplayIndex] = useState("");
  const [setReplyId, setReplyCommentId] = useState("");
  var [postId, postIdData]: any = useState();
  var [gratisIndex, gratisIndexData]: any = useState(); 
  var [commentIndex, setCommentIndex]: any = useState(); 
  var [showComment, showCommentPost] = useState(false); 
  var [addComment, addCommentModal] = useState(false);
  var [gratisNo, totalGratisData]: any = useState(10);
  var [gratisNoComment, totalGratisCommentData]: any = useState(10);
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
  const [postlistTtl, postListTotalResult] = useState();
  const [postContent, postContentModal] = useState(false);
  const [reoportModal, reportModalShowHide] = useState(false);
  const [postHideId, hidePostContentIDData] = useState();
  const [reportPost, addReportReason] = useState("");
  const [postCommentID, setPostCommentID] = useState();
  const [postCommentIndex, setPostIndexID] = useState();
  const [type, eventTypeData] = useState("offer");
  const [gratistype, setGratisSelectType] = useState();
  const [childjIndex, setChildIndexForGratis]: any = useState();
  const [postCommentIndexTwo, setPostCommentIndexTwo]: any = useState();
  const [postIndexTwo, setPostIndexTwo]: any = useState();
  const flatlistRef = useRef<FlatList>(null);

  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { id: string; pic: string; city: string; state: string } };
  const { refetch } = useUserProfile({
    userId: user?.id,
  });

  var makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() - 1);
  const [range, setRange] = useState<Range>({
    startDate: makeDate,
    endDate: new Date(),
  });

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      LogBox.ignoreAllLogs();
      getRecentlyJoinUserAPI();
      requestLocationPermission();
      setPage(page);
    }, [range?.startDate, range?.endDate, page])
  );

  useEffect(() => {
    LogBox.ignoreAllLogs();
    console.log('postListAPI 1')
    postListAPI();
    getUserProfileAPI();
    requestLocationPermission();
    eventTypeData(type);
    setPage(page);
  }, [ page,type, range?.startDate, range?.endDate, searchQuery]);

  useFocusEffect(
    useCallback(() => {
      //  getCommentListAPI()
    }, [pageCmt])
  );

  const requestLocationPermission = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 6000,
    })
      .then((location) => {
        setUserLocation(location);
        console.log(
          "---------------------location---------------------",
          location
        );
        if (location) {
          postListAPI();
          console.log('postListAPI 2')
        }
      })
      .catch((error) => {
        console.log("---------------------error---------------------", error);
        const { code, message } = error;
        console.log(code, message);
      });
  };

  const onNavigateToCreatePost = () => {
    setData("POST_TAB_OPEN_INDEX", 1);
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
    if (gratistype === 1) {
      addReplyGratisAPI();
    } else {
      addChildReplyGratisAPI();
    }
  };

  const openReplyGratis = (
    postIds: any,
    replyId: any,
    replyKey: any,
    index: any,
    cindex: any,
    setGratis: any,
    childIndex: any
  ) => {
    console.log("childIndex1111", childIndex);
    setChildIndexForGratis(childIndex);
    setGratisSelectType(setGratis);
    openReplyOfferModal(true);
    totalGratisCommentData(10);
    setreplyGratisId(replyId);
    setreplyGratisKey(replyKey);
    postIdData(postIds);
    gratisIndexData(index);
    setCommentIndex(cindex);
    console.log("----------cindex----------", cindex);
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

  const gratisCommentPlusClick = () => {
    gratisNoComment = gratisNoComment + 1;
    totalGratisCommentData(gratisNoComment);
  };
  const gratisCommrntMinusClick = () => {
    if (gratisNoComment > 10) {
      gratisNoComment = gratisNoComment - 1;
      totalGratisCommentData(gratisNoComment);
    }
  };

  const onNavigateToProfile = () => {
    if (user?.id) {
      refetch().then((res) => {
        const userData = userProfileParsedData(res?.data?.data);
        console.log("check1===", userData);
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
      console.log(res, "--------------date pick------------");
      const startDate = res?.startDate;
      const endDate = res?.endDate;
      setOpen(false);
      setRange({ startDate, endDate });
      requestLocationPermission();
      LodingData(true);
      postListAPI();
      console.log('postListAPI 3')
      console.log(range, "---------------set range ---------------");
    },
    [setOpen, setRange]
  );

  const getUserProfileAPI = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("token", token);
    try {
      const response = await fetch(API_URL + "/v1/users/" + user.id, {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
      });
      const dataItem = await response.json();
      console.log("-----------------Response User Profile API------------");
      console.log(dataItem);
      console.log(dataItem.data.pic);
      setUserProfile(dataItem.data);
      AsyncStorage.setItem("profile", dataItem.data.pic);
      AsyncStorage.setItem("uniqueId", dataItem.data.user_unique_id);
    } catch (error) {
      console.log(error);
    }
  };

  async function commentOnPost(postID: any, index: any) {
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      content: addnewCmt,
    };
    console.log("===========Comment on Post API Request ==============");
    console.log(data);
    console.log(API_URL + "/v1/posts/" + postID.id + "/comments/create");
    try {
      const response = await fetch(
        API_URL + "/v1/posts/" + postID.id + "/comments/create",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(data),
        }
      );
      const dataItem = await response.json();

      postID.isComment = true;
      console.log("=========== Comment on Post API Response ==============");
      console.log(JSON.stringify(dataItem));
      onAddComment("");
      onAddCommentReply("");
      getCommentListAPITwo(postID.id, index);
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function getCommentListAPITwo(postID: any, index: any) {
    // postList[index]['commentListData'] = [];
    isMoreCommentData(true);
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      post_id: postID,
    };
    console.log(
      API_URL + "/v1/comments?limit=25&+page=1" + "&post_id=" + postID
    );
    console.log(data);
    try {
      const response = await fetch(
        API_URL + "/v1/comments?limit=25&page=1" + "&post_id=" + postID,
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(data),
        }
      );

      // setCmtPage(pageCmt)
      const dataItem = await response.json();
      console.log(dataItem);
      LodingData(false);
      var cmtList = dataItem?.data?.results;

      let markers = [...postList];

      markers[index]["commentListData"] = [...cmtList];
      // markers[index]['isComment'] = true;

      console.log(markers[index]['isComment'],'postList111111111')
      postListData(markers);
      console.log(markers[index]['isComment'],'postList22222')
      // flatlistRef?.current?.scrollToIndex({index: 0});
      // flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
      console.log(
        "-----------comment List-------------",
        postList[index]["commentListData"]
      );

      onPageLoadComment(false);
      setTotalPages(dataItem?.data?.totalPages);
      setCurrentPage(dataItem?.data?.page);
      if (pageCmt > dataItem?.data?.totalPages) {
        isMoreCommentData(false);
      }
      setCommentListScrollEnable(true);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function getCommentListAPI(postID: any, index: any) {
    // postList[index]['commentListData'] = [];
    isMoreCommentData(true);
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      post_id: postID,
    };
    console.log(
      API_URL + "/v1/comments?limit=25&+page=" + pageCmt + "&post_id=" + postID
    );
    console.log(data);
    try {
      const response = await fetch(
        API_URL +
          "/v1/comments?limit=25&page=" +
          pageCmt +
          "&post_id=" +
          postID,
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(data),
        }
      );

      // setCmtPage(pageCmt)
      const dataItem = await response.json();
      console.log(JSON.stringify(dataItem));
      LodingData(false);
      var cmtList = dataItem?.data?.results;

      let markers = [...postList];

      if (markers[index]["commentListData"]) {
        markers[index]["commentListData"] = [
          ...markers[index]["commentListData"],
          ...cmtList,
        ];
      } else {
        markers[index]["commentListData"] = [...cmtList];
      }
      postListData(markers);
      // flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
      onPageLoadComment(false);
      setTotalPages(dataItem?.data?.totalPages);
      setCurrentPage(dataItem?.data?.page);
      if (pageCmt > dataItem?.data?.totalPages) {
        isMoreCommentData(false);
      }
      setCommentListScrollEnable(true);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function replyCommentOnPostAPI() {
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      content: addnewCmtReply,
      comment_id: replyId,
    };
    console.log(data);
    try {
      const response = await fetch(
        API_URL + "/v1/posts/" + setReplyId + "/comments/create",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(data),
        }
      );
      const dataItem = await response.json();
      console.log("===========Comment on Post API Request ==============");

      let markers = [...postList];
      var commentReplyArray = dataItem.data["reply"];

      markers[postIndexTwo]["commentListData"][postCommentIndexTwo][
        "reply"
      ].push(commentReplyArray[commentReplyArray.length - 1]);

      postListData(markers);

      console.log(
        "---------------responce reply comment post----------",
        JSON.stringify(dataItem)
      );
      LodingData(false);
      getCommentListAPI(setReplyId, replyIndex);

      console.log(dataItem);
    } catch (error) {
      console.error(error);
    }
  }

  async function postListAPI() {
    isMoreDataLoad(true);
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      // start_date:
      //   moment(range.startDate).format('YYYY-MM-DD') +
      //   ' ' +
      //   moment(setStartTime).format('HH:mm'),
      // end_date:
      //   moment(range.endDate).format('YYYY-MM-DD') +
      //   ' ' +
      //   moment(setEndTime).format('HH:mm'),
      // type: type,
      searchtext: searchQuery,
    };
    console.log(
      "=========== Post List API Request" +
        API_URL +
        "/v1/posts/list?limit=10&page=" +
        page +
        "=============="
    );
    console.log(data);
    try {
      const response = await fetch(
        API_URL + "/v1/posts/list?limit=10&page=" + page,
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(data),
        }
      );
      const dataItem = await response.json();
      console.log("=========== Post List API Response ==============");
      console.log(dataItem);

      postLoadData(false);
      onPageLoad(false);

      if (page === 1) {
        const result = dataItem?.data?.results.map((item: any) => {
          return { ...item, isComment: false, commentListData: [] };
        });
        postListData(result);

        console.log(result, "111111111111");
      }
      if (page > 1) {
        const result = dataItem?.data?.results.map((item: any) => {
          var resultData = { ...item, isComment: false, commentListData: [] };
          return { ...postList, resultData };
        });
        postListData(result);
      }
      postListTotalResult(dataItem?.data?.totalResults);
      LodingData(false);
      if (dataItem?.data?.page === dataItem?.data?.totalPages) {
        isMoreDataLoad(false);
      }
    } catch (error) {
      LodingData(false);
      console.error(
        "----------------" + API_URL + "/v1/posts/list?limit=10&page=",
        error
      );
    }
  }

  async function addGratisAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      postId: postId,
      points: gratisNo,
    };
    console.log(API_URL + "/v1/posts/gratis-sharing");
    console.log(data);
    try {
      const response = await fetch(API_URL + "/v1/posts/gratis-sharing", {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
        body: Object.keys(data)
          .map((key) => key + "=" + data[key])
          .join("&"),
      });
      const dataItem = await response.json();
      console.log("=========== Gratis Data API Response ==============");
      console.log(dataItem);
      if (dataItem?.success === true) {
        let markers = [...postList];
        markers[gratisIndex] = {
          ...markers[gratisIndex],
          gratis: dataItem?.data?.data?.postGratis,
        };
        postListData(markers);
      }

      console.log(dataItem?.data?.data?.postGratis);
      console.log(postList, "------------post List---------------");
      if (dataItem?.success === false) {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }

      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function addReplyGratisAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      postId: postId,
      points: gratisNoComment,
      commentId: gratisCmtID,
      commentKey: gratisCmtKey,
    };
    console.log(
      "=========== Gratis Reply Data API Reques" +
        API_URL +
        "/v1/posts/gratis-sharing =============="
    );
    console.log(data);
    try {
      const response = await fetch(API_URL + "/v1/posts/gratis-sharing", {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(data),
      });
      const dataItem = await response.json();
      console.log("=========== Gratis Data Reply API Response ==============");
      console.log(dataItem);
      if (dataItem?.success === true) {
        let markers = [...postList];

        markers[gratisIndex] = {
          ...markers[gratisIndex],
          gratis: dataItem?.data?.data?.postGratis,
        };
        markers[gratisIndex]["commentListData"][commentIndex]["gratis"] =
          dataItem?.data?.data?.commentsGratis;

        postListData(markers);
      }

      if (dataItem?.success === false) {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function addChildReplyGratisAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      postId: postId,
      points: gratisNoComment,
      commentId: gratisCmtID,
      commentKey: gratisCmtKey,
    };
    console.log(
      "=========== Gratis Reply Data API Reques" +
        API_URL +
        "/v1/posts/gratis-sharing =============="
    );
    console.log(data);
    try {
      const response = await fetch(API_URL + "/v1/posts/gratis-sharing", {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(data),
      });
      const dataItem = await response.json();
      console.log("=========== Gratis Data Reply API Response ==============");
      console.log(dataItem);
      if (dataItem?.success === true) {
        let markers = [...postList];

        markers[gratisIndex] = {
          ...markers[gratisIndex],
          gratis: dataItem?.data?.data?.postGratis,
        };
        markers[gratisIndex]["commentListData"][commentIndex]["reply"][
          childjIndex
        ]["gratis"] = dataItem?.data?.data?.replayGratis;

        console.log(
          "commentListData 222",
          markers[gratisIndex]["commentListData"]
        );
        console.log(dataItem?.data?.data?.replayGratis);
        console.log(postList, "------------ post List ---------------");
        postListData(markers);
      }

      if (dataItem?.success === false) {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function getRecentlyJoinUserAPI() {
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      radius: 25,
      user_lat: location?.latitude,
      user_long: location?.longitude,
    };
    console.log("=========== Get Recentely Join API Request ==============");
    console.log(data);
    try {
      const response = await fetch(API_URL + "/v1/users/recently-joined", {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
        body: Object.keys(data)
          .map((key) => key + "=" + data[key])
          .join("&"),
      });
      const dataItem = await response.json();
      console.log(
        "=========== Get Recentely Join API Response" +
          API_URL +
          "/v1/users/recently-joined =============="
      );
      console.log(dataItem);
      recentlyJoinUser(dataItem?.data);
    } catch (error) {
      console.error(error);
    }
  }

  const postDataLoad = () => {
    console.log(
      "fasdfasfajsdofhajsdjfhaskdjfasjkdbfajksdbfajksdbfasjbsajkbdjfbasj"
    );
    if (ismoreData) {
      onPageLoad(true);
      // page = page + 1;
      setPage(page);
      postListAPI();
      console.log('postListAPI 4')
    }
  };

  async function blockUserAPI(postID: any, selectOP: any) {
    const token = await AsyncStorage.getItem("token");
    console.log(token);
    try {
      const response = await fetch(API_URL + "/v1/posts/block-user/" + postID, {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
        // body: JSON.stringify({
        //   "comment" : "blockUser"
        // }),
      });
      const dataItem = await response.json();
      console.log("===========Block User data Response==============");
      console.log(API_URL + "/v1/posts/block-user/" + postID);
      LodingData(false);
      console.log(dataItem);
      if (dataItem.success === true) {
        if (selectOP === 1) {
          postListAPI();
          console.log('postListAPI 5')
          Toast.show("User Block successfully", Toast.LONG, {
            backgroundColor: "black",
          });
        } else if (selectOP === 2) {
          postListAPI();
          console.log('postListAPI 6')
          Toast.show("Report Submit successfully", Toast.LONG, {
            backgroundColor: "black",
          });
        } else {
          postListAPI();
          console.log('postListAPI 7')
          Toast.show("Post Hide successfully", Toast.LONG, {
            backgroundColor: "black",
          });
        }
      }

      if (dataItem.success === false) {
        Toast.show(dataItem.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  const showCommentonPost = (data: any, jindex: any) => {
    setCmtPage(initialValue);
    LodingData(true);
    if (postList[jindex]["isComment"] === true) {
      console.log('-----------showCommentonPost----------------------')
      let markers = [...postList];
      markers[jindex] = {
        ...markers[jindex],
        commentListData: [],
        isComment: false,
      };
      postListData(markers);
      LodingData(false);
    } else {
      console.log('-----------showCommentonPost1111----------------------')
      postList[jindex]["isComment"] = true;
      setReplyCommentId(data.id);
      getCommentListAPITwo(data.id, jindex);
    }
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
    if (addnewCmt === "") {
      Toast.show("Add Comment", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      LodingData(true);
      commentOnPost(commentData, index);
    }
  };

  const onReplyClick = (
    postId: any,
    index: any,
    parentIndex: any,
  ) => {
    commentReplyPostId(postId);
    setReplayIndex(replyId);
    setPostCommentIndexTwo(index);
    setPostIndexTwo(parentIndex);
    addCommentModal(true);
  };

  const onReplyClose = () => {
    if (addnewCmtReply === "") {
      Toast.show("Add Comment", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      LodingData(true);
      replyCommentOnPostAPI();
      addCommentModal(false);
    }
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  useFocusEffect(
    useCallback(() => {
      getCommentListAPI(postCommentID, postCommentIndex);
    }, [pageCmt])
  );

  const CommentListCall = useCallback(
    (post_id: any, indexId: any) => {
      // if(ismoreCommentLoad)
      console.log(currentPages, "===============currentPages 111===========");
      console.log(
        totalPages,
        "==================totalPages 1111=================="
      );
      if (pageCmt < totalPages) {
        console.log(currentPages, "===============currentPages===========");
        console.log(
          totalPages,
          "==================totalPages=================="
        );
        setCommentListScrollEnable(false);
        onPageLoadComment(true);
        setCmtPage(pageCmt + 1);
        setPostIndexID(indexId);
        setPostCommentID(post_id);
      }
    },
    [pageCmt]
  );

  const onConfirmEndTime = useCallback((res: any) => {
    console.log(res);
    setEndTimeData(res);
    endTimePicker(false);
    LodingData(true);
    postListAPI();
    console.log('postListAPI 8')
  }, []);

  const onConfirmStrtTime = useCallback((res: any) => {
    console.log(res);
    setStartTimeData(res);
    startTimePicker(false);
    LodingData(true);
    postListAPI();
    console.log('postListAPI 9')
  }, []);
  const onDismissTimePicker = () => {
    startTimePicker(false);
    endTimePicker(false);
  };

  const recentUserProfilePress = (id: any) => {
    AsyncStorage.setItem("recentUserId", id);
    navigation.navigate(navigations.RECENTUSERPROFILE);
  };

  const blockUserAlert = (type: any) => {
    Alert.alert(
      strings.blockUser,
      strings.areYouBlockUser,
      [
        { text: strings.no, onPress: () => null, style: "destructive" },
        {
          text: strings.yes,
          onPress: () => {
            blockUserAPI(postHideId, type);
            LodingData(true);
          },
        },
      ],
      { cancelable: false }
    );
    postContentModal(false);
  };

  const hideUserAlert = (type: any) => {
    Alert.alert(
      strings.hidePost,
      strings.areyouHide,
      [
        { text: strings.no, onPress: () => null, style: "destructive" },
        {
          text: strings.yes,
          onPress: () => {
            blockUserAPI(postHideId, type);
            LodingData(true);
          },
        },
      ],
      { cancelable: false }
    );
    postContentModal(false);
  };

  const onEventTypeClick = (types: string) => {
    if (types !== type) {
      LodingData(true);
      console.log(types, "--------------type-------------------");
      eventTypeData(types);
      console.log(types, "--------------eventType-------------------");
    }
  };

  const closeModal = () => {
    postContentModal(false);
  };

  const openPostModal = (postID: any) => {
    hidePostContentIDData(postID);
    postContentModal(true);
  };
  const postHideOptionSelect = (postSelectType: any) => {
    if (postSelectType === 1) {
      console.log(postSelectType, "-------postSelectType--------");
      blockUserAlert(postSelectType);
    } else if (postSelectType === 2) {
      console.log(postSelectType, "-------postSelectType--------");
      addReportReason("");
      reportModalShowHide(true);
    } else if (postSelectType === 3) {
      console.log(postSelectType, "-------postSelectType--------");
      hideUserAlert(postSelectType);
    }
  };

  const commentFlatlistRender = (indexParent: any, itemParent: any) => {
    return (
      <FlatList
        keyExtractor={(item, index) => item.key}
        ref={flatlistRef}
        onEndReachedThreshold={0.05}
        data={itemParent.commentListData}
        renderItem={({ item, index }) => (
          <View>
            <View style={styles.commentImgProfile}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => recentUserProfilePress(item?.commenter.id)}
              >
                <ImageComponent
                  resizeMode="cover"
                  style={styles.postProfile}
                  source={{
                    uri: item?.commenter?.pic,
                  }}
                ></ImageComponent>
              </TouchableOpacity>
              <View style={styles.commentDisplayCont}>
                <Text style={{ fontSize: 12, color: "#110101" }}>
                  {item?.commenter?.first_name} {item?.commenter?.last_name}
                </Text>
                <Text style={styles.replyMsgCont}>{item?.content}</Text>
              </View>
            </View>

            <View style={styles.replyContainer}>
              <ImageComponent
                source={Vector}
                style={styles.vectorImg}
              ></ImageComponent>
              <TouchableOpacity
                onPress={() => onReplyClick(item.id, index, indexParent)}
              >
                <Text style={styles.replyLbl}>reply</Text>
              </TouchableOpacity>

              <Text style={styles.minuteCont}>{item.date}</Text>
              <Text style={styles.minuteCont}>{item.gratis}</Text>
              <TouchableOpacity
                onPress={() =>
                  openReplyGratis(
                    item.post_id,
                    item.id,
                    "",
                    indexParent,
                    index,
                    1,
                    ""
                  )
                }
              >
                <ImageComponent
                  resizeMode="cover"
                  style={styles.replyImg}
                  source={gratisGreen}
                ></ImageComponent>
              </TouchableOpacity>
            </View>

            {/* {commentList?.reply?.content ? ( */}

            {item.reply.map((subItem: any, jindex: any) => {
              return (
                <>
                  <View>
                    <View style={styles.commentImgProfileTwo}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                          recentUserProfilePress(subItem?.commenter.id)
                        }
                      >
                        <ImageComponent
                          resizeMode="cover"
                          style={styles.postProfile}
                          source={{
                            uri: subItem?.commenter?.pic,
                          }}
                        ></ImageComponent>
                      </TouchableOpacity>
                      <View style={[styles.commentDisplayCont, { width: 210 }]}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#110101",
                          }}
                        >
                          {subItem.commenter.first_name}{" "}
                          {subItem.commenter.last_name}
                        </Text>
                        <Text style={styles.replyMsgCont}>
                          {subItem.content}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.replyContainerTwo}>
                      <ImageComponent
                        source={Vector}
                        style={styles.vectorImgTwo}
                      ></ImageComponent>
                      <TouchableOpacity
                        onPress={() =>
                          onReplyClick(item.id, index, indexParent)
                        }
                      >
                        <Text style={styles.replyLbl}>reply</Text>
                      </TouchableOpacity>

                      <Text style={styles.minuteCont}>{subItem.date}</Text>
                      <Text style={styles.minuteCont}>{subItem.gratis}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          openReplyGratis(
                            item.post_id,
                            item.id,
                            subItem.key,
                            indexParent,
                            index,
                            2,
                            jindex
                          )
                        }
                      >
                        <ImageComponent
                          style={styles.replyImg}
                          source={gratisGreen}
                        ></ImageComponent>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              );
            })}

            {/* ) : (
                              <View></View>
                            )} */}
          </View>
        )}
      ></FlatList>
    );
  };

  const CommentListNavigatiion = (id: any) => {
    AsyncStorage.setItem("commentID", id);
    navigation.navigate(navigations.COMMENTLIST);
  };

  const submitReportReason = () => {
    if (reportPost === "") {
      Toast.show("Add Reason", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      blockUserAPI(postHideId, 2);
      console.log("blockUserAPI");
      postContentModal(false);
      reportModalShowHide(false);
    }
  };

  const setSerchValue = useCallback(
    (searchData: any) => {
      setSearchQuery(searchData);
      postListAPI();
      console.log('postListAPI 10')
    },
    [searchQuery]
  );

  return (
    <>
      {/* <ScrollView></ScrollView> */}

      <View style={styles.MainPostContainer}>
        <Loader visible={isLoading} showOverlay />

        {/* ------------------Header------------------- */}
        <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
          <View style={styles.searchContainer}>
            <ImageComponent
              style={styles.searchIcon}
              source={Search}
            ></ImageComponent>
            <TextInput
              value={searchQuery}
              placeholderTextColor="#FFFF"
              placeholder="Search"
              style={styles.searchInput}
              onChangeText={(value) => {
                console.log(value);
                setSerchValue(value);
              }}
            ></TextInput>
          </View>
          <View style={styles.oneContainer}>
            <ImageComponent
              style={styles.oneContainerImage}
              source={onelogo}
            ></ImageComponent>
            <View>
              <Text style={styles.oneContainerText}>NE</Text>
              <Text style={styles.localText}>L o c a l</Text>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onNavigateToProfile}
              style={styles.profileView}
            >
              <ImageComponent
                resizeMode="cover"
                isUrl={!!user?.pic}
                source={dummy}
                uri={ProfileData?.pic}
                style={styles.profile}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        {/* ------------------Header Tab------------------- */}
      
        <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        >
          <FlatList
            data={postList}
            keyExtractor={(item) => item.id}
            ListFooterComponent={<View style={{ height: 90 }} />}
            onEndReachedThreshold={0.1} 
            // contentContainerStyle={{ marginBottom: 150 }} 
            keyboardShouldPersistTaps
            ListHeaderComponent={
              <View>
                {userList.length !== 0 ? (
                  <View style={styles.avatarContainer}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    >
                      {userList.map((userList: any) => {
                        return (
                          <TouchableOpacity
                            onPress={() => recentUserProfilePress(userList.id)}
                          >
                            <ImageComponent
                              style={styles.avatarImage}
                              isUrl={!!userList?.pic}
                              resizeMode="cover"
                              uri={userList?.pic}
                            ></ImageComponent>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                ) : (
                  <View></View>
                )}

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.mainPostCont}
                  onPress={onNavigateToCreatePost}
                >
                  <View style={styles.postContainer}>
                    <ImageComponent
                      style={styles.avatar}
                      resizeMode="cover"
                      isUrl={!!user?.pic}
                      source={dummy}
                      uri={ProfileData?.pic}
                    ></ImageComponent>
                    <View style={styles.postInput}>
                      <Text style={{ textAlign: "left", color: "gray" }}>
                        What do you want to post?
                      </Text>
                    </View>
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

                {/* <View>
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
              </View> */}
              </View> 
            }
            initialNumToRender={10} 
           
            onEndReached={({ distanceFromEnd }) => {  
               if(distanceFromEnd > 0) {    
                console.log('111111111 pagination') 
                  postDataLoad();  
               }
            }} 
            renderItem={({ item, index }) => (
              <TouchableOpacity activeOpacity={1} onPress={keyboardDismiss}>
                <View style={styles.feedContainer}>
                  <Text style={styles.posttitle}>{item?.type}</Text>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 14,
                      top: 10,
                      zIndex: 111122,
                    }}
                  >
                    <TouchableOpacity onPress={() => openPostModal(item.id)}>
                      <ImageComponent
                        resizeMode="cover"
                        style={styles.postfilterImage}
                        source={greenImage}
                      ></ImageComponent>
                    </TouchableOpacity>
                  </TouchableOpacity>
                  <View style={styles.userDetailcont}>
                    <TouchableOpacity
                      onPress={() => recentUserProfilePress(item?.user_id.id)}
                    >
                      <ImageComponent
                        resizeMode="cover"
                        style={styles.postProfile}
                        source={{ uri: item?.user_id?.pic }}
                      ></ImageComponent>
                    </TouchableOpacity>
                    <View>
                      <View>
                        {item?.type === "Gratis" ? (
                          <View>
                            <Text numberOfLines={1} style={styles.userName}>
                              {item?.user_id?.first_name}{" "}
                              {item?.user_id?.last_name}{" "}
                            </Text>
                            <Text style={styles.sentPointClass}>
                              sent {item?.to?.users[0]?.point} gratis to{" "}
                              <Text style={styles.userName}>
                                {item?.to?.users[0]?.user_id["first_name"]}{" "}
                                {item?.to?.users[0]?.user_id["last_name"]}{" "}
                                {/* {item?.to?.users[1]?.user_id["first_name"]}{" "}
                              {item?.to?.users[1]?.user_id["last_name"]} */}
                              </Text>
                            </Text>
                          </View>
                        ) : (
                          <Text numberOfLines={1} style={styles.userName}>
                            {item?.user_id?.first_name}{" "}
                            {item?.user_id?.last_name}
                          </Text>
                        )}
                        <Text style={styles.postTime}>{item?.date}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.userListDisplayCont}>
                    <TouchableOpacity
                      onPress={() =>
                        recentUserProfilePress(
                          item?.to?.users[0]?.user_id["id"]
                        )
                      }
                    >
                      <ImageComponent
                        resizeMode="cover"
                        style={styles.userListDisplay}
                        source={{
                          uri: item?.to?.users[0]?.user_id["pic"],
                        }}
                      ></ImageComponent>
                    </TouchableOpacity>
                    {/* <ImageComponent resizeMode='cover' style={styles.userListDisplay} source={{uri:item?.to?.users[1]?.user_id['pic']}}></ImageComponent> */}
                  </View>
                  <Text style={styles.postDes}>{item?.content}</Text>
                  {/* <ImageComponent source={postImage}style={styles.userPost}></ImageComponent> */}
                  <ImageComponent
                    resizeMode="cover"
                    source={{ uri: item.image[0] }}
                    style={styles.userPost}
                  ></ImageComponent>
                  {/* <View style={{ height: 310 }}>
                  <Swiper>
                    {item?.image.map((images: any) => {
                      return (
                        <ImageComponent
                          resizeMode="cover"
                          source={{ uri: images }} 
                          style={styles.userPost}></ImageComponent>
                      );
                    })}
                  </Swiper></View> */}
                  {/* {item?.image[0] != '' ? (
                 
                ) : (
                  <View></View>
                )} */}
                  <View style={styles.postDetailCont}>
                    <Text style={styles.postDetailTitle}>What:</Text>
                    <ImageComponent
                      source={{ uri: item?.what?.icon }}
                      style={styles.detailImage}
                    ></ImageComponent>
                    <Text style={styles.postDetail}>{item?.what?.name}</Text>
                  </View>
                  <View style={styles.postDetailCont}>
                    <Text style={styles.postDetailTitle}>For:</Text>
                    <Image
                      source={{ uri: item?.for?.icon }}
                      style={styles.detailImage}
                    ></Image>
                    <Text style={styles.postDetail}>{item?.for?.name}</Text>
                  </View>
                  <View style={styles.postDetailCont}>
                    <Text style={styles.postDetailTitle}>Where:</Text>
                    <Image source={pin} style={styles.detailImage}></Image>
                    <Text style={styles.postDetail}>
                      {item?.where?.address}
                    </Text>
                  </View>
                  <View style={styles.postDetailCont}>
                    <Text style={styles.postDetailTitle}>When:</Text>
                    <Image
                      source={postCalender}
                      style={styles.detailImage}
                    ></Image>
                    <Text style={styles.postDetail}>{item?.when}</Text>
                  </View>
                  <View style={styles.commentTitle}>
                    <Text style={styles.likeCount}>{item?.gratis}</Text>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.commentCont}
                    >
                      <Text style={styles.msgCount}>{item?.comment}</Text>
                      <Image
                        style={styles.commentImage}
                        source={comment}
                      ></Image>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "gray",
                      marginHorizontal: 12,
                    }}
                  ></View>
                  <View style={styles.commentContTwo}>
                    <TouchableOpacity
                      onPress={() => OfferModalShow(item.id, index)}
                    >
                      <ImageComponent
                        source={gratitudeBlack}
                        style={styles.commentImgTwo}
                      ></ImageComponent>
                    </TouchableOpacity>
                    <View
                      style={{
                        height: 20,
                        backgroundColor: "gray",
                        marginHorizontal: 15,
                        width: 2,
                      }}
                    ></View>
                    <TouchableOpacity
                      onPress={() => addNewComment(item.id, index)}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#000000",
                          alignItems: "center",
                        }}
                      >
                        Comment
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      height: 1,
                      backgroundColor: "gray",
                      marginHorizontal: 12,
                    }}
                  ></View>

                  {/* <View style={styles.gratisAndCommentContainer}>
                  <TouchableOpacity style={styles.gratisContainer}>
                    <Text style={styles.gratisClass}>+55</Text>
                    <ImageComponent
                      source={gratitudeBlack}
                      style={styles.commentImgTwo}></ImageComponent>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>CommentListNavigatiion(item.id)} style={styles.commentsContainer}>
                    <Text style={styles.commentClass}>36</Text>
                    <ImageComponent
                      source={comment}
                      style={styles.commentImageThree}></ImageComponent>
                  </TouchableOpacity>
                </View> */}
                  {item?.comment !== 0 ? (
                    <View>
                      {item.isComment ? (
                        <TouchableOpacity
                          onPress={() => showCommentonPost(item, index)}
                        >
                          <Text style={styles.commentContShow}>
                            hide comments
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => showCommentonPost(item, index)}
                        >
                          <Text style={styles.commentContShow}>
                            show comments
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    <View></View>
                  )}

                  {item.isComment && item.commentListData.length !== 0 ? (
                    <View
                      style={{
                        height: "auto",
                        maxHeight: 250,
                        overflow: "hidden",
                      }}
                    >
                      <ScrollView
                        onTouchEnd={() => {
                          console.log(
                            "-------------onEndReached---------------"
                          );
                          if (commentListScrollEnable) {
                            CommentListCall(item.id, index);
                          }
                        }}
                      >
                        {commentFlatlistRender(index, item)}
                      </ScrollView>
                    </View>
                  ) : (
                    <View></View>
                  )}

                  {/* <CommentList commentItem={item} post_ID={item.id} postIndex={index} postList={postList} navigation={navigation} ></CommentList> */}

                  {showComment ? (
                    <View style={{ flexDirection: "row" }}>
                      <TextInput
                        style={styles.commentInput}
                        placeholder="Make a Comment"
                        value={addnewCmt}
                        onChangeText={(text) => onAddComment(text)}
                      ></TextInput>
                      <TouchableOpacity
                        style={{ alignSelf: "center" }}
                        onPress={() => addCommentHide(item, index)}
                      >
                        <ImageComponent
                          style={{ height: 40, width: 40 }}
                          source={send}
                        ></ImageComponent>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View></View>
                  )}
                </View>
              </TouchableOpacity>
            )}
          ></FlatList>
          {postList.length === 0 ? (
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "400",
                  alignSelf: "center",
                  marginTop: 20,
                  color: "white",
                }}
              >
                No Record Found
              </Text>
            </View>
          ) : (
            <View></View>
          )}
        </KeyboardAwareScrollView>
        {loading ? (
          <ActivityIndicator
            color="black"
            style={{ marginLeft: 8 }}
          ></ActivityIndicator>
        ) : (
          <View></View>
        )}
      </View>

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
          behavior={Platform.OS === "ios" ? "height" : "height"}
          style={styles.keyboardView}
        >
          <TouchableOpacity activeOpacity={1} style={styles.gratiescontainer}>
            <View>
              <Text style={styles.gratiesTitle}>Give some Gratis</Text>
              <View style={styles.gratisCont}>
                <TouchableOpacity onPress={gratisMinusClick}>
                  <ImageComponent
                    source={minus}
                    style={{
                      height: 30,
                      width: 30,
                      marginRight: 50,
                    }}
                  ></ImageComponent>
                </TouchableOpacity>
                <ImageComponent
                  resizeMode="cover"
                  style={styles.gratisimg}
                  source={Gratis}
                ></ImageComponent>
                <Text style={styles.gratistext}>{gratisNo}</Text>
                <TouchableOpacity onPress={gratisPlusClick}>
                  <ImageComponent
                    source={plus}
                    style={{
                      height: 30,
                      width: 30,
                      marginLeft: 50,
                    }}
                  ></ImageComponent>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => OfferModalHide()}
                activeOpacity={0.8}
                style={styles.purchaseContainer}
              >
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
        visible={replyofferModal}
      >
        <GestureRecognizer
          onSwipeDown={() => openReplyOfferModal(false)}
          style={styles.gesture}
        >
          <TouchableOpacity
            style={styles.containerGallery}
            activeOpacity={1}
            onPress={() => openReplyOfferModal(false)}
          />
        </GestureRecognizer>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <TouchableOpacity activeOpacity={1} style={styles.gratiescontainer}>
            <View>
              <Text style={styles.gratiesTitle}>Give some Gratis Comment</Text>
              <View style={styles.gratisCont}>
                <TouchableOpacity onPress={gratisCommrntMinusClick}>
                  <ImageComponent
                    source={minus}
                    style={{
                      height: 30,
                      width: 30,
                      marginRight: 50,
                    }}
                  ></ImageComponent>
                </TouchableOpacity>
                <ImageComponent
                  resizeMode="cover"
                  style={styles.gratisimg}
                  source={Gratis}
                ></ImageComponent>
                <Text style={styles.gratistext}>{gratisNoComment}</Text>
                <TouchableOpacity onPress={gratisCommentPlusClick}>
                  <ImageComponent
                    source={plus}
                    style={{
                      height: 30,
                      width: 30,
                      marginLeft: 50,
                    }}
                  ></ImageComponent>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => replyOfferModalHide()}
                activeOpacity={0.8}
                style={styles.purchaseContainer}
              >
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
          style={styles.gesture}
        >
          <TouchableOpacity
            style={[styles.containerGallery]}
            activeOpacity={1}
            onPress={keyboardDismiss}
          />
        </GestureRecognizer>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[
            styles.keyboardView,
            { position: "absolute", left: 0, right: 0 },
          ]}
        >
          <TouchableOpacity activeOpacity={1} style={styles.commentContainer}>
            <View>
              <TouchableOpacity
                style={{ position: "absolute", right: 0, zIndex: 111122 }}
                activeOpacity={0.5}
                onPress={() => addCommentModal(false)}
              >
                <ImageComponent
                  source={closeCard}
                  style={{ height: 25, width: 25 }}
                ></ImageComponent>
              </TouchableOpacity>
              <Text style={styles.gratiesTitle}>Add Comment</Text>
              <View>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Comment"
                  onChangeText={(text) => onAddCommentReply(text)}
                ></TextInput>
              </View>
              <TouchableOpacity
                onPress={() => onReplyClose()}
                activeOpacity={0.8}
                style={styles.purchaseContainer}
              >
                <View />
                <Text style={styles.titleTwo}>Add Comment</Text>
                <View>
                  <ImageComponent
                    source={buttonArrowGreen}
                    style={styles.buttonArrow}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      <Modal transparent onDismiss={closeModal} visible={postContent}>
        <GestureRecognizer onSwipeDown={closeModal} style={styles.gesture}>
          <TouchableOpacity
            style={styles.containerPost}
            activeOpacity={1}
            onPress={closeModal}
          />
        </GestureRecognizer>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardViewTwo}
        >
          <View style={styles.postActionSheet}>
            <TouchableOpacity onPress={() => postHideOptionSelect(1)}>
              <Text style={[styles.postText, { color: "white" }]}>Block</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => postHideOptionSelect(2)}>
              <Text style={[styles.postText, { color: "white" }]}>Report</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => postHideOptionSelect(3)}>
              <Text style={[styles.postText, { color: "white" }]}>
                Hide this Content
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <Modal
          transparent
          onDismiss={() => reportModalShowHide(false)}
          visible={reoportModal}
        >
          <GestureRecognizer
            onSwipeDown={() => reportModalShowHide(false)}
            style={styles.gesture}
          >
            <TouchableOpacity
              style={styles.containerGallery}
              activeOpacity={1}
              onPress={() => reportModalShowHide(false)}
            />
          </GestureRecognizer>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardViewTwo}
          >
            <TouchableOpacity activeOpacity={1} style={styles.commentContainer}>
              <View>
                <Text style={styles.gratiesTitle}>Report Content</Text>
                <View>
                  <TextInput
                    onChangeText={(text) => addReportReason(text)}
                    style={styles.commentInput}
                    placeholder="Add Reason"
                  ></TextInput>
                </View>
                <TouchableOpacity
                  onPress={() => submitReportReason()}
                  activeOpacity={0.8}
                  style={styles.purchaseContainer}
                >
                  <View />
                  <Text style={styles.titleTwo}>Submit</Text>
                  <View>
                    <ImageComponent
                      source={buttonArrowGreen}
                      style={styles.buttonArrow}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
      </Modal>
    </>
  );
};
