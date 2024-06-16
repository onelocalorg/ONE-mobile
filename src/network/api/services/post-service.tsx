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
  const listPosts = ({ numPosts = 20, startDate }: ListPostsParams) => {
    const urlParams: string[] = [];
    if (!_.isNil(startDate)) urlParams.push(`start_date=${startDate.toISO()}`);
    if (!_.isNil(numPosts)) urlParams.push(`limit=${numPosts.toString()}`);

    const urlSearchParams = urlParams.join("&");
    LOG.debug("search", urlSearchParams);

    return doGet(`/v3/posts?${urlSearchParams.toString()}`);
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

  const listComments = (postId: string) =>
    doPost<Comment[]>(`/v1/comments?post_id=${postId}`, undefined);

  const reportPost = (postId: string, reason: string) =>
    doPost(`/v3/posts/${postId}/report`, { reason });

  return {
    createPost,
    updatePost,
    listPosts,
    getPost,
    deletePost,
    reportPost,
    createComment,
    listComments,
    sendGratis,
    blockUser,
    createReplyToComment,
  };
}
