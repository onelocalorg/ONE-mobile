import { queryOptions, useQueryClient } from "@tanstack/react-query";
import _ from "lodash/fp";
import { LOG } from "~/config";
import { Comment } from "~/types/comment";
import { Post } from "~/types/post";
import { PostData } from "~/types/post-data";
import { PostGratis } from "~/types/post-gratis";
import { PostUpdateData } from "~/types/post-update-data";
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
        void queryClient.invalidateQueries({ queryKey: queries.all() });
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

  async function deletePost(id: string) {
    return doPost<never>(`/v3/posts/delete/${id}`);
  }

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

  const sendGratis = (postId: string, points: number) =>
    doPost<PostGratis>("/v3/posts/gratis-sharing", { postId, points });

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
