import React, { useCallback, useEffect, useRef, useState } from "react";
import { createStyleSheet } from "./style";
import { useAppTheme } from "@app-hooks/use-app-theme";
import {
  ActivityIndicator,
  AppState,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
  LogBox,
  Modal,
  PermissionsAndroid,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useStringsAndLabels } from "@app-hooks/use-strings-and-labels";
import { ImageComponent } from "@components/image-component";
import {
  Gratis,
  Search,
  buttonArrowGreen,
  comment,
  dummy,
  gratitudeBlack,
  greenImage,
  minus,
  onelogo,
  pin,
  plus,
  postCalender,
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
import GetLocation from "react-native-get-location";
import { Loader } from "@components/loader";
import Toast from "react-native-simple-toast";
import GestureRecognizer from "react-native-swipe-gestures";
import { Alert } from "react-native";
import { API_URL, getData, setData } from "@network/constant";
import { CommentList } from "./commetList";
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from "react-native-android-location-enabler";
// import Geolocation from "@react-native-community/geolocation";

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
  const [offerModal, CreateOfferModal] = useState(false);
  var [location, setUserLocation]: any = useState();
  const [isLoading, LodingData] = useState(false);
  const [loading, onPageLoad] = useState(false);
  const [ismoreData, isMoreDataLoad] = useState(false);
  var [postId, postIdData]: any = useState();
  var [gratisIndex, gratisIndexData]: any = useState();
  var [gratisNo, totalGratisData]: any = useState(10);
  var [page, setPage] = useState(1);
  const [postContent, postContentModal] = useState(false);
  const [reoportModal, reportModalShowHide] = useState(false);
  const [postHideId, hidePostContentIDData] = useState();
  const [reportPost, addReportReason] = useState("");
  const [setGratis, setPostGratisData] = useState();
  const [setComment, setPostCommentData] = useState();
  const [postData, setPostDataForComment] = useState();
  const [post_index, setPostCommentIndexTwo]: any = useState();
  const [editPost, setEditPost]: any = useState();
  const [showCommentListModal, setShowCommentListData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [Post_Id, setPostDataId] = useState("");

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

  console.log(user.id, '-----------userId----------')
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      LogBox.ignoreAllLogs();
      var tempdata = getData("defaultLocation");
      if (!tempdata?.latitude) {
        console.log("-------------post 1 time------------");
        requestLocationPermission();
      } else {
        console.log("-------------post 2 time------------");
        if (tempdata?.latitude) {
          getRecentlyJoinUserAPI(tempdata);
        } else {
          getRecentlyJoinUserAPI("");
        }
      }
      if (Platform.OS) {
        if (!tempdata?.latitude) {
          requestLocationPermission();
        }
      }
      getUserProfileAPI();
      setPage(1);
      postListData([]);
      setSearchQuery("");
    }, [range?.startDate, range?.endDate])
  );

  useEffect(() => {
    handleEnabledPressed();
  }, []);

  useFocusEffect(
    useCallback(() => {
      var tempdataTwo = getData("defaultLocation");
      if (tempdataTwo?.latitude) {
        console.log("postListAPI 1");
        postListAPI(tempdataTwo);
      }
    }, [page, searchQuery, refresh])
  );

  const requestLocationPermission = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 6000,
    })
      .then((location) => {
        setUserLocation(location);

        var isLocationDefault = {
          latitude: location.latitude,
          longitude: location.longitude,
          zoomLevel: 11,
        };
        setData("defaultLocation", isLocationDefault);
        if (location.latitude && location.longitude) {
          getRecentlyJoinUserAPI(location);
          console.log("postListAPI 2");
          postListAPI(isLocationDefault);
        } else {
          getRecentlyJoinUserAPI("");
        }
      })
      .catch((error) => {
        getRecentlyJoinUserAPI("");
        const { code, message } = error;
      });
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 15000,
      })
        .then((location) => {
          resolve({ location });
          console.log(location);
          setUserLocation(location);
          if (location.latitude && location.longitude) {
            getRecentlyJoinUserAPI(location);
          } else {
            getRecentlyJoinUserAPI("");
          }
        })
        .catch((error) => {
          reject(error.message);
          console.log(error);
          getRecentlyJoinUserAPI("");
          const { code, message } = error;
        });
    });
  };

  async function handleEnabledPressed() {
    if (Platform.OS === "android") {
      try {
        const checkEnable: Boolean = await isLocationEnabled();
        const enableResult = await promptForEnableLocationIfNeeded();
        console.log("enableResult", enableResult);
        console.log("checkEnable", checkEnable);
        if (checkEnable) {
          // console.log("requestLocationPermission");
          // requestLocationPermission();
          return true;
        } else {
          // console.log("location get method 1");
          // handleCheckPressed();
          return false;
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
  }
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
        dispatch(onSetUser(userData));
      });
    }
    navigation.navigate("profileroute");
  };

  const getUserProfileAPI = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(API_URL + "/v1/users/" + user.id, {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
      });
      const dataItem = await response.json();
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

  async function postListAPI(location: any) {
    if (page === 1) {
      LodingData(true);
    }
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      latitude: location.latitude,
      longitude: location.longitude,
      zoom_level: location.zoomLevel,
      device_type: Platform.OS,
      searchtext: searchQuery,
    };
    console.log("----------------post Location----------------", data);

    var URL = API_URL + "/v1/posts/list?limit=5&page=" + page;
    console.log(URL);
    try {
      const response = await fetch(URL, {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(data),
      });
      const dataItem = await response.json();
      setRefresh(false);
      if (page == 1) {
        postListData(dataItem?.data?.results);
      } else {
        postListData([...postList, ...dataItem?.data?.results]);
      }
      onPageLoad(false);
      isMoreDataLoad(true);
      LodingData(false);
      if (dataItem?.data?.page === dataItem?.data?.totalPages) {
        isMoreDataLoad(false);
      }
    } catch (error) {
      LodingData(false);
      console.error("--------error postListAPI--------" + URL, error);
    }
  }
  async function addGratisAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      postId: postId,
      points: gratisNo,
    };
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
      if (dataItem?.success === true) {
        let markers = [...postList];
        markers[gratisIndex] = {
          ...markers[gratisIndex],
          gratis: dataItem?.data?.data?.postGratis,
        };
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

  async function getRecentlyJoinUserAPI(getLocation: any) {
    const token = await AsyncStorage.getItem("token");

    if (getLocation != "") {
      var data: any = {
        radius: 25,
        user_lat: getLocation?.latitude,
        user_long: getLocation?.longitude,
      };
    } else {
      var data: any = {
        radius: 25,
      };
    }

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
      recentlyJoinUser(dataItem?.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function deletePostAPI() {
    const token = await AsyncStorage.getItem("token");
    console.log(editPost?.id, "delete post id");
    console.log(API_URL + "/v2/posts/delete/" + editPost?.id);
    try {
      console.log("222222");

      const response = await fetch(
        API_URL + "/v2/posts/delete/" + editPost?.id,
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        }
      );
      const dataItem = await response.json();
      console.log("=========== Delete Post API Response ==============");
      console.log(dataItem);
      Toast.show(dataItem?.message, Toast.LONG, {
        backgroundColor: "black",
      });
      setRefresh(true);
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  function postDataLoad() {
    console.log("----------postDataLoad-----------");
    if (ismoreData && postList.length > 0) {
      onPageLoad(true);
      setPage(page + 1);
    }
  }

  async function blockUserAPI(postID: any, selectOP: any) {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(API_URL + "/v1/posts/block-user/" + postID, {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
      });
      const dataItem = await response.json();
      LodingData(false);
      if (dataItem.success === true) {
        if (selectOP === 1) {
          Toast.show("User Block successfully", Toast.LONG, {
            backgroundColor: "black",
          });
        } else if (selectOP === 2) {
          Toast.show("Report Submit successfully", Toast.LONG, {
            backgroundColor: "black",
          });
        } else {
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

  const onCommentOpen = (item: any, post_index: any) => {
    navigation.navigate(navigations.COMMENTLIST, {
      postData: item,
      postIndex: post_index,
    });
    // AsyncStorage.setItem("postID", item.id);
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

  const openPostModal = (postID: any, postData: any) => {
    hidePostContentIDData(postID);
    setEditPost(postData);
    postContentModal(true);
  };
  const postHideOptionSelect = (postSelectType: any) => {
    if (postSelectType === 1) {
      blockUserAlert(postSelectType);
    } else if (postSelectType === 2) {
      addReportReason("");
      reportModalShowHide(true);
    } else if (postSelectType === 3) {
      hideUserAlert(postSelectType);
    }
  };

  const renderItem: ListRenderItem<any> = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={1} onPress={keyboardDismiss} key={index}>
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
            <TouchableOpacity onPress={() => openPostModal(item.id, item)}>
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
          <View
            style={
              Platform.OS === "ios"
                ? styles.userListDisplayCont
                : styles.userListDisplayContTwo
            }
          >
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
          {item?.type !== "Gratis" ? (
            <View style={styles.postDetailCont}>
              <Text style={styles.postDetailTitle}>For:</Text>
              <Image
                source={{ uri: item?.for?.icon }}
                style={styles.detailImage}
              ></Image>
              <Text style={styles.postDetail}>{item?.for?.name}</Text>
            </View>
          ) : (
            <></>
          )}
          {item?.type !== "Gratis" ? (
            <View style={styles.postDetailCont}>
              <Text style={styles.postDetailTitle}>Where:</Text>
              <Image source={pin} style={styles.detailImage}></Image>
              <Text style={styles.postDetail}>{item?.where?.address}</Text>
            </View>
          ) : (
            <></>
          )}

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
              onPress={() => onCommentOpen(item, index)}
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

  const onCloseCommentListModal = (setGraisTwo: any, commentTwo: any) => {
    setPostCommentData(commentTwo);
    setPostGratisData(setGraisTwo);

    setShowCommentListData(false);
    let markers = [...postList];

    markers[post_index]["gratis"] = setGraisTwo;
    markers[post_index]["comment"] = commentTwo;

    postListData(markers);
  };

  const onCommentListModal = (item: any, post_index: any) => {
    AsyncStorage.setItem("postID", item.id);
    setPostCommentIndexTwo(post_index);
    setPostDataId(item.id);
    setPostGratisData(item.gratis);
    setPostCommentData(item.comment);
    setPostDataForComment(item);
    setShowCommentListData(true);
  };

  const submitReportReason = () => {
    if (reportPost === "") {
      Toast.show("Add Reason", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      blockUserAPI(postHideId, 2);
      postContentModal(false);
      reportModalShowHide(false);
    }
  };

  const setSerchValue = (searchData: any) => {
    setPage(1);
    setSearchQuery(searchData);
  };

  const renderLoader = () => {
    return loading ? (
      <View style={{ marginVertical: 26, alignItems: "center" }}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    ) : null;
  };

  const onEditPost = () => {
    if (editPost?.type === "Offer") {
      navigation.navigate(navigations.EDITPOSTOFFER, { postData: editPost });
    } else if (editPost?.type === "Request") {
      navigation.navigate(navigations.EDITPOSTREQUEST, { postData: editPost });
    } else if (editPost?.type === "Gratis") {
      navigation.navigate(navigations.EDITPOSTGRATIS, { postData: editPost });
    }
    postContentModal(false);
  };
  const onDeletePost = () => {
    Alert.alert(
      strings.deletePostTitle,
      strings.deletePost,
      [
        { text: strings.no, onPress: () => null, style: "destructive" },
        {
          text: strings.yes,
          onPress: () => {
            deletePostAPI();
            LodingData(true);
          },
        },
      ],
      { cancelable: false }
    );
    postContentModal(false);
  };

  return (
    <>
      <View style={styles.MainPostContainer}>
        <Loader visible={isLoading} showOverlay />
        {/* <TouchableOpacity onPress={() => openPostModal("item.id")}>
          <ImageComponent
            resizeMode="cover"
            style={styles.postfilterImage}
            source={greenImage}
          ></ImageComponent>
        </TouchableOpacity> */}
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
       
        <FlatList
          data={postList}
          keyExtractor={(item, index) => item.key}
          onEndReached={postDataLoad}
          renderItem={renderItem}
          contentContainerStyle={styles.scrollView}
          ListFooterComponent={renderLoader}
          ListHeaderComponent={
            <View>
              {userList?.length !== 0 ? (
                <View style={styles.avatarContainer}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    {userList?.map((userList: any) => {
                      return (
                        <TouchableOpacity
                          key={Math.random()}
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
        <View
          style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>
            {postList?.length === 0 ? strings.noPostFound : ""}
          </Text>
        </View>
       
      </View>
      

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
            {editPost?.user_id?.id === user?.id ? (
              <>
                <TouchableOpacity onPress={() => onEditPost()}>
                  <Text style={[styles.postText, { color: "white" }]}>
                    Edit Post
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDeletePost()}>
                  <Text style={[styles.postText, { color: "white" }]}>
                    Delete Post
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <></>
            )}

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

      {/* <CommentList
        post_id={Post_Id}
        setCommentReturn={setComment}
        setGratisReturn={setGratis}
        onCommentHide={onCloseCommentListModal}
        showModal={showCommentListModal}
        getPostIndex={post_index}
        getPostDataTwo={postData}
        navigation={navigation}
      ></CommentList> */}
    </>
  );
};
