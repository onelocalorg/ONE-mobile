import React, { useState } from "react";
import { useAppTheme } from "~/app-hooks/use-app-theme";

import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash/fp";
import {
  FlatList,
  Image,
  Keyboard,
  ListRenderItem,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-simple-toast";
import {
  Vector,
  gratisGreen,
  gratitudeBlack,
  pin,
  postCalender,
  send,
} from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { RootStackScreenProps, Screens } from "~/navigation/types";

import { useQuery } from "@tanstack/react-query";
import { useNavigations } from "~/app-hooks/useNavigations";
import { usePostService } from "~/network/api/services/usePostService";
import { Comment } from "~/types/comment";
import { PostType } from "~/types/post-data";
import { Reply } from "~/types/reply";
import { formatTimeFromNow, handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";

export const PostDetailScreen = ({
  route,
}: RootStackScreenProps<Screens.POST_DETAIL>) => {
  const postId = route.params.id;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [offerModal, CreateOfferModal] = useState(false);
  const [replyofferModal, openReplyOfferModal] = useState(false);
  const [gratisNo, totalGratisData] = useState(10);
  const [gratisNoComment, totalGratisCommentData] = useState(10);
  const [addnewCmtReply, onAddCommentReply] = useState<string>();
  const [gratisIndex, gratisIndexData]: any = useState();
  const [isLoading, setLoading] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [gratisCmtID, setreplyGratisId] = useState();
  const [gratisCmtKey, setreplyGratisKey] = useState();
  const [commentIndex, setCommentIndex]: any = useState();
  const [gratistype, setGratisSelectType] = useState();
  const [childjIndex, setChildIndexForGratis]: any = useState();
  const [commentId, setCommentId] = useState<string>();
  const flatListRef: any = React.useRef();
  const { gotoUserProfile } = useNavigations();

  const {
    queries: { detail: postDetail, commentsOnPost },
  } = usePostService();

  const postQuery = useQuery(postDetail(postId));
  const commentQuery = useQuery(commentsOnPost(postId));

  if (postQuery.isPending && commentQuery.isPending !== isLoading) {
    setLoading(postQuery.isPending && commentQuery.isPending);
  }
  if (postQuery.isError) handleApiError("Post", postQuery.error);
  if (commentQuery.isError) handleApiError("Comments", commentQuery.error);

  const post = postQuery.data;
  const comments = commentQuery.data;

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
    const data: any = {
      postId: postId,
      points: gratisNoComment,
      commentId: gratisCmtID,
      commentKey: gratisCmtKey,
    };
    try {
      const response = await fetch(
        process.env.API_URL + "/v3/posts/gratis-sharing",
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
        const markers = [...commentList];

        markers[commentIndex]["gratis"] =
          dataItem?.data?.data?.numCommentssGratis;

        setNumGrats(dataItem?.data?.data?.postGratis);
        const markersTwo = { ...post };
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
    const data: any = {
      postId: postId,
      points: gratisNoComment,
      commentId: gratisCmtID,
      commentKey: gratisCmtKey,
    };
    try {
      const response = await fetch(
        process.env.API_URL + "/v3/posts/gratis-sharing",
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
        const markers = [...commentList];

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
    const data: any = {
      postId: postId,
      points: gratisNo,
    };
    try {
      const response = await fetch(
        process.env.API_URL + "/v3/posts/gratis-sharing",
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
        const markers = { ...post };
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

  const renderComment: ListRenderItem<Comment> = ({ item: comment, index }) => {
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
              {comment.commenter.firstName} {comment.commenter.lastName}
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
                      {reply.commenter.firstName} {reply.commenter.lastName}
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

  return post ? (
    <View style={{ flex: 1, paddingBottom: 300 }}>
      <View style={styles.commentModalContainer}>
        <View style={{ flex: 1 }}>
          <View style={styles.scrollViewComment}>
            <FlatList
              data={comments}
              ref={flatListRef}
              onEndReachedThreshold={0.005}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderComment}
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
                      onPress={() => gotoUserProfile(post.author.id)}
                    >
                      <ImageComponent
                        resizeMode="cover"
                        style={styles.postProfile}
                        source={{ uri: post.author.pic }}
                      ></ImageComponent>
                    </TouchableOpacity>
                    <View>
                      <View>
                        {post.type === PostType.GRATIS ? (
                          <View>
                            <Text numberOfLines={1} style={styles.userName}>
                              {post.author.firstName} {post.author.lastName}{" "}
                            </Text>
                          </View>
                        ) : (
                          <Text numberOfLines={1} style={styles.userName}>
                            {post.author.firstName} {post.author.lastName}
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
                    <Text style={styles.postDetail}>{post.name}</Text>
                  </View>

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
                  {comments?.length !== 0 && !isLoading ? (
                    <View>
                      {comments ? (
                        <Text style={styles.getMoreDataCont}>
                          Get More Comments
                        </Text>
                      ) : (
                        <></>
                      )}
                    </View>
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
    </View>
  ) : // </SafeAreaView>
  null;
};
