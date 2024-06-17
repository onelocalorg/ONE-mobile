import { queryOptions, useQueryClient } from "@tanstack/react-query";
import _ from "lodash/fp";
import { LOG } from "~/config";
import { Comment } from "~/types/comment";
import { Post } from "~/types/post";
import { PostData } from "~/types/post-data";
import { PostUpdateData } from "~/types/post-update-data";
import { SendGrats } from "~/types/send-grats";
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
    comments: () => [...queries.all(), "comments"],
    commentsOnPost: (postId: string) =>
      queryOptions({
        queryKey: [...queries.comments(), postId],
        queryFn: () => getComments(postId),
        staleTime: 5000,
      }),
  };

  const mutations = {
    createPost: {
      mutationFn: (eventData: PostData) => {
        return createPost(eventData);
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: queries.details() });
      },
    },
    giveGrats: {
      mutationFn: (props: SendGratsProps) => {
        return sendGratis(props);
      },
      onSuccess: (data: SendGrats) => {
        void queryClient.invalidateQueries({ queryKey: queries.lists() });
        void queryClient.invalidateQueries({
          queryKey: queries.detail(data.post).queryKey,
        });
      },
    },
  };

  const { doPost, doPatch, doGet } = useApiService();

  async function createPost(data: PostData) {
    return doPost<Post>("/v3/posts", postToBody(data));
  }

  async function updatePost(id: string, data: PostUpdateData) {
    return doPatch<Post>(`/v3/posts/${id}`, postToBody(data));
  }

  const getPost = (id: string) => doGet<Post>(`/v3/posts/${id}`);

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

  const postToBody = (data: PostUpdateData) => ({
    ...data,
    startDate: data.startDate?.toISO(),
    timezone: data.startDate ? data.startDate.zoneName : undefined,
  });

  interface SendGratsProps {
    postId: string;
    points: number;
  }
  const sendGratis = ({ postId, points }: SendGratsProps) =>
    doPost<SendGrats>(`/v3/posts/${postId}/grats`, { points });

  const createComment = (postId: string, content: string) =>
    doPost<Comment>(`/v3/posts/${postId}/comments/create`, { content });

  const createReplyToComment = (
    postId: string,
    commentId: string,
    content: string
  ) =>
    doPost<Comment>(`/v3/posts/${postId}/comments/create`, {
      content,
      comment_id: commentId,
    });

  const getComments = (postId: string) =>
    doPost<Comment[]>(`/v3/comments?post_id=${postId}`, undefined);

  const reportPost = (postId: string, reason: string) =>
    doPost(`/v3/posts/${postId}/report`, { reason });

  return {
    queries,
    mutations,
    createPost,
    updatePost,
    listPosts: getPosts,
    getPost,
    deletePost,
    reportPost,
    createComment,
    listComments: getComments,
    sendGratis,
    blockUser,
    createReplyToComment,
  };
}
function doDelete<T>(arg0: string) {
  throw new Error("Function not implemented.");
}
