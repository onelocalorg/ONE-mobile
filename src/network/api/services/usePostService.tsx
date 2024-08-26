import {
  infiniteQueryOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import _ from "lodash/fp";
import { Duration } from "luxon";
import { Gratis } from "~/types/gratis";
import { Post, PostData, PostDetail, PostUpdateData } from "~/types/post";
import { Reply } from "~/types/reply";
import { Report } from "~/types/report";
import { useApiService } from "./ApiService";
import { useUserService } from "./useUserService";

export enum PostMutations {
  createPost = "createPost",
  editPost = "editPost",
  deletePost = "deletePost",
  createReply = "createReply",
  deleteReply = "deleteReply",
  giveGrats = "giveGrats",
  reportPost = "reportPost",
}

export function usePostService() {
  const queryClient = useQueryClient();
  const { queries: userQueries } = useUserService();

  const queries = {
    all: () => ["posts"],
    lists: () => [...queries.all(), "lists"],
    list: (filters?: GetPostsParams) =>
      queryOptions({
        queryKey: [...queries.lists(), filters],
        queryFn: () => getPosts(filters),
      }),
    infiniteList: (filters?: GetPostsParams) =>
      infiniteQueryOptions({
        queryKey: [...queries.lists(), filters],
        queryFn: ({ pageParam }) =>
          getPosts({
            ...filters,
            from: pageParam !== "" ? pageParam : undefined,
          }),
        initialPageParam: "",
        getNextPageParam: (lastPage) =>
          lastPage.length > 0 ? lastPage[lastPage.length - 1].id : undefined,
      }),
    details: () => [...queries.all(), "details"],
    detail: (id?: string) =>
      queryOptions({
        queryKey: [...queries.details(), id],
        queryFn: () => getPost(id!),
        enabled: !!id,
        staleTime: 5000,
      }),
  };

  queryClient.setMutationDefaults([PostMutations.createPost], {
    mutationFn: (eventData: PostData) => {
      return createPost(eventData);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queries.lists() });
    },
  });

  queryClient.setMutationDefaults([PostMutations.editPost], {
    mutationFn: (params: PostUpdateData) => {
      return updatePost(params);
    },
    onSuccess: (data: PostDetail) => {
      void queryClient.invalidateQueries({ queryKey: queries.lists() });
      void queryClient.invalidateQueries({
        queryKey: queries.detail(data.id).queryKey,
      });
    },
  });

  queryClient.setMutationDefaults([PostMutations.deletePost], {
    mutationFn: (postId: string) => {
      return deletePost(postId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queries.lists() });
    },
  });

  queryClient.setMutationDefaults([PostMutations.createReply], {
    mutationFn: (params: CreateReplyProps) => {
      return createReply(params);
    },
    onSuccess: (data: Reply) => {
      void queryClient.invalidateQueries({ queryKey: queries.lists() });
      void queryClient.invalidateQueries({
        queryKey: queries.detail(data.post).queryKey,
      });
    },
  });

  queryClient.setMutationDefaults([PostMutations.deleteReply], {
    mutationFn: (params: DeleteReplyProps) => {
      return deleteReply(params);
    },
    onSuccess: (_, vars: DeleteReplyProps) => {
      void queryClient.invalidateQueries({ queryKey: queries.lists() });
      void queryClient.invalidateQueries({
        queryKey: queries.detail(vars.postId).queryKey,
      });
    },
  });

  queryClient.setMutationDefaults([PostMutations.giveGrats], {
    mutationFn: (props: SendGratisProps) => {
      return sendGratis(props);
    },
    onSuccess: (resp: Gratis) => {
      void queryClient.invalidateQueries({
        queryKey: queries.detail(resp.post).queryKey,
      });
      if (!resp.reply) {
        void queryClient.invalidateQueries({ queryKey: queries.lists() });
      }

      void queryClient.invalidateQueries({
        queryKey: userQueries.detail(resp.sender).queryKey,
      });
    },
  });

  queryClient.setMutationDefaults([PostMutations.reportPost], {
    mutationFn: (params: ReportPostParams) => {
      return reportPost(params);
    },
  });

  const { doPost, doPatch, doGet, doDelete } = useApiService();

  async function createPost(data: PostData) {
    return doPost<PostDetail>("/v3/posts", data);
  }

  async function updatePost(data: PostUpdateData) {
    return doPatch<PostDetail>(`/v3/posts/${data.id}`, _.omit(["id"], data));
  }

  const getPost = (id: string) => doGet<PostDetail>(`/v3/posts/${id}`);

  const deletePost = (id: string) => doDelete<never>(`/v3/posts/${id}`);

  type GetPostsParams = {
    numPosts?: number;
    isPast?: boolean;
    from?: string;
    age?: Duration; //max age of posts returned
  };
  const getPosts = ({
    numPosts = 20,
    isPast,
    from,
    age,
  }: GetPostsParams | undefined = {}) => {
    const urlParams: string[] = [];
    if (!_.isNil(isPast)) urlParams.push(`past=${isPast.toString()}`);
    if (!_.isNil(numPosts)) urlParams.push(`limit=${numPosts.toString()}`);
    if (!_.isNil(from)) urlParams.push(`from=${from}`);
    if (!_.isNil(age)) urlParams.push(`age=${age.toISO()}`);

    const urlSearchParams = urlParams.join("&");

    return doGet<Post[]>(`/v3/posts?${urlSearchParams.toString()}`);
  };

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

  const deleteReply = ({ postId, replyId }: DeleteReplyProps) =>
    doDelete<never>(`/v3/posts/${postId}/replies/${replyId}`);

  const reportPost = ({ postId, reason }: ReportPostParams) =>
    doPost<Report>(`/v3/posts/${postId}/reports`, { reason });

  return {
    queries,
  };
}

export interface SendGratisProps {
  postId: string;
  replyId?: string;
  points: number;
}

export interface CreateReplyProps {
  postId: string;
  parentId?: string;
  content: string;
}

export interface DeleteReplyProps {
  postId: string;
  replyId: string;
}

export interface ReportPostParams {
  postId: string;
  reason: string;
}
