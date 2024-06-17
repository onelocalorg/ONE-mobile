import { useQuery } from "@tanstack/react-query";
import React from "react";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { usePostService } from "~/network/api/services/usePostService";
import { handleApiError } from "~/utils/common";
import { CreateEditPost } from "./CreateEditPost";

export const CreateEditPostScreen = ({
  route,
}: RootStackScreenProps<Screens.CREATE_EDIT_POST>) => {
  const eventId = route.params?.id;

  const { getPost } = usePostService();

  const {
    isError,
    data: post,
    error,
  } = useQuery({
    queryKey: ["post", eventId],
    queryFn: () => getPost(eventId!),
    enabled: !!eventId,
  });
  if (isError) handleApiError("Post", error);

  return <CreateEditPost post={post} />;
};
