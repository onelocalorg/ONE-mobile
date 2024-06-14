import React, { useCallback, useState } from "react";
import { useAppTheme } from "~/app-hooks/use-app-theme";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import _ from "lodash/fp";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-simple-toast";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import {
  Vector,
  gratisGreen,
  gratitudeBlack,
  pin,
  postCalender,
  send,
} from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { HomeStackScreenProps, Screens } from "~/navigation/types";
import {
  createComment,
  createReplyToComment,
  getPost,
  listComments,
} from "~/network/api/services/post-service";
import { Comment } from "~/types/comment";
import { Post } from "~/types/post";
import { Reply } from "~/types/reply";
import { formatTimeFromNow, handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";

export const PostDetailScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<Screens.POST_DETAIL>) => {
  const postId = route.params.id;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [post, setPost] = useState<Post>();
  const [offerModal, CreateOfferModal] = useState(false);
  const [replyofferModal, openReplyOfferModal] = useState(false);
  var [gratisNo, totalGratisData] = useState(10);
  var [gratisNoComment, totalGratisCommentData] = useState(10);
  var [isCommentModalVisible, setCommentModalVisible] = useState(false);
  var [isCommentData, showMoreComment] = useState(false);
  const [addnewCmtReply, onAddCommentReply] = useState<string>();
  var [gratisIndex, gratisIndexData]: any = useState();
  const [isLoading, setLoading] = useState(false);
  const [pageCmt, setCmtPage] = useState(1);
  const [commentContent, setCommentContent] = useState("");
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [gratisCmtID, setreplyGratisId] = useState();
  const [gratisCmtKey, setreplyGratisKey] = useState();
  var [commentIndex, setCommentIndex]: any = useState();
  const [gratistype, setGratisSelectType] = useState();
  const [childjIndex, setChildIndexForGratis]: any = useState();
  const [commentId, setCommentId] = useState<string>();
  const [numGrats, setNumGrats] = useState<number>();
  const [numComments, setNumComments] = useState<number>();
  const flatListRef: any = React.useRef();

  useFocusEffect(
    useCallback(() => {
      const fetchPost = async () => {
        setLoading(true);
        try {
          const post = await getPost(postId);
          setPost(post);
          setNumComments(post.numComments);
        } catch (e) {
          handleApiError("Error loading post", e);
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
      getCommentListAPI();
    }, [postId])
  );

  const recentUserProfilePress = (id: any) => {
    navigation.push(Screens.USER_PROFILE, { id });
  };

  async function getCommentListAPI() {
    if (post) {
      setLoading(true);
      try {
        const comments = await listComments(post.id);
        setCommentList(comments);
      } catch (e) {
        handleApiError("Error getting comments", e);
      } finally {
        setLoading(false);
      }
    }
  }

  async function commentOnPost() {
    if (post) {
      setLoading(true);
      try {
        const newComment = await createComment(post.id, commentContent);
        setCommentList([newComment, ...commentList]);
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
      if (dataItem?.success === true) {
        let markers = [...commentList];

        markers[commentIndex]["gratis"] =
          dataItem?.data?.data?.numCommentssGratis;

        setNumGrats(dataItem?.data?.data?.postGratis);
        let markersTwo = { ...post };
        // markersTwo["gratis"] = dataItem?.data?.data?.postGratis;
        // setPostData(markersTwo);
      }

      if (dataItem?.success === false) {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }
    } catch (error) {
      handleApiError("Error sharing", error);
    } finally {
      setLoading(false);
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
      if (dataItem?.success === true) {
        let markers = [...commentList];

        markers[commentIndex]["replies"][childjIndex]["gratis"] =
          dataItem?.data?.data?.replayGratis;

        setNumGrats(dataItem?.data?.data?.postGratis);
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
    setLoading(true);
    if (!post) {
      return;
    }

    try {
      const updatedComment = await createReplyToComment(
        post.id,
        commentId!,
        addnewCmtReply!
      );
      setCommentList(
        commentList.map((c) => (c.id === commentId ? updatedComment : c))
      );
      setNumComments(numComments ?? 0 + 1);
    } catch (e) {
      handleApiError("Error creating reply", e);
    } finally {
      setLoading(false);
    }
  }

  const handleReplyToComment = (commentId: string) => {
    setCommentId(commentId);
    setCommentModalVisible(true);
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
    1;
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
      if (dataItem?.success === true) {
        let markers = { ...post };
        // markers["gratis"] = dataItem?.data?.data?.postGratis;
        // setPostData(markers);
        setNumGrats(dataItem?.data?.data?.postGratis);
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

  const onReplyAdd = () => {
    if (addnewCmtReply === "") {
      Toast.show("Add Comment", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      setLoading(true);
      replyCommentOnPostAPI();
      setCommentModalVisible(false);
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

  const renderItem: ListRenderItem<Comment> = ({ item: comment, index }) => {
    return (
      <View>
        <View style={styles.commentImgProfile}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => recentUserProfilePress(comment.commenter.id)}
          >
            <ImageComponent
              resizeMode="cover"
              style={styles.postProfile}
              source={{
                uri: comment.commenter.pic,
              }}
            ></ImageComponent>
          </TouchableOpacity>
          <View style={styles.commentDisplayCont}>
            <Text style={{ fontSize: 12, color: "#110101" }}>
              {comment.commenter.first_name} {comment.commenter.last_name}
            </Text>
            <Text style={styles.replyMsgCont}>{comment.content}</Text>
          </View>
        </View>

        <View style={styles.replyContainer}>
          <ImageComponent
            source={Vector}
            style={styles.vectorImg}
          ></ImageComponent>
          <TouchableOpacity onPress={() => handleReplyToComment(comment.id)}>
            <Text style={styles.replyLbl}>reply</Text>
          </TouchableOpacity>

          <Text style={styles.minuteCont}>
            {formatTimeFromNow(comment.postDate)}
          </Text>
          <Text style={styles.minuteCont}>{comment.gratis}</Text>
          <TouchableOpacity
            onPress={() =>
              openReplyGratis(
                comment.post_id,
                comment.id,
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

        {comment.replies.map((reply: Reply, jindex: number) => {
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
                    onPress={() => handleReplyToComment(comment.id)}
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
                        comment.post_id,
                        comment.id,
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

  const postLoad = () => {
    if (isCommentData) {
      setCmtPage(pageCmt + 1);
      getCommentListAPI();
    }
  };
  return post ? (
    <View style={{ flex: 1, paddingBottom: 300 }}>
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
                    <Text style={styles.posttitle}>{post.type}</Text>
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
                        onPress={() => recentUserProfilePress(post.author.id)}
                      >
                        <ImageComponent
                          resizeMode="cover"
                          style={styles.postProfile}
                          source={{ uri: post.author.pic }}
                        ></ImageComponent>
                      </TouchableOpacity>
                      <View>
                        <View>
                          {post?.type === "Gratis" ? (
                            <View>
                              <Text numberOfLines={1} style={styles.userName}>
                                {post.author.first_name} {post.author.last_name}{" "}
                              </Text>
                              {/* {post?.to?.users.length !== 0 ? (
                                <Text
                                  numberOfLines={1}
                                  style={styles.sentPointClass}
                                >
                                  sent {post?.to?.users[0]?.point} gratis to{" "}
                                  <Text style={styles.userName}>
                                    {
                                      post?.to?.users[0]?.user_id[
                                        "first_name"
                                      ]
                                    }{" "}
                                    {
                                      post?.to?.users[0]?.user_id[
                                        "last_name"
                                      ]
                                    }{" "}
                                    {
                                      post?.to?.users[1]?.user_id[
                                        "first_name"
                                      ]
                                    }{" "}
                                    {
                                      post?.to?.users[1]?.user_id[
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
                              {post.author.first_name} {post.author.last_name}
                            </Text>
                          )}
                          {post.postDate ? (
                            <Text style={styles.postTime}>
                              {formatTimeFromNow(post.postDate)}
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
                            post?.to?.users[0]?.user_id["id"]
                          )
                        }
                      >
                        <ImageComponent
                          resizeMode="cover"
                          style={styles.userListDisplay}
                          source={{
                            uri: post?.to?.users[0]?.user_id["pic"],
                          }}
                        ></ImageComponent>
                      </TouchableOpacity> */}
                      {/* <TouchableOpacity
                        onPress={() =>
                          recentUserProfilePress(
                            post?.to?.users[1]?.user_id["id"]
                          )
                        }
                      >
                        <ImageComponent
                          resizeMode="cover"
                          style={styles.userListDisplay}
                          source={{
                            uri: post?.to?.users[1]?.user_id["pic"],
                          }}
                        ></ImageComponent>
                      </TouchableOpacity> */}
                    </View>
                    <Text style={styles.postDes}>{post?.details}</Text>
                    {!_.isEmpty(post?.images) ? (
                      <ImageComponent
                        resizeMode="cover"
                        source={{ uri: post?.images[0] }}
                        style={styles.userPost}
                      ></ImageComponent>
                    ) : null}
                    <View style={styles.postDetailCont}>
                      <Text style={styles.postDetailTitle}>What:</Text>
                      {/* <ImageComponent
                        source={{ uri: post?.what?.icon }}
                        style={styles.detailImage}
                      ></ImageComponent> */}
                      <Text style={styles.postDetail}>{post.name}</Text>
                    </View>
                    {/* {post?.type !== "Gratis" ? (
                      <View style={styles.postDetailCont}>
                        <Text style={styles.postDetailTitle}>For:</Text>
                        <Image
                          source={{ uri: post?.for?.icon }}
                          style={styles.detailImage}
                        ></Image>
                        <Text style={styles.postDetail}>
                          {post?.for?.name}
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )} */}

                    {post.address ? (
                      <View style={styles.postDetailCont}>
                        <Text style={styles.postDetailTitle}>Where:</Text>
                        <Image source={pin} style={styles.detailImage}></Image>
                        <Text style={styles.postDetail}>{post.address}</Text>
                      </View>
                    ) : null}

                    {post.startDate ? (
                      <View style={styles.postDetailCont}>
                        <Text style={styles.postDetailTitle}>When:</Text>
                        <Image
                          source={postCalender}
                          style={styles.detailImage}
                        ></Image>
                        <Text style={styles.postDetail}>
                          {post.startDate?.toLocaleString()}
                        </Text>
                      </View>
                    ) : null}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.gratisContainer}
                      // onPress={() =>
                      //   OfferModalShow(post.id, route?.params.postIndex)
                      // }
                    >
                      <Text style={styles.gratisClass}>+{post?.numGrats}</Text>
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
                      <TouchableOpacity onPress={postLoad}>
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
        </View>
      </KeyboardAvoidingView>
    </View>
  ) : // </SafeAreaView>
  null;
};
