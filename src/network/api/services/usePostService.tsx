import { queryOptions, useQueryClient } from "@tanstack/react-query";
import _ from "lodash/fp";
import { LOG } from "~/config";
import { ApiError } from "~/types";
import { Block } from "~/types/block";
import { Gratis } from "~/types/gratis";
import { Post } from "~/types/post";
import { PostData } from "~/types/post-data";
import { PostDetail } from "~/types/post-detail";
import { PostUpdateData } from "~/types/post-update-data";
import { Reply } from "~/types/reply";
import { Report } from "~/types/report";
import { handleApiError } from "~/utils/common";
import { useApiService } from "./ApiService";
import { useEventService } from "./useEventService";
import { useUserService } from "./useUserService";

export function usePostService() {
  const queryClient = useQueryClient();
  const { queries: userQueries } = useUserService();
  const { queries: eventQueries } = useEventService();

  const queries = {
    all: () => ["posts"],
    lists: () => [...queries.all(), "list"],
    list: (filters?: GetPostsParams) =>
      queryOptions({
        queryKey: [...queries.lists(), filters],
        queryFn: () => getPosts(filters),
      }),
    details: () => [...queries.all(), "detail"],
    detail: (id?: string) =>
      queryOptions({
        queryKey: [...queries.details(), id],
        queryFn: () => getPost(id!),
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
      onError: (err: ApiError) => {
        handleApiError("create post", err);
      },
    },
    editPost: {
      mutationFn: (params: PostUpdateData) => {
        return updatePost(params);
      },
      onSuccess: () => {
        // TODO Change cache to invalidate less
        void queryClient.invalidateQueries({ queryKey: queries.lists() });
      },
      onError: (err: ApiError) => {
        handleApiError("reporting post", err);
      },
    },
    deletePost: {
      mutationFn: (postId: string) => {
        return deletePost(postId);
      },
      onSuccess: (resp: Report) => {
        void queryClient.invalidateQueries({
          queryKey: queries.lists(),
        });
      },
      onError: (err: ApiError) => {
        handleApiError("deleting post", err);
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
        void queryClient.invalidateQueries({
          queryKey: userQueries.detail(resp.sender).queryKey,
        });

        // FIXME Need to invalidate everything because we get the gratis
        // when pulling the whole list
        if (!resp.reply) {
          void queryClient.invalidateQueries({ queryKey: queries.lists() });
        }
      },
      onError: (err: ApiError) => {
        handleApiError("sending grats", err);
      },
    },
    blockUser: {
      mutationFn: (userId: string) => {
        return blockUser(userId);
      },
      onSuccess: (resp: Block) => {
        void queryClient.invalidateQueries({
          queryKey: queries.lists(),
        });
        void queryClient.invalidateQueries({
          queryKey: eventQueries.lists(),
        });
      },
      onError: (err: ApiError) => {
        handleApiError("blocking user", err);
      },
    },
    reportPost: {
      mutationFn: (params: ReportPostParams) => {
        return reportPost(params);
      },
      onSuccess: () => {},
      onError: (err: ApiError) => {
        handleApiError("reporting post", err);
      },
    },
  };

  const { doPost, doPatch, doGet, doDelete } = useApiService();

  async function createPost(data: PostData) {
    return doPost<PostDetail>("/v3/posts", data);
  }

  async function updatePost(data: PostUpdateData) {
    return doPatch<PostDetail>(`/v3/posts/${data.id}`, _.omit(["id"], data));
  }

  const getPost = (id: string) => doGet<PostDetail>(`/v3/posts/${id}`);

  const deletePost = (id: string) => doDelete<never>(`/v3/posts/${id}`);

  const blockUser = (postId: string) =>
    doPost<Block>(`/v3/posts/block-user/${postId}`);

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
    replyId?: string;
    points: number;
  }
  const sendGratis = ({ postId, replyId, points }: SendGratisProps) =>
    doPost<Gratis>(
      `/v3/posts/${postId}/${replyId ? `replies/${replyId}/` : ""}gratis`,
      { points }
    );

  const createReply = ({ postId, parentId, content }: CreateReplyProps) =>
    doPost<Reply>(`/v3/posts/${postId}/replies`, {
      parent: parentId,
      content,
    });

  interface ReportPostParams {
    postId: string;
    reason: string;
  }
  const reportPost = ({ postId, reason }: ReportPostParams) =>
    doPost<Report>(`/v3/posts/${postId}/reports`, { reason });

  return {
    queries,
    mutations,
  };
}

export interface CreateReplyProps {
  postId: string;
  parentId?: string;
  content: string;
}
