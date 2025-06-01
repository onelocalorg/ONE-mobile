import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { Loader } from "~/components/loader";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  PostMutations,
  usePostService,
} from "~/network/api/services/usePostService";
import { Post, PostData, PostType, PostUpdateData } from "~/types/post";
import { PostEditor } from "./PostEditor";
import { createStyleSheet } from "./style";

export const CreateEditPostScreen = ({
  route,
}: RootStackScreenProps<Screens.CREATE_EDIT_POST>) => {
  const postId = route.params?.id;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [type, setType] = useState(PostType.OFFER);

  const {
    queries: { detail: getPost },
  } = usePostService();

  const { data: post, isPending, isLoading } = useQuery(getPost(postId));

  const getType = () => post?.type ?? type;

  const mutateCreatePost = useMutation<Post, Error, PostData>({
    mutationKey: [PostMutations.createPost],
  });
  const mutateEditPost = useMutation<Post, Error, PostUpdateData>({
    mutationKey: [PostMutations.editPost],
  });

  return (
    <>
      <Loader visible={!!post && isPending} />
      <View>
        <View style={styles.postClass}>
          {!postId || post ? (
            <PostEditor
              post={post}
              onSubmitCreate={mutateCreatePost.mutate}
              onSubmitUpdate={mutateEditPost.mutate}
              isLoading={isLoading}
            />
          ) : null}
        </View>
      </View>
    </>
  );
};
