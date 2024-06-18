import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import {
  Vector,
  gratisGreen,
  gratitudeBlack,
  pin,
  postCalender,
  send,
} from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { usePostService } from "~/network/api/services/usePostService";
import { PostType } from "~/types/post-data";
import { PostDetail } from "~/types/post-detail";
import { Reply } from "~/types/reply";
import { formatTimeFromNow, handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";

export const PostDetailScreen = ({
  route,
}: RootStackScreenProps<Screens.POST_DETAIL>) => {
  const postId = route.params.id;
  const isReplyFocus = route.params.isReplyFocus ?? false;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [replyContent, setReplyContent] = useState("");
  const flatListRef: any = React.useRef();
  const replyRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  // const scroll = useRef<KeyboardAwareScrollView>(null);

  const { gotoUserProfile, showGiveGratsModal } = useNavigations();
  const [parent, setParent] = useState<string>();

  const {
    queries: { detail: postDetail },
    mutations: { createReply },
  } = usePostService();

  const {
    isPending,
    data: post,
    isError,
    error,
  } = useQuery(postDetail(postId));
  if (isError) handleApiError("Post", error);

  const getParents = () => post?.replies?.filter((r) => !r.parent) ?? [];
  const getChildren = (parentId: string) => {
    // Since eact reply only marked its direct parent reply, we recursively
    // go through the reply list
    // TODO Make more efficient by looking only at the children later in the
    // list, because parents always come before children
    const recurse = (acc: Reply[], parentId: string): Reply[] =>
      post!.replies.reduce(
        (a, r) => (r.parent === parentId ? [...a, r, ...recurse(a, r.id)] : a),
        acc
      );

    return recurse([], parentId);
  };

  const mutateCreateReply = useMutation(createReply);

  function sendReply() {
    mutateCreateReply.mutate(
      {
        postId,
        parentId: parent,
        content: replyContent,
      },
      {
        onSuccess: () => {
          flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
          setReplyContent("");
        },
      }
    );
  }

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", () =>
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true })
    );
    // Keyboard.addListener("keyboardWillHide", => )
  });

  const handlePressReply = (parentId?: string) => {
    setParent(parentId);
    const author = post!.replies.find((c) => c.id === parentId)?.author;
    if (author) {
      const name = `${author.firstName} ${author.lastName} `;
      setReplyContent(name);
    }

    // flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    replyRef.current?.focus();
  };

  interface PostProps {
    post: PostDetail;
  }
  const Post = ({ post }: PostProps) => (
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
      <Text style={styles.postDes}>{post.details}</Text>
      {!_.isEmpty(post.images) ? (
        <ImageComponent
          resizeMode="cover"
          source={{ uri: post.images[0] }}
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
          <Image source={postCalender} style={styles.detailImage}></Image>
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
          style={styles.replyImgTwo}
        ></ImageComponent>
      </TouchableOpacity>
    </View>
  );

  // const renderReply: ListRenderItem<Reply> = ({ item: reply, index }) => {
  // return (
  interface ReplyProps {
    reply: Reply;
  }
  const Reply = ({ reply }: ReplyProps) => (
    <View key={reply.id} style={styles.container}>
      <View style={styles.replyImgProfile}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={gotoUserProfile(reply.author)}
        >
          <ImageComponent
            resizeMode="cover"
            style={styles.postProfile}
            source={{
              uri: reply.author.pic,
            }}
          ></ImageComponent>
        </TouchableOpacity>
        <View style={styles.replyDisplayCont}>
          <Text style={{ fontSize: 12, color: "#110101" }}>
            {reply.author.firstName} {reply.author.lastName}
          </Text>
          <Text style={styles.replyMsgCont}>{reply.content}</Text>
        </View>
      </View>

      <View style={styles.replyContainer}>
        <ImageComponent
          source={Vector}
          style={styles.vectorImg}
        ></ImageComponent>
        <TouchableOpacity onPress={() => handlePressReply(reply.id)}>
          <Text style={styles.replyLbl}>reply</Text>
        </TouchableOpacity>

        <Text style={styles.minuteCont}>
          {formatTimeFromNow(reply.postDate)}
        </Text>
        <Text style={styles.minuteCont}>{reply.gratis}</Text>
        <TouchableOpacity
          onPress={showGiveGratsModal({
            post: postId,
            replyId: reply.id,
          })}
        >
          <ImageComponent
            resizeMode="cover"
            style={styles.replyImg}
            source={gratisGreen}
          ></ImageComponent>
        </TouchableOpacity>
      </View>

      {getChildren(reply.id).map((subReply: Reply, jindex: number) => {
        return (
          <View key={subReply.id}>
            <View>
              <View style={styles.replyImgProfileTwo}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={gotoUserProfile(subReply.author.id)}
                >
                  <ImageComponent
                    resizeMode="cover"
                    style={styles.postProfile}
                    source={{
                      uri: subReply.author.pic,
                    }}
                  ></ImageComponent>
                </TouchableOpacity>
                <View style={[styles.replyDisplayCont, { width: 210 }]}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#110101",
                    }}
                  >
                    {subReply.author.firstName} {subReply.author.lastName}
                  </Text>
                  <Text style={styles.replyMsgCont}>{subReply.content}</Text>
                </View>
              </View>

              <View style={styles.replyContainerTwo}>
                <ImageComponent
                  source={Vector}
                  style={styles.vectorImgTwo}
                ></ImageComponent>
                <TouchableOpacity onPress={() => handlePressReply(subReply.id)}>
                  <Text style={styles.replyLbl}>reply</Text>
                </TouchableOpacity>

                <Text style={styles.minuteCont}>
                  {formatTimeFromNow(subReply.postDate)}
                </Text>
                <Text style={styles.minuteCont}>{subReply.gratis}</Text>
                <TouchableOpacity
                  onPress={showGiveGratsModal({
                    post: postId,
                    replyId: subReply.id,
                  })}
                >
                  <ImageComponent
                    style={styles.replyImg}
                    source={gratisGreen}
                  ></ImageComponent>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
  // };

  const Footer = () => (
    <View style={styles.sticky}>
      <View style={styles.reply}>
        <TextInput
          ref={replyRef}
          style={styles.replyInput}
          placeholder="Make a Reply"
          placeholderTextColor="gray"
          value={replyContent}
          autoFocus={isReplyFocus}
          onChangeText={setReplyContent}
        ></TextInput>
        <TouchableOpacity style={{ alignSelf: "center" }} onPress={sendReply}>
          <ImageComponent
            style={{ height: 40, width: 40 }}
            source={send}
          ></ImageComponent>
        </TouchableOpacity>
      </View>
    </View>
  );

  return post ? (
    <View style={styles.container}>
      <Loader visible={isPending} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.viewport}>
            <ScrollView ref={scrollRef}>
              <View style={{ flex: 0.9 }}>
                {/* <View style={styles.replyModalContainer}>
            <View style={{ flex: 1 }}>
              <View style={styles.scrollViewReply}> */}
                {/* <FlatList
                    data={getParents()}
                    ref={flatListRef}
                    onEndReachedThreshold={0.005}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderReply}
                    ListHeaderComponent={ */}

                <Post post={post} />

                {getParents().map((reply) => (
                  <Reply key={reply.id} reply={reply} />
                ))}
              </View>
              {/* </View>
          </View>
        </View> */}
            </ScrollView>
            <View style={{ flex: 0.1 }}>
              <Footer />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  ) : null;
};
