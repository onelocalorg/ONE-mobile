import { useInfiniteQuery } from "@tanstack/react-query";
import React, { ReactElement, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
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
import { PostCard, PostCardSize } from "./PostCard";
import { createStyleSheet } from "./style";

type PostsListProps = {
  header?: ReactElement;
};
export const PostsList = ({ header }: PostsListProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const { gotoPostDetails, showGiveGratisModal } = useNavigations();

  const {
    queries: { infiniteList },
  } = usePostService();

  const {
    data: posts,
    fetchNextPage,
    refetch,
    hasNextPage,
    isRefetching,
    isFetching,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery(infiniteList());

  const loadNext = useCallback(() => {
    hasNextPage && !isFetching && fetchNextPage().catch(console.error);
  }, [fetchNextPage, hasNextPage]);

  const onRefresh = useCallback(() => {
    !isRefetching && refetch().catch(console.error);
  }, [isRefetching, refetch]);

  const postRenderer: ListRenderItem<Post> = ({ item: post }) => {
    return (
      <View style={styles.feedContainer}>
        <Pressable onPress={() => gotoPostDetails(post)}>
          <PostCard post={post} size={PostCardSize.Medium} />
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
      <FlatList
        data={(posts?.pages.flat() as Post[]) || []}
        keyExtractor={(item) => item.id}
        renderItem={postRenderer}
        onEndReached={loadNext}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            tintColor={theme.colors.white}
            colors={[theme.colors.white]}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={styles.scrollView}
        ListEmptyComponent={
          <View style={styles.listEmptyComponent}>
            <Text>{strings.noPostFound}</Text>
          </View>
        }
        ListHeaderComponent={header}
        ListFooterComponent={
          <View style={styles.listFooterComponent}>
            {isFetchingNextPage && <ActivityIndicator />}
            {!hasNextPage && !isLoading && (
              <Text style={{ color: "white" }}>
                You have reached the end. Congratulations!
              </Text>
            )}
          </View>
        }
      ></FlatList>
    </>
  );
};
