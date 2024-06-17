import { queryOptions } from "@tanstack/react-query";
import _ from "lodash/fp";
import { DateTime } from "luxon";
import { LOG } from "~/config";
import { Comment } from "~/types/comment";
import { Post } from "~/types/post";
import { PostData } from "~/types/post-data";
import { PostGratis } from "~/types/post-gratis";
import { PostUpdateData } from "~/types/post-update-data";
import { useApiService } from "./api-service";

export function usePostService() {
  const postQueries = {
    all: () => ["posts"],
    lists: () => [...postQueries.all(), "list"],
    list: (filters?: ListPostsParams) =>
      queryOptions({
        queryKey: [...postQueries.lists(), filters],
        queryFn: () => getPosts(filters),
      }),
    details: () => [...postQueries.all(), "detail"],
    detail: (id: string) =>
      queryOptions({
        queryKey: [...postQueries.details(), id],
        queryFn: () => getPost(id),
        staleTime: 5000,
      }),
  };

  const commentQueries = {
    all: () => ["comments"],
    forPosts: () => [...commentQueries.all(), "detail"],
    forPost: (postId: string) =>
      queryOptions({
        queryKey: [...commentQueries.forPosts(), postId],
        queryFn: () => getComments(postId),
        staleTime: 5000,
      }),
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
    doPost(`/v1/posts/block-user/${postId}`);

  type ListPostsParams = {
    numPosts?: number;
    start?: string;
    startDate?: DateTime;
  };
  const getPosts = ({
    numPosts = 20,
    startDate,
  }: ListPostsParams | undefined = {}) => {
    const urlParams: string[] = [];
    if (!_.isNil(startDate)) urlParams.push(`startDate=${startDate.toISO()}`);
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
    doPost<PostGratis>("/v1/posts/gratis-sharing", { postId, points });

  const createComment = (postId: string, content: string) =>
    doPost<Comment>(`/v1/posts/${postId}/comments/create`, { content });

  const createReplyToComment = (
    postId: string,
    commentId: string,
    content: string
  ) =>
    doPost<Comment>(`/v1/posts/${postId}/comments/create`, {
      content,
      comment_id: commentId,
    });

  const getComments = (postId: string) =>
    doPost<Comment[]>(`/v1/comments?post_id=${postId}`, undefined);

  const reportPost = (postId: string, reason: string) =>
    doPost(`/v3/posts/${postId}/report`, { reason });

  return {
    postQueries,
    commentQueries,
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
