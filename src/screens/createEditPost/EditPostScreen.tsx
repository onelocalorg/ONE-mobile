import { useQuery } from "@tanstack/react-query";
import React from "react";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { usePostService } from "~/network/api/services/usePostService";
import { handleApiError } from "~/utils/common";
import { PostEditor } from "./PostEditor";

export const EditPostScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.EDIT_POST>) => {
  const postId = route.params.id;

  const {
    queries: { detail: postDetail },
  } = usePostService();

  const { isError, data: post, error } = useQuery(postDetail(postId));
  if (isError) handleApiError("Post", error);

  const handleSubmit = () => {
    navigation.goBack();
  };

  return (
    <>
      <PostEditor post={post} />
    </>
  );
};
