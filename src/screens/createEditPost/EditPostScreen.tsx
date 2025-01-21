import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { Loader } from "~/components/loader";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  PostMutations,
  usePostService,
} from "~/network/api/services/usePostService";
import { Post, PostUpdateData } from "~/types/post";
import { PostEditor } from "./PostEditor";
import { createStyleSheet } from "./style";

export const EditPostScreen = ({
  route,
}: RootStackScreenProps<Screens.EDIT_POST>) => {
  const postId = route.params?.id;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const {
    queries: { detail: getPost },
  } = usePostService();

  const { data: post, isPending, isLoading } = useQuery(getPost(postId));

  const mutateEditPost = useMutation<Post, Error, PostUpdateData>({
    mutationKey: [PostMutations.editPost],
  });

  return (
    <>
      <Loader visible={!!post && isPending} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.postClass}>
          {!postId || post ? (
            <PostEditor
              post={post}
              onSubmitUpdate={mutateEditPost.mutate}
              isLoading={isLoading}
            />
          ) : null}
        </View>
      </ScrollView>
    </>
  );
};
