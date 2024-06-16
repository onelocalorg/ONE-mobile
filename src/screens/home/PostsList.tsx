import { useQuery } from "@tanstack/react-query";
import React, { ReactElement, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { comment, gratitudeBlack } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { usePostService } from "~/network/api/services/post-service";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";
import { handleApiError } from "~/utils/common";
import { PostContentView } from "./PostContentView";
import { createStyleSheet } from "./style";

type PostsListProps = {
  header?: ReactElement;
  onContextMenuPress?: (post: Post) => void;
  onPostPress?: (post: Post) => void;
  onAvatarPress?: (user: OneUser) => void;
  onGiveGratsPress?: (post: Post) => void;
};
export const PostsList = ({
  header,
  onContextMenuPress,
  onPostPress,
  onAvatarPress,
  onGiveGratsPress,
}: PostsListProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [isLoading, setLoading] = useState(false);

  const { listPosts } = usePostService();

  const {
    isPending,
    isError,
    data: posts,
    error,
  } = useQuery({
    queryKey: ["posts", { numPosts: 30 }],
    queryFn: () => listPosts({ numPosts: 30 }),
  });
  if (isPending !== isLoading) setLoading(isPending);
  if (isError) handleApiError("Posts", error);

  const postRenderer: ListRenderItem<Post> = ({ item: post, index }) => {
    return (
      <View style={styles.feedContainer}>
        <PostContentView
          post={post}
          onPress={() => onContextMenuPress?.(post)}
          onAvatarPress={onAvatarPress}
        />
        <View style={styles.gratisAndCommentContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.gratisContainer}
            onPress={() => onGiveGratsPress?.(post)}
          >
            <Text style={styles.gratisClass}>+{post.numGrats}</Text>
            <ImageComponent
              source={gratitudeBlack}
              style={styles.commentImgTwo}
            ></ImageComponent>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onPostPress?.(post)}
            style={styles.commentsContainer}
          >
            <Text style={styles.commentClass}>{post.numComments}</Text>
            <ImageComponent
              source={comment}
              style={styles.commentImageThree}
            ></ImageComponent>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <Loader visible={isLoading} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={postRenderer}
        contentContainerStyle={styles.scrollView}
        ListHeaderComponent={header}
        // ListFooterComponent={renderLoader}
      ></FlatList>
      <View style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>
        <Text style={{ color: "white", fontSize: 18 }}>
          {posts?.length === 0 ? strings.noPostFound : ""}
        </Text>
      </View>
    </>
  );
};
