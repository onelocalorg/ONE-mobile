import _ from "lodash/fp";
import { DateTime } from "luxon";
import { LOG } from "~/config";
import { Comment } from "~/types/comment";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";
import { PostData } from "~/types/post-data";
import { PostUpdateData } from "~/types/post-update-data";
import { useApiService } from "./api-service";

export function usePostService() {
  const { doPost, doPatch, doGet } = useApiService();

  async function createPost(data: PostData) {
    return doPost<Post>("/v3/posts", postToBody(data), resourceToPost);
  }

  async function updatePost(id: string, data: PostUpdateData) {
    return doPatch<Post>(`/v3/posts/${id}`, postToBody(data), resourceToPost);
  }

  const getPost = (id: string) =>
    doGet<Post>(`/v3/posts/${id}`, resourceToPost);

  async function deletePost(id: string) {
    return doPost<never>(`/v3/posts/delete/${id}`);
  }

  type ListPostsParams = {
    numPosts?: number;
    start?: string;
    startDate?: DateTime;
  };
  const listPostsForMap = (props?: ListPostsParams) =>
    listPostsInternal({
      ...props,
      formatForMap: true,
    }) as Promise<GeoJSON.FeatureCollection>;

  // TODO 'start' is for pagination
  const listPosts = (props?: ListPostsParams) =>
    listPostsInternal(props ?? {}) as Promise<Post[]>;

  const blockUser = (postId: string) =>
    doPost(`/v1/posts/block-user/${postId}`);

  type ListPostsInternalParams = {
    numPosts?: number;
    start?: string;
    startDate?: DateTime;
    formatForMap?: boolean;
  };
  const listPostsInternal = ({
    numPosts = 20,
    startDate,
    formatForMap = false,
  }: ListPostsInternalParams) => {
    const urlParams: string[] = [];
    if (!_.isNil(startDate)) urlParams.push(`start_date=${startDate.toISO()}`);
    if (!_.isNil(numPosts)) urlParams.push(`limit=${numPosts.toString()}`);

    const urlSearchParams = urlParams.join("&");
    LOG.debug("search", urlSearchParams);

    return doGet(
      `/v3/posts?${urlSearchParams.toString()}`,
      formatForMap
        ? resourcesToFeatureCollection
        : (data) => data.map(resourceToPost)
    );
  };

  const resourcesToFeatureCollection = (posts: PostResource[]) =>
    ({
      type: "FeatureCollection",
      features: _.flow([
        _.map((post: PostResource) =>
          post.coordinates
            ? {
                type: "Feature",
                properties: { ..._.omit(["location"], post) },
                geometry: {
                  type: "Point",
                  coordinates: post.coordinates,
                },
              }
            : null
        ),
        _.reject(_.isNull),
      ])(posts),
    } as GeoJSON.FeatureCollection);

  // The JSON returned from the API call
  interface PostResource {
    id: string;
    type: string;
    name: string;
    author: OneUser;
    coordinates?: number[];
    address?: string;
    numGrats: number;
    startDate?: string;
    postDate: string;
    timeOffset: string;
    details?: string;
    images: string[];
    comments: string[];
    numComments: number;
  }

  const resourceToPost = (data: PostResource) =>
    ({
      ...data,
      startDate: data.startDate ? DateTime.fromISO(data.startDate) : undefined,
      postDate: DateTime.fromISO(data.postDate),
    } as Post);

  const featureToPost = (feature: GeoJSON.Feature) => {
    const properties = feature.properties as PostResource;
    LOG.debug("featureToPost", properties);
    return {
      ..._.omit(
        ["location", "start_date", "end_date", "full_address"],
        resourceToPost(properties)
      ),

      startDate: properties.startDate
        ? DateTime.fromISO(properties.startDate)
        : undefined,
      latitude: (feature.geometry as GeoJSON.Point).coordinates[1],
      longitude: (feature.geometry as GeoJSON.Point).coordinates[0],
      address: properties.address,
    } as Post;
  };

  const postToBody = (data: PostUpdateData) => ({
    ...data,
    startDate: data.startDate?.toISO(),
    timezone: data.startDate ? data.startDate.zoneName : undefined,
  });

  const sendGratis = (postId: string, points: number) =>
    doPost<PostGratis>("/v1/posts/gratis-sharing", { postId, points });

  const createComment = (postId: string, content: string) =>
    doPost<Comment>(
      `/v1/posts/${postId}/comments/create`,
      { content },
      resourceToComment
    );

  const createReplyToComment = (
    postId: string,
    commentId: string,
    content: string
  ) =>
    doPost<Comment>(
      `/v1/posts/${postId}/comments/create`,
      { content, comment_id: commentId },
      resourceToComment
    );

  const listComments = (postId: string) =>
    doPost<Comment[]>(
      `/v1/comments?post_id=${postId}`,
      undefined,
      pagedResourceToComments
    );

  const resourceToComment = (c: any) =>
    ({
      ..._.omit(["reply", "date", "postDate"], c),
      postDate: DateTime.fromISO(c.postDate),
      replies:
        c.reply?.map((r: any) => ({
          ..._.omit(["date", "postDate"], r),
          postDate: DateTime.fromISO(r.postDate),
        })) ?? [],
    } as Comment);

  const reportPost = (postId: string, reason: string) =>
    doPost(`/v3/posts/${postId}/report`, { reason });

  const pagedResourceToComments = (data: any) =>
    data.results.map(resourceToComment);

  return {
    createPost,
    updatePost,
    listPosts,
    listPostsForMap,
    getPost,
    deletePost,
    reportPost,
    createComment,
    listComments,
    sendGratis,
    blockUser,
    createReplyToComment,
    featureToPost,
  };
}
