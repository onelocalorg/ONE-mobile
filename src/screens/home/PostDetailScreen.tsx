import React, { useState } from "react";
import { useAppTheme } from "~/app-hooks/use-app-theme";

import _ from "lodash/fp";
import {
  FlatList,
  Image,
  ListRenderItem,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigations } from "~/app-hooks/useNavigations";
import { usePostService } from "~/network/api/services/usePostService";
import { Comment } from "~/types/comment";
import { PostType } from "~/types/post-data";
import { Reply } from "~/types/reply";
import { formatTimeFromNow, handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";

interface ReplyContext {
  commentId: string;
  parentId?: string;
}

export const PostDetailScreen = ({
  route,
}: RootStackScreenProps<Screens.POST_DETAIL>) => {
  const postId = route.params.id;
  const isCommentFocus = route.params.isCommentFocus ?? false;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [replyofferModal, openReplyOfferModal] = useState(false);
  const [gratisNo, totalGratisData] = useState(10);
  const [gratisNoComment, totalGratisCommentData] = useState(10);
  const [addnewCmtReply, onAddCommentReply] = useState<string>();
  const [isLoading, setLoading] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [gratistype, setGratisSelectType] = useState();
  const [commentId, setCommentId] = useState<string>();
  const flatListRef: any = React.useRef();
  const { gotoUserProfile, showGiveGratsModal } = useNavigations();
  const [replyContext, setReplyContext] = useState<ReplyContext>();

  const {
    queries: { detail: postDetail, commentsOnPost },
    mutations: { createComment, createReply },
  } = usePostService();
  const postQuery = useQuery(postDetail(postId));
  const commentQuery = useQuery(commentsOnPost(postId));

  const mutateCreateComment = useMutation(createComment);
  const mutateCreateReply = useMutation(createReply);

  if (postQuery.isPending && commentQuery.isPending !== isLoading) {
    setLoading(postQuery.isPending && commentQuery.isPending);
  }
  if (postQuery.isError) handleApiError("Post", postQuery.error);
  if (commentQuery.isError) handleApiError("Comments", commentQuery.error);

  const post = postQuery.data;
  const comments = commentQuery.data;

  function postComment() {
    mutateCreateComment.mutate(
      {
        postId,
        content: commentContent,
      },
      {
        onSuccess: () => {
          flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
          setCommentContent("");
        },
      }
    );
  }

  function postReply({ commentId, parentId }: ReplyContext) {
    mutateCreateReply.mutate(
      {
        postId,
        commentId,
        parentId,
        content: commentContent,
      },
      {
        onSuccess: () => {
          flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
          setCommentContent("");
        },
      }
    );
  }

  const postCommentOrReply = () => {
    if (replyContext) {
      postReply(replyContext);
    } else {
      postComment();
    }
  };

  const handleReplyToComment = (commentId: string) => {
    const author = comments?.find((c) => c.id === commentId)?.author;
    if (author) {
      const name = `${author.firstName} ${author.lastName} `;
      setCommentContent(name);
      setReplyContext({
        commentId,
      });
    }

    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const renderComment: ListRenderItem<Comment> = ({ item: comment, index }) => {
    return (
      <View style={styles.container}>
        <View style={styles.commentImgProfile}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={gotoUserProfile(comment.author)}
          >
            <ImageComponent
              resizeMode="cover"
              style={styles.postProfile}
              source={{
                uri: comment.author.pic,
              }}
            ></ImageComponent>
          </TouchableOpacity>
          <View style={styles.commentDisplayCont}>
            <Text style={{ fontSize: 12, color: "#110101" }}>
              {comment.author.firstName} {comment.author.lastName}
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
            onPress={showGiveGratsModal({
              post: postId,
              commentId: comment.id,
            })}
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
                    onPress={gotoUserProfile(reply.author.id)}
                  >
                    <ImageComponent
                      resizeMode="cover"
                      style={styles.postProfile}
                      source={{
                        uri: reply.author.pic,
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
                      {reply.author.firstName} {reply.author.lastName}
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
                    onPress={showGiveGratsModal({
                      post: postId,
                      commentId: comment.id,
                      replyId: reply.id,
                    })}
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
    <View style={{ flex: 1 }}>
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
                    <TouchableOpacity onPress={gotoUserProfile(post.author.id)}>
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
                    onPress={showGiveGratsModal({ post })}
                  >
                    <Text style={styles.gratisClass}>+{post?.gratis}</Text>
                    <ImageComponent
                      source={gratitudeBlack}
                      style={styles.commentImgTwo}
                    ></ImageComponent>
                  </TouchableOpacity>
                </View>
              }
            ></FlatList>
          </View>
        </View>
      </View>
      <View style={styles.bottomButton}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.commentInput}
            placeholder="Make a Comment"
            placeholderTextColor="gray"
            value={commentContent}
            autoFocus={isCommentFocus}
            onChangeText={setCommentContent}
          ></TextInput>
          <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={postCommentOrReply}
          >
            <ImageComponent
              style={{ height: 40, width: 40 }}
              source={send}
            ></ImageComponent>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ) : // </SafeAreaView>
  null;
};
