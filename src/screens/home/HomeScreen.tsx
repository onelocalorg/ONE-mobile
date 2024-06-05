import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from "@react-navigation/native";
import _ from "lodash/fp";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
  LogBox,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from "react-native-android-location-enabler";
import { ScrollView } from "react-native-gesture-handler";
import GetLocation from "react-native-get-location";
import Toast from "react-native-simple-toast";
import GestureRecognizer from "react-native-swipe-gestures";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import {
  Gratis,
  buttonArrowGreen,
  comment,
  defaultUser,
  gratitudeBlack,
  greenImage,
  minus,
  pin,
  plus,
  postCalender,
} from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Navbar } from "~/components/navbar/Navbar";
import { navigations } from "~/config/app-navigation/constant";
import {
  deletePost,
  listPosts,
  sendGratis,
} from "~/network/api/services/post-service";
import { getRecentlyJoined } from "~/network/api/services/user-service";
import { getData, persistKeys, setData } from "~/network/constant";
import { Post } from "~/types/post";
import { RecentlyJoined } from "~/types/recently-joined";
import { handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";
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
  const [userList, setUserList] = useState<RecentlyJoined[]>([]);
  var [postList, setPostList] = useState<Post[]>([]);
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
  const [postHideId, hidePostContentIDData] = useState<String>();
  const [reportPost, addReportReason] = useState("");
  const [setGratis, setPostGratisData] = useState();
  const [setComment, setPostCommentData] = useState();
  const [postData, setPostDataForComment] = useState();
  const [post_index, setPostCommentIndexTwo]: any = useState();
  const [editPost, setEditPost] = useState<Post>();
  const [showCommentListModal, setShowCommentListData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [Post_Id, setPostDataId] = useState("");
  const [loggedinUserId, setLoggedinUserId] = useState<string>();
  const [userProfilePic, setUserProfilePic] = useState<string>();

  var makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() - 1);
  const [range, setRange] = useState<Range>({
    startDate: makeDate,
    endDate: new Date(),
  });

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
      setPage(1);
      setPostList([]);
      setSearchQuery("");
    }, [range?.startDate, range?.endDate])
  );

  useEffect(() => {
    handleEnabledPressed();
    AsyncStorage.getItem(persistKeys.userProfilePic).then((pic) =>
      pic ? setUserProfilePic(pic) : null
    );
    AsyncStorage.getItem(persistKeys.userProfileId).then((id) =>
      id ? setLoggedinUserId(id) : null
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      postListAPI();
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
          zoomLevel: getData("mapCircleRadius"),
        };

        console.log(
          isLocationDefault,
          "-------------isLocationDefault-------------"
        );
        setData("defaultLocation", isLocationDefault);
        getRecentlyJoinUserAPI(location);
        postListAPI();
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
    navigation?.navigate(navigations?.CREATE_POST);
  };

  const OfferModalShow = (postId: string, index: number) => {
    postIdData(postId);
    gratisIndexData(index);
    CreateOfferModal(true);
    totalGratisData(10);
  };

  const sendGratisAndDismiss = () => {
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

  async function postListAPI() {
    if (page === 1) {
      LodingData(true);
    }
    const posts = await listPosts();
    setRefresh(false);
    if (page === 1) {
      setPostList(posts.results);
    } else {
      setPostList([...postList, ...posts.results]);
    }
    onPageLoad(false);
    isMoreDataLoad(true);
    LodingData(false);
    if (posts.pageInfo.page === posts.pageInfo.totalPages) {
      isMoreDataLoad(false);
    }
  }
  async function addGratisAPI() {
    const result = await sendGratis(postId, gratisNo);
    setPostList(
      postList.map((p: Post) =>
        p.id === postId
          ? { ...p, numGrats: result.postGratis ?? p.numGrats }
          : p
      )
    );
  }

  async function getRecentlyJoinUserAPI(getLocation: any) {
    try {
      const recentlyJoined = await getRecentlyJoined();
      setUserList(
        recentlyJoined.filter(
          (d: RecentlyJoined) => d.pic && !d.pic.includes("defaultUser.jpg")
        )
      );
    } catch (error) {
      handleApiError("Error loading recent users", error);
    }
  }

  async function deletePostAPI() {
    try {
      await deletePost(editPost!.id);
      Toast.show("Post deleted", Toast.LONG, {
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
    if (ismoreData && postList.length > 0) {
      onPageLoad(true);
      setPage(page + 1);
    }
  }

  async function blockUserAPI(postID: any, selectOP: any) {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/posts/block-user/" + postID,
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
        }
      );
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
    navigation.navigate(navigations.RECENTUSERPROFILE, { userId: id });
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

  const openPostModal = (postID: string, postData: Post) => {
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

  const renderItem: ListRenderItem<Post> = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={1} onPress={keyboardDismiss} key={index}>
        <View style={styles.feedContainer}>
          <Text style={styles.posttitle}>{_.capitalize(item?.type)}</Text>
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
              onPress={() => recentUserProfilePress(item.author.id)}
            >
              <ImageComponent
                resizeMode="cover"
                style={styles.postProfile}
                source={{ uri: item.author.pic }}
              ></ImageComponent>
            </TouchableOpacity>
            <View>
              <View>
                {item?.type === "Gratis" ? (
                  <View>
                    <Text numberOfLines={1} style={styles.userName}>
                      {item.author.first_name} {item.author.last_name}{" "}
                    </Text>
                    {/* {item?.to?.users.length !== 0 ? (
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
                    )} */}
                  </View>
                ) : (
                  <Text numberOfLines={1} style={styles.userName}>
                    {item.author.first_name} {item.author.last_name}
                  </Text>
                )}
                {item.startDate ? (
                  <Text style={styles.postTime}>
                    {item.startDate.toLocaleString()}
                  </Text>
                ) : null}
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
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() =>
                recentUserProfilePress(item?.to?.users[1]?.user_id["id"])
              }
            >
              <ImageComponent
                resizeMode="cover"
                style={styles.userListDisplay}
                source={{ uri: item?.to?.users[1]?.user_id["pic"] }}
              ></ImageComponent>
            </TouchableOpacity> */}
          </View>
          <Text style={styles.postDes}>{item.details}</Text>
          {item.imageUrls?.length > 0 ? (
            <ImageComponent
              resizeMode="cover"
              source={{ uri: item.imageUrls[0] }}
              style={styles.userPost}
            ></ImageComponent>
          ) : null}
          <View style={styles.postDetailCont}>
            <Text style={styles.postDetailTitle}>What:</Text>
            {/* <ImageComponent
              source={{ uri: item?.what?.icon }}
              style={styles.detailImage}
            ></ImageComponent> */}
            <Text style={styles.postDetail}>{item.name}</Text>
          </View>
          {/* {item?.type !== "Gratis" && item?.for?.name ? (
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
          )} */}
          {item?.type !== "Gratis" && item.address ? (
            <View style={styles.postDetailCont}>
              <Text style={styles.postDetailTitle}>Where:</Text>
              <Image source={pin} style={styles.detailImage}></Image>
              <Text style={styles.postDetail}>{item.address}</Text>
            </View>
          ) : (
            <></>
          )}

          {item?.startDate ? (
            <View style={styles.postDetailCont}>
              <Text style={styles.postDetailTitle}>When:</Text>
              <Image source={postCalender} style={styles.detailImage}></Image>
              <Text style={styles.postDetail}>
                {item.startDate.toLocaleString()}
              </Text>
            </View>
          ) : null}

          <View style={styles.gratisAndCommentContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.gratisContainer}
              onPress={() => OfferModalShow(item.id, index)}
            >
              <Text style={styles.gratisClass}>+{item.numGrats}</Text>
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
              <Text style={styles.commentClass}>{item.numComments}</Text>
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

    // markers[post_index]["gratis"] = setGraisTwo;
    // markers[post_index]["comment"] = commentTwo;

    setPostList(markers);
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
    if (editPost?.type === "offer") {
      navigation.navigate(navigations.EDIT_POST, {
        postData: editPost,
      });
    } else if (editPost?.type === "request") {
      navigation.navigate(navigations.EDIT_POST, {
        postData: editPost,
      });
    } else if (editPost?.type === "gratis") {
      navigation.navigate(navigations.CREATE_EDIT_POST_GRATIS, {
        postData: editPost,
      });
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
        {/* <TouchableOpacity onPress={() => openPostModal("item.id")}>
          <ImageComponent
            resizeMode="cover"
            style={styles.postfilterImage}
            source={greenImage}
          ></ImageComponent>
        </TouchableOpacity> */}
        <Navbar navigation={navigation} />
        {/* ------------------Header Tab------------------- */}

        <FlatList
          data={postList}
          keyExtractor={(item) => item.id}
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
                    isUrl={!!userProfilePic}
                    source={defaultUser}
                    uri={userProfilePic}
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
                onPress={() => sendGratisAndDismiss()}
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
            {editPost?.author.id === loggedinUserId ? (
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
