import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import {
  Vector,
  defaultUser,
  gratisGreen,
  gratitudeBlack,
  pin,
  postCalender,
  send,
} from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { useMyUserId } from "~/navigation/AuthContext";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  CreateReplyProps,
  DeleteReplyProps,
  PostMutations,
  usePostService,
} from "~/network/api/services/usePostService";
import { PostDetail } from "~/types/post";
import { Reply } from "~/types/reply";
import { formatTimeFromNow } from "~/utils/common";
import { createStyleSheet } from "./style";

export const PostDetailScreen = ({
  route,
}: RootStackScreenProps<Screens.POST_DETAIL>) => {
  const { id: postId, reply: replyId } = route.params;
  const isReplyFocus = route.params.isReplyFocus ?? false;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const replyRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const myUserId = useMyUserId();
  const { gotoUserProfile, showGiveGratisModal } = useNavigations();

  const {
    queries: { detail: postDetail },
  } = usePostService();
  const { mutate: createReply, isPending: isQueryPending } = useMutation<
    Reply,
    Error,
    CreateReplyProps
  >({ mutationKey: [PostMutations.createReply] });
  const { mutate: deleteReply, isPending: isDeletePending } = useMutation<
    never,
    Error,
    DeleteReplyProps
  >({
    mutationKey: [PostMutations.deleteReply],
  });

  const { isLoading, data: post } = useQuery(postDetail(postId));

  const { control, handleSubmit, resetField, setValue } =
    useForm<CreateReplyProps>({
      defaultValues: {
        postId,
        content: "",
      },
    });

  const onSubmitReply = (data: CreateReplyProps) =>
    createReply(data, { onSuccess: () => resetField("content") });

  const getParents = () =>
    post?.replies?.filter((r) => !r.parent).reverse() ?? [];

  const getChildren = (parentId: string) => {
    const children = post!.replies.filter((r) => r.parent === parentId);

    return children;
  };

  const handlePressReply = (parentId?: string) => {
    // TODO When we have tagging, add the reply peron's name
    // const author = post!.replies.find((c) => c.id === parentId)?.author;
    // if (author) {
    //   const name = `${author.firstName} `;
    //   setValue("content", name);
    // }

    setValue("parentId", parentId);
    replyRef.current?.focus();
  };

  const handleDeleteReply = (replyId: string) => () => {
    deleteReply({ postId, replyId });
  };

  if (post?.replies) {
    console.log(JSON.stringify(post.replies, undefined, "  "));
  }

  interface PostViewProps {
    post: PostDetail;
  }
  const PostView = ({ post }: PostViewProps) => (
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
            <Text numberOfLines={1} style={styles.userName}>
              {post.author.firstName} {post.author.lastName}
            </Text>
            {post.postDate ? (
              <Text style={styles.postTime}>
                {formatTimeFromNow(post.postDate)}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      <Text style={styles.postDes}>{post.details}</Text>
      {!_.isEmpty(post.images?.length > 0) ? (
        <ImageComponent
          resizeMode="cover"
          source={{ uri: post.images[0].url }}
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
        onPress={showGiveGratisModal({ post })}
      >
        <Text style={styles.gratisClass}>+{post.gratis}</Text>
        <ImageComponent
          source={gratitudeBlack}
          style={styles.replyImgTwo}
        ></ImageComponent>
      </TouchableOpacity>
    </View>
  );

  interface ReplyProps {
    reply: Reply;
    indent?: boolean;
  }
  const Reply = ({ reply, indent = true }: ReplyProps) => (
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
          <View style={{ flexDirection: "row" }}>
            <Pressable onPress={gotoUserProfile(reply.author)}>
              <ImageComponent
                style={styles.replyAvatar}
                resizeMode="cover"
                isUrl={!!reply.author.pic}
                source={defaultUser}
                uri={reply.author.pic}
              ></ImageComponent>
            </Pressable>
            <Text style={{ paddingLeft: 10, fontSize: 12, color: "#110101" }}>
              {reply.author.firstName} {reply.author.lastName}
            </Text>
            {reply.author.id === myUserId && (
              <Pressable onPress={handleDeleteReply(reply.id)}>
                <Text style={styles.delete}>X</Text>
              </Pressable>
            )}
          </View>
          <Text style={styles.replyMsgCont}>
            {reply.isDeleted ? "Deleted" : reply.content}
          </Text>
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
          onPress={showGiveGratisModal({
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

      {getChildren(reply.id).map((subReply: Reply) => (
        <View key={subReply.id} style={indent && styles.replyImgProfileTwo}>
          <Reply reply={subReply} indent={false} />
        </View>
      ))}
    </View>
  );

  const Footer = () => (
    <View style={{ height: 100 }}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.reply}>
            <TextInput
              ref={replyRef}
              style={styles.replyInput}
              placeholder="Make a Reply"
              placeholderTextColor="gray"
              value={value}
              autoFocus={isReplyFocus}
              onBlur={onBlur}
              onChangeText={onChange}
            ></TextInput>
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={handleSubmit(onSubmitReply)}
              disabled={isQueryPending}
            >
              <ImageComponent
                style={{ height: 40, width: 40 }}
                source={send}
              ></ImageComponent>
            </TouchableOpacity>
          </View>
        )}
        name="content"
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View style={styles.container}>
        <Loader visible={isLoading || isDeletePending} />
        <ScrollView ref={scrollRef}>
          {post ? (
            <View style={{ flex: 0.9 }}>
              <PostView post={post} />
              {getParents().map((reply) => (
                <Reply key={reply.id} reply={reply} />
              ))}
            </View>
          ) : null}
        </ScrollView>
        <Footer />
      </View>
    </KeyboardAvoidingView>
  );
};
