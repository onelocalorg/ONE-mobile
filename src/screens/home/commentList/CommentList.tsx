import React, { useCallback, useEffect, useState } from "react";
import { useAppTheme } from "~/app-hooks/use-app-theme";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from "@react-navigation/native";
import _ from "lodash/fp";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-simple-toast";
import GestureRecognizer from "react-native-swipe-gestures";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import {
  Gratis,
  Vector,
  buttonArrowGreen,
  closeCard,
  gratisGreen,
  gratitudeBlack,
  minus,
  pin,
  plus,
  postCalender,
  send,
} from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Navbar } from "~/components/navbar/Navbar";
import { LOG } from "~/config";
import { navigations } from "~/config/app-navigation/constant";
import {
  createComment,
  listComments,
} from "~/network/api/services/post-service";
import { Comment } from "~/types/comment";
import { Post } from "~/types/post";
import { Reply } from "~/types/reply";
import { formatTimeFromNow, handleApiError } from "~/utils/common";
import { createStyleSheet } from "../style";

interface commentListProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      postData: Post;
      postIndex: number;
    };
  };
}

export const CommentList = ({ navigation, route }: commentListProps) => {
  LOG.debug("CommentList", route?.params.postData);
  // console.log(props, "props");
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [offerModal, CreateOfferModal] = useState(false);
  const [replyofferModal, openReplyOfferModal] = useState(false);
  var [gratisNo, totalGratisData]: any = useState(10);
  var [gratisNoComment, totalGratisCommentData]: any = useState(10);
  var [addComment, addCommentModal] = useState(false);
  var [isCommentData, showMoreComment] = useState(false);
  const [addnewCmtReply, onAddCommentReply] = useState("");
  var [postId, postIdData]: any = useState();
  var [gratisIndex, gratisIndexData]: any = useState();
  const [isLoading, setLoading] = useState(false);
  const [pageCmt, setCmtPage] = useState(1);
  const [commentContent, setCommentContent] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPage] = useState(0);
  const [commentList, setCommentListData] = useState<Comment[]>([]);
  const [gratisCmtID, setreplyGratisId] = useState();
  const [gratisCmtKey, setreplyGratisKey] = useState();
  var [commentIndex, setCommentIndex]: any = useState();
  const [gratistype, setGratisSelectType] = useState();
  const [childjIndex, setChildIndexForGratis]: any = useState();
  const [replyId, commentReplyPostId] = useState("");
  const [replyIndex, setReplayIndex] = useState("");
  const [gratisData, setGratisData] = useState(
    route?.params.postData?.numGrats
  );
  const [commentData, setCommentData] = useState(
    route?.params.postData.numComments
  );
  const [postCommentIndexTwo, setPostCommentIndexTwo]: any = useState();
  const [postData, setPostData] = useState(route?.params.postData);
  const [commentListScrollEnable, setCommentListScrollEnable] = useState(true);
  const flatListRef: any = React.useRef();

  useEffect(() => {
    setGratisData(postData?.numGrats);
    setCommentData(postData?.numComments);
  }, [route?.params.postData]);

  useFocusEffect(
    useCallback(() => {
      if (postData?.id) {
        setCommentListData([]);
        setCmtPage(1);
        getCommentListAPI(1);
      }
    }, [postData?.id])
  );

  const recentUserProfilePress = (id: any) => {
    AsyncStorage.setItem("recentUserId", id);
    navigation?.navigate(navigations.RECENTUSERPROFILE);
  };

  async function getCommentListAPI(pageCount: any) {
    if (postData) {
      setLoading(true);
      try {
        const comments = await listComments(postData.id);
        setCommentListData(comments);
      } catch (e) {
        handleApiError("Error getting comments", e);
      } finally {
        setLoading(false);
      }
    }
  }

  async function commentOnPost() {
    if (postData) {
      setLoading(true);
      try {
        const newComment = await createComment(postData.id, commentContent);
        setCommentListData([newComment, ...commentList]);
        setCommentContent("");

        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      } catch (e) {
        handleApiError("Error creating comment", e);
      } finally {
        setLoading(false);
      }
    }
  }

  async function addReplyGratisAPI() {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      postId: postId,
      points: gratisNoComment,
      commentId: gratisCmtID,
      commentKey: gratisCmtKey,
    };
    console.log(
      "=========== Gratis Reply Data API Reques" +
        process.env.API_URL +
        "/v1/posts/gratis-sharing =============="
    );
    console.log(data);
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/posts/gratis-sharing",
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
      console.log("=========== Gratis Data Reply API Response ==============");
      console.log(dataItem);
      if (dataItem?.success === true) {
        let markers = [...commentList];

        markers[commentIndex]["gratis"] =
          dataItem?.data?.data?.numCommentssGratis;

        setGratisData(dataItem?.data?.data?.postGratis);
        let markersTwo = { ...postData };
        // markersTwo["gratis"] = dataItem?.data?.data?.postGratis;
        // setPostData(markersTwo);
      }

      if (dataItem?.success === false) {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  async function addChildReplyGratisAPI() {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      postId: postId,
      points: gratisNoComment,
      commentId: gratisCmtID,
      commentKey: gratisCmtKey,
    };
    console.log(
      "=========== Gratis Reply Data API Reques" +
        process.env.API_URL +
        "/v1/posts/gratis-sharing =============="
    );
    console.log(data);
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/posts/gratis-sharing",
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
      console.log("=========== Gratis Data Reply API Response ==============");
      console.log(dataItem);
      if (dataItem?.success === true) {
        let markers = [...commentList];

        markers[commentIndex]["replies"][childjIndex]["gratis"] =
          dataItem?.data?.data?.replayGratis;

        setGratisData(dataItem?.data?.data?.postGratis);
      }

      if (dataItem?.success === false) {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
    console.log(
      process.env.API_URL + "/v1/posts/" + postData?.id + "/comments/create"
    );
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/posts/" + postData?.id + "/comments/create",
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

      let markers = [...commentList];
      var commentReplyArray = dataItem.data["reply"];

      // markers[postIndexTwo]["comment"] = dataItem.data.totalComment;
      markers[postCommentIndexTwo]["replies"].push(
        commentReplyArray[commentReplyArray.length - 1]
      );

      setCommentData(dataItem.data.totalComment);

      console.log(
        "---------------responce reply comment post----------",
        JSON.stringify(dataItem)
      );
      setLoading(false);
      // getCommentListAPI(setReplyId, replyIndex);

      console.log(dataItem);
    } catch (error) {
      console.error(error);
    }
  }

  const onReplyClick = (postId: any, index: any) => {
    commentReplyPostId(postId);
    setReplayIndex(replyId);
    setPostCommentIndexTwo(index);
    // setPostIndexTwo(parentIndex);
    addCommentModal(true);
  };

  const openReplyGratis = (
    postIds: any,
    replyId: any,
    replyKey: any,
    // index: any,
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
    // gratisIndexData(index);
    setCommentIndex(cindex);
    console.log("----------cindex----------", cindex);
  };

  async function addGratisAPI() {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      postId: postId,
      points: gratisNo,
    };
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/posts/gratis-sharing",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          body: Object.keys(data)
            .map((key) => key + "=" + data[key])
            .join("&"),
        }
      );
      const dataItem = await response.json();
      console.log(dataItem);
      if (dataItem?.success === true) {
        let markers = { ...postData };
        // markers["gratis"] = dataItem?.data?.data?.postGratis;
        // setPostData(markers);
        setGratisData(dataItem?.data?.data?.postGratis);
      }
      if (dataItem?.success === false) {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

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

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const onReplyClose = () => {
    if (addnewCmtReply === "") {
      Toast.show("Add Comment", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      setLoading(true);
      replyCommentOnPostAPI();
      addCommentModal(false);
    }
  };

  const addCommentHide = () => {
    if (commentContent === "") {
      Toast.show("Add Comment", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      setLoading(true);
      commentOnPost();
    }
  };

  const renderItem: ListRenderItem<Comment> = ({ item, index }) => {
    LOG.debug("renderItem", item);
    return (
      <View>
        <View style={styles.commentImgProfile}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => recentUserProfilePress(item?.commenter?.id)}
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
          <TouchableOpacity onPress={() => onReplyClick(item.id, index)}>
            <Text style={styles.replyLbl}>reply</Text>
          </TouchableOpacity>

          <Text style={styles.minuteCont}>
            {formatTimeFromNow(item.postDate)}
          </Text>
          <Text style={styles.minuteCont}>{item.gratis}</Text>
          <TouchableOpacity
            onPress={() =>
              openReplyGratis(
                item.post_id,
                item.id,
                "",
                // indexParent,
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

        {item.replies.map((reply: Reply, jindex: number) => {
          return (
            <>
              <View>
                <View style={styles.commentImgProfileTwo}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => recentUserProfilePress(reply.commenter.id)}
                  >
                    <ImageComponent
                      resizeMode="cover"
                      style={styles.postProfile}
                      source={{
                        uri: reply.commenter.pic,
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
                      {reply.commenter.first_name} {reply.commenter.last_name}
                    </Text>
                    <Text style={styles.replyMsgCont}>{reply.content}</Text>
                  </View>
                </View>

                <View style={styles.replyContainerTwo}>
                  <ImageComponent
                    source={Vector}
                    style={styles.vectorImgTwo}
                  ></ImageComponent>
                  <TouchableOpacity
                    onPress={() => onReplyClick(item.id, index)}
                  >
                    <Text style={styles.replyLbl}>reply</Text>
                  </TouchableOpacity>

                  <Text style={styles.minuteCont}>
                    {formatTimeFromNow(reply.postDate)}
                  </Text>
                  <Text style={styles.minuteCont}>{reply.gratis}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      openReplyGratis(
                        item.post_id,
                        item.id,
                        reply.key,
                        // indexParent,
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
      </View>
    );
  };

  const postDataLoad = () => {
    if (isCommentData) {
      setCmtPage(pageCmt + 1);
      getCommentListAPI(pageCmt + 1);
    }
  };

  const OfferModalShow = (postIds: any, index: any) => {
    postIdData(postIds);
    gratisIndexData(index);
    CreateOfferModal(true);
    totalGratisData(10);
  };

  const onBackPress = () => {
    navigation?.goBack();
  };

  return postData ? (
    // <SafeAreaView>

    <View style={{ paddingBottom: 300 }}>
      <Navbar navigation={navigation} />
      <KeyboardAvoidingView
        behavior="padding"
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={styles.commentModalContainer}>
          <View style={{ flex: 1 }}>
            <View style={styles.scrollViewComment}>
              <FlatList
                data={commentList}
                ref={flatListRef}
                onEndReachedThreshold={0.005}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListHeaderComponent={
                  <View style={styles.feedPostContainer}>
                    <Text style={styles.posttitle}>{postData.type}</Text>
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: 14,
                        top: 10,
                        zIndex: 111122,
                      }}
                    ></TouchableOpacity>
                    <View style={styles.userDetailcont}>
                      <TouchableOpacity
                        onPress={() =>
                          recentUserProfilePress(postData.author.id)
                        }
                      >
                        <ImageComponent
                          resizeMode="cover"
                          style={styles.postProfile}
                          source={{ uri: postData.author.pic }}
                        ></ImageComponent>
                      </TouchableOpacity>
                      <View>
                        <View>
                          {postData?.type === "Gratis" ? (
                            <View>
                              <Text numberOfLines={1} style={styles.userName}>
                                {postData.author.first_name}{" "}
                                {postData.author.last_name}{" "}
                              </Text>
                              {/* {postData?.to?.users.length !== 0 ? (
                                <Text
                                  numberOfLines={1}
                                  style={styles.sentPointClass}
                                >
                                  sent {postData?.to?.users[0]?.point} gratis to{" "}
                                  <Text style={styles.userName}>
                                    {
                                      postData?.to?.users[0]?.user_id[
                                        "first_name"
                                      ]
                                    }{" "}
                                    {
                                      postData?.to?.users[0]?.user_id[
                                        "last_name"
                                      ]
                                    }{" "}
                                    {
                                      postData?.to?.users[1]?.user_id[
                                        "first_name"
                                      ]
                                    }{" "}
                                    {
                                      postData?.to?.users[1]?.user_id[
                                        "last_name"
                                      ]
                                    }
                                  </Text>
                                </Text>
                              ) : (
                                <></>
                              )} */}
                            </View>
                          ) : (
                            <Text numberOfLines={1} style={styles.userName}>
                              {postData.author.first_name}{" "}
                              {postData.author.last_name}
                            </Text>
                          )}
                          {postData.postDate ? (
                            <Text style={styles.postTime}>
                              {formatTimeFromNow(postData.postDate)}
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
                          recentUserProfilePress(
                            postData?.to?.users[0]?.user_id["id"]
                          )
                        }
                      >
                        <ImageComponent
                          resizeMode="cover"
                          style={styles.userListDisplay}
                          source={{
                            uri: postData?.to?.users[0]?.user_id["pic"],
                          }}
                        ></ImageComponent>
                      </TouchableOpacity> */}
                      {/* <TouchableOpacity
                        onPress={() =>
                          recentUserProfilePress(
                            postData?.to?.users[1]?.user_id["id"]
                          )
                        }
                      >
                        <ImageComponent
                          resizeMode="cover"
                          style={styles.userListDisplay}
                          source={{
                            uri: postData?.to?.users[1]?.user_id["pic"],
                          }}
                        ></ImageComponent>
                      </TouchableOpacity> */}
                    </View>
                    <Text style={styles.postDes}>{postData?.details}</Text>
                    {!_.isEmpty(postData?.images) ? (
                      <ImageComponent
                        resizeMode="cover"
                        source={{ uri: postData?.images[0] }}
                        style={styles.userPost}
                      ></ImageComponent>
                    ) : null}
                    <View style={styles.postDetailCont}>
                      <Text style={styles.postDetailTitle}>What:</Text>
                      {/* <ImageComponent
                        source={{ uri: postData?.what?.icon }}
                        style={styles.detailImage}
                      ></ImageComponent> */}
                      <Text style={styles.postDetail}>{postData.name}</Text>
                    </View>
                    {/* {postData?.type !== "Gratis" ? (
                      <View style={styles.postDetailCont}>
                        <Text style={styles.postDetailTitle}>For:</Text>
                        <Image
                          source={{ uri: postData?.for?.icon }}
                          style={styles.detailImage}
                        ></Image>
                        <Text style={styles.postDetail}>
                          {postData?.for?.name}
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )} */}

                    {postData.address ? (
                      <View style={styles.postDetailCont}>
                        <Text style={styles.postDetailTitle}>Where:</Text>
                        <Image source={pin} style={styles.detailImage}></Image>
                        <Text style={styles.postDetail}>
                          {postData.address}
                        </Text>
                      </View>
                    ) : null}

                    {postData.startDate ? (
                      <View style={styles.postDetailCont}>
                        <Text style={styles.postDetailTitle}>When:</Text>
                        <Image
                          source={postCalender}
                          style={styles.detailImage}
                        ></Image>
                        <Text style={styles.postDetail}>
                          {postData.startDate?.toLocaleString()}
                        </Text>
                      </View>
                    ) : null}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.gratisContainer}
                      onPress={() =>
                        OfferModalShow(postData.id, route?.params.postIndex)
                      }
                    >
                      <Text style={styles.gratisClass}>
                        +{postData?.numGrats}
                      </Text>
                      <ImageComponent
                        source={gratitudeBlack}
                        style={styles.commentImgTwo}
                      ></ImageComponent>
                    </TouchableOpacity>
                  </View>
                }
                ListFooterComponent={
                  <View>
                    {commentList.length !== 0 && !isLoading ? (
                      <TouchableOpacity onPress={postDataLoad}>
                        <View>
                          {isCommentData ? (
                            <Text style={styles.getMoreDataCont}>
                              Get More Comments
                            </Text>
                          ) : (
                            <></>
                          )}
                        </View>
                        {/* {isCommentData && !isLoading ? (
                          <View>
                            <Text style={styles.getMoreDataCont}>
                              Get More Comments
                            </Text>
                          </View>
                        ) : (
                          <Text
                            style={{
                              alignSelf: "center",
                              paddingVertical: 10,
                              color: "black",
                              fontSize: 16,
                            }}
                          >
                            No More Data Found
                          </Text>
                        )} */}
                      </TouchableOpacity>
                    ) : (
                      <View style={{ alignSelf: "center" }}>
                        <Text>No comments found</Text>
                      </View>
                    )}
                  </View>
                }
              ></FlatList>
              <View style={styles.bottomButton}>
                <View style={{ flexDirection: "row" }}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Make a Comment"
                    placeholderTextColor="gray"
                    value={commentContent}
                    onChangeText={(text) => setCommentContent(text)}
                  ></TextInput>
                  <TouchableOpacity
                    style={{ alignSelf: "center" }}
                    onPress={() => addCommentHide()}
                  >
                    <ImageComponent
                      style={{ height: 40, width: 40 }}
                      source={send}
                    ></ImageComponent>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <Modal transparent onDismiss={OfferModalClose} visible={offerModal}>
            <GestureRecognizer
              onSwipeDown={OfferModalClose}
              style={styles.gesture}
            >
              <TouchableOpacity
                style={styles.containerGallery}
                activeOpacity={1}
                onPress={OfferModalClose}
              />
            </GestureRecognizer>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardView}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={styles.gratiescontainer}
              >
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
              <TouchableOpacity
                activeOpacity={1}
                style={styles.gratiescontainer}
              >
                <View>
                  <Text style={styles.gratiesTitle}>
                    Give some Gratis Comment
                  </Text>
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
              <TouchableOpacity
                activeOpacity={1}
                style={styles.commentContainer}
              >
                <View>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 0,
                      zIndex: 111122,
                    }}
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
                      placeholderTextColor="gray"
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
        </View>
      </KeyboardAvoidingView>
    </View>
  ) : // </SafeAreaView>
  null;
};
