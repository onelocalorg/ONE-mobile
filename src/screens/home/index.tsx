import React, { useCallback, useEffect, useRef, useState } from "react";
import { createStyleSheet } from "./style";
import { useAppTheme } from "@app-hooks/use-app-theme";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
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
import codegenNativeCommands from "react-native/Libraries/Utilities/codegenNativeCommands";

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
  const [setGratis, setPostGratisData] = useState();
  const [setComment, setPostCommentData] = useState();
  const [type, eventTypeData] = useState("offer");
  const [gratistype, setGratisSelectType] = useState();
  const [childjIndex, setChildIndexForGratis]: any = useState();
  const [post_index, setPostCommentIndexTwo]: any = useState();
  const [postIndexTwo, setPostIndexTwo]: any = useState();
  const [showCommentListModal, setShowCommentListData] = useState(false);
  const [Post_Id, setPostDataId] = useState("");
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
      setPage(1);
      postListData([]);
    }, [range?.startDate, range?.endDate])
  );

  useFocusEffect(
    useCallback(() => {
      postListAPI();
    }, [page, searchQuery])
  );

  useEffect(() => {
    LogBox.ignoreAllLogs();

    getUserProfileAPI();
    requestLocationPermission();
    eventTypeData(type);
  }, [type, range?.startDate, range?.endDate, searchQuery]);


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
      refetch().then((res) => {
        const userData = userProfileParsedData(res?.data?.data);
        console.log("check1===", userData);
        dispatch(onSetUser(userData));
      });
    }
    navigation.navigate("profileroute");
  };

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
      if (dataItem?.data?.isEventActiveSubscription === true) {
        AsyncStorage.setItem("isEventActive", "true");
      } else {
        AsyncStorage.setItem("isEventActive", "false");
      }
      AsyncStorage.setItem("profile", dataItem.data.pic);
      AsyncStorage.setItem("uniqueId", dataItem.data.user_unique_id);
    } catch (error) {
      console.log(error);
    }
  };

  async function postListAPI() {
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
        "/v1/posts/list?limit=5&page=" +
        page +
        "=============="
    );
    console.log(data);
    try {
      const response = await fetch(
        API_URL + "/v1/posts/list?limit=5&page=" + page,
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

      var result = dataItem?.data?.results.map((item: any) => {
        return { ...item, isComment: false, commentListData: [] };
      });
      postListData([...postList, ...result]);

      isMoreDataLoad(true);
      postListTotalResult(dataItem?.data?.totalResults);
      LodingData(false);
      if (dataItem?.data?.page === dataItem?.data?.totalPages) {
        isMoreDataLoad(false);
      }
    } catch (error) {
      LodingData(false);
      console.error(
        "--------error--------" +
          API_URL +
          "/v1/posts/list?limit=10&page=" +
          page,
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

  async function getRecentlyJoinUserAPI() {
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      radius: 25,
      user_lat: location?.latitude,
      user_long: location?.longitude,
    };
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
      setPage(page + 1);
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
          // postListAPI();
          Toast.show("User Block successfully", Toast.LONG, {
            backgroundColor: "black",
          });
        } else if (selectOP === 2) {
          // postListAPI();
          Toast.show("Report Submit successfully", Toast.LONG, {
            backgroundColor: "black",
          });
        } else {
          // postListAPI();
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

  const keyboardDismiss = () => {
    Keyboard.dismiss();
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

  const renderItem: ListRenderItem<any> = ({ item, index }) => {
    return (
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
                      {item?.user_id?.first_name} {item?.user_id?.last_name}{" "}
                    </Text>
                    {item?.to?.users.length !== 0 ? (
                      <Text numberOfLines={1} style={styles.sentPointClass}>
                        sent {item?.to?.users[0]?.point} gratis to{" "}
                        <Text style={styles.userName}>
                          {item?.to?.users[0]?.user_id["first_name"]}{" "}
                          {item?.to?.users[0]?.user_id["last_name"]}{" "}
                          {item?.to?.users[1]?.user_id["first_name"]}{" "}
                          {item?.to?.users[1]?.user_id["last_name"]}
                        </Text>
                      </Text>
                    ) : (
                      <></>
                    )}
                  </View>
                ) : (
                  <Text numberOfLines={1} style={styles.userName}>
                    {item?.user_id?.first_name} {item?.user_id?.last_name}
                  </Text>
                )}
                <Text style={styles.postTime}>{item?.date}</Text>
              </View>
            </View>
          </View>
          <View style={styles.userListDisplayCont}>
            <TouchableOpacity
              onPress={() =>
                recentUserProfilePress(item?.to?.users[0]?.user_id["id"])
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
            <TouchableOpacity
              onPress={() =>
                recentUserProfilePress(item?.to?.users[1]?.user_id["id"])
              }
            >
              <ImageComponent
                resizeMode="cover"
                style={styles.userListDisplay}
                source={{ uri: item?.to?.users[1]?.user_id["pic"] }}
              ></ImageComponent>
            </TouchableOpacity>
          </View>
          <Text style={styles.postDes}>{item?.content}</Text>
          <ImageComponent
            resizeMode="cover"
            source={{ uri: item.image[0] }}
            style={styles.userPost}
          ></ImageComponent>
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
            <Text style={styles.postDetail}>{item?.where?.address}</Text>
          </View>
          <View style={styles.postDetailCont}>
            <Text style={styles.postDetailTitle}>When:</Text>
            <Image source={postCalender} style={styles.detailImage}></Image>
            <Text style={styles.postDetail}>{item?.when}</Text>
          </View>

          <View style={styles.gratisAndCommentContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.gratisContainer}
              onPress={() => OfferModalShow(item.id, index)}
            >
              <Text style={styles.gratisClass}>+{item?.gratis}</Text>
              <ImageComponent
                source={gratitudeBlack}
                style={styles.commentImgTwo}
              ></ImageComponent>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onCommentListModal(item,index)}
              style={styles.commentsContainer}
            >
              <Text style={styles.commentClass}>{item?.comment}</Text>
              <ImageComponent
                source={comment}
                style={styles.commentImageThree}
              ></ImageComponent>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onCloseCommentListModal = (setGrais:any,comment:any) => {
    setShowCommentListData(false);
    setPage(1)
    console.log(setGrais)
    console.log(comment)

    let markers = [...postList];

    markers[post_index]["gratis"] = setGrais;
    markers[post_index]["comment"] = comment;
    
    postListData(markers)
  };

  const onCommentListModal = (item: any,post_index:any) => {
    console.log("open comment modal");
    AsyncStorage.setItem("postID", item.id);
    setPostCommentIndexTwo(post_index)
    setPostDataId(item.id);
    setPostGratisData(item.gratis)
    setPostCommentData(item.comment)
    console.log(item.gratis)
    console.log(item.comment)
    setShowCommentListData(true);
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
      postListData([]);
      setPage(1);
    },
    [searchQuery]
  );

  return (
    <>
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

        {/* <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        > */}
          <FlatList
            data={postList}
            keyExtractor={(item, index) => item.key}
            // ListFooterComponent={<View style={{ height: 90 }} />}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
                return postDataLoad();
            }}
            initialNumToRender={10}
           
            renderItem={renderItem}
            endFillColor="red"
            contentContainerStyle={styles.scrollView}
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
                </TouchableOpacity>
              </View>
            }
           
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
        {/* </KeyboardAwareScrollView> */}
        {loading ? (
          <ActivityIndicator
            color="white"
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

      <CommentList
        post_id={Post_Id}
        indexParent={postIndexTwo}
        setCommentReturn={setComment}
        setGratisReturn={setGratis}
        onCommentHide={onCloseCommentListModal}
        showModal={showCommentListModal}
        navigation={navigation} 
      ></CommentList>
    </>
  );
};
