import { queryOptions, useQueryClient } from "@tanstack/react-query";
import _ from "lodash/fp";
import { LOG } from "~/config";
import { ApiError } from "~/types";
import { Gratis } from "~/types/gratis";
import { Post } from "~/types/post";
import { PostData } from "~/types/post-data";
import { PostDetail } from "~/types/post-detail";
import { PostUpdateData } from "~/types/post-update-data";
import { Reply } from "~/types/reply";
import { handleApiError } from "~/utils/common";
import { useApiService } from "./ApiService";

export function usePostService() {
  const queryClient = useQueryClient();

  const queries = {
    all: () => ["posts"],
    lists: () => [...queries.all(), "list"],
    list: (filters?: GetPostsParams) =>
      queryOptions({
        queryKey: [...queries.lists(), filters],
        queryFn: () => getPosts(filters),
      }),
    details: () => [...queries.all(), "detail"],
    detail: (id: string) =>
      queryOptions({
        queryKey: [...queries.details(), id],
        queryFn: () => getPost(id),
        enabled: !!id,
        staleTime: 5000,
      }),
  };

  const mutations = {
    createPost: {
      mutationFn: (eventData: PostData) => {
        return createPost(eventData);
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: queries.lists() });
      },
    },
    createReply: {
      mutationFn: (params: CreateReplyProps) => {
        return createReply(params);
      },
      onSuccess: (resp: Reply) => {
        void queryClient.invalidateQueries({
          queryKey: queries.detail(resp.post).queryKey,
        });
      },
      onError: (err: ApiError) => {
        handleApiError("creating Reply", err);
      },
    },
    giveGrats: {
      mutationFn: (props: SendGratisProps) => {
        return sendGratis(props);
      },
      onSuccess: (resp: Gratis) => {
        void queryClient.invalidateQueries({
          queryKey: queries.detail(resp.post).queryKey,
        });

        // FIXME Need to invalidate everything because we get the gratis
        // when pulling the whole list
        void queryClient.invalidateQueries({ queryKey: queries.lists() });
      },
      onError: (err: ApiError) => {
        handleApiError("sending grats", err);
      },
    },
  };

  const { doPost, doPatch, doGet, doDelete } = useApiService();

  async function createPost(data: PostData) {
    return doPost<Post>("/v3/posts", data);
  }

  async function updatePost(id: string, data: PostUpdateData) {
    return doPatch<Post>(`/v3/posts/${id}`, data);
  }

  const getPost = (id: string) => doGet<PostDetail>(`/v3/posts/${id}`);

  const deletePost = (id: string) => doDelete<never>(`/v3/posts/${id}`);

  const blockUser = (postId: string) =>
    doPost(`/v3/posts/block-user/${postId}`);

  type GetPostsParams = {
    numPosts?: number;
    start?: string;
    isPast?: boolean;
  };
  const getPosts = ({
    numPosts = 20,
    isPast,
  }: GetPostsParams | undefined = {}) => {
    const urlParams: string[] = [];
    if (!_.isNil(isPast)) urlParams.push(`past=${isPast.toString()}`);
    if (!_.isNil(numPosts)) urlParams.push(`limit=${numPosts.toString()}`);

    const urlSearchParams = urlParams.join("&");
    LOG.debug("search", urlSearchParams);

    return doGet<Post[]>(`/v3/posts?${urlSearchParams.toString()}`);
  };

  interface SendGratisProps {
    postId: string;
    commentId?: string;
    replyId?: string;
    points: number;
  }
  const sendGratis = ({
    postId,
    commentId,
    replyId,
    points,
  }: SendGratisProps) =>
    doPost<Gratis>(
      `/v3/posts/${postId}/${commentId ? `comments/${commentId}` : ""}${
        replyId ? `replies/${replyId}` : ""
      }gratis`,
      { points }
    );

  interface CreateReplyProps {
    postId: string;
    parentId?: string;
    content: string;
  }
  const createReply = ({ postId, parentId, content }: CreateReplyProps) =>
    doPost<Reply>(`/v3/posts/${postId}/replies`, {
      parent: parentId,
      content,
    });

  const getReplies = (postId: string) =>
    doGet<Reply[]>(`/v3/posts/${postId}/replies`);

  const reportPost = (postId: string, reason: string) =>
    doPost(`/v3/posts/${postId}/reports`, { reason });

  return {
    queries,
    mutations,
    createPost,
    updatePost,
    getPosts,
    getPost,
    deletePost,
    reportPost,
    createReply,
    getReplies,
    sendGratis,
    blockUser,
  };
}
