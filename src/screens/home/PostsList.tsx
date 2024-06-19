import { useQuery } from "@tanstack/react-query";
import React, { ReactElement, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { useNavigations } from "~/app-hooks/useNavigations";
import { comment, gratitudeBlack } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { usePostService } from "~/network/api/services/usePostService";
import { Post } from "~/types/post";
import { handleApiError } from "~/utils/common";
import { PostCard } from "./PostCard";
import { createStyleSheet } from "./style";

type PostsListProps = {
  header?: ReactElement;
};
export const PostsList = ({ header }: PostsListProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [isLoading, setLoading] = useState(false);
  const { gotoPostDetails, showGiveGratisModal } = useNavigations();

  const {
    queries: { list: listPosts },
  } = usePostService();

  const { isPending, isError, data: posts, error } = useQuery(listPosts());

  if (isPending !== isLoading) setLoading(isPending);
  if (isError) handleApiError("Posts", error);

  const postRenderer: ListRenderItem<Post> = ({ item: post }) => {
    return (
      <View style={styles.feedContainer}>
        <Pressable onPress={() => gotoPostDetails(post)}>
          <PostCard post={post} />
          <View style={styles.gratisAndReplyContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.gratisContainer}
              onPress={showGiveGratisModal({ post: post })}
            >
              <Text style={styles.gratisClass}>+{post.gratis}</Text>
              <ImageComponent
                source={gratitudeBlack}
                style={styles.replyImgTwo}
              ></ImageComponent>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={gotoPostDetails(post, true)}
              style={styles.repliesContainer}
            >
              <Text style={styles.replyClass}>{post.numReplies}</Text>
              <ImageComponent
                source={comment}
                style={styles.replyImageThree}
              ></ImageComponent>
            </TouchableOpacity>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <Loader visible={isLoading} />
      {posts ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={postRenderer}
          contentContainerStyle={styles.scrollView}
          ListHeaderComponent={header}
          // ListFooterComponent={renderLoader}
        ></FlatList>
      ) : null}
      {!posts && !isPending ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>
            {strings.noPostFound}
          </Text>
        </View>
      ) : null}
    </>
  );
};
