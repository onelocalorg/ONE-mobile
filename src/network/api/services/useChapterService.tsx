import { queryOptions, useQueryClient } from "@tanstack/react-query";
import _ from "lodash/fp";
import { useMyUserId } from "~/navigation/AuthContext";
import { Chapter } from "~/types/chapter";
import { useApiService } from "./ApiService";
import { useUserService } from "./useUserService";

export enum ChapterMutations {
  joinChapter = "joinChapter",
}

export function useChapterService() {
  const queryClient = useQueryClient();
  const myUserId = useMyUserId();
  const { queries: userQueries } = useUserService();

  const queries = {
    all: () => ["chapters"],
    lists: () => [...queries.all(), "list"],
    list: (filters?: GetChaptersParams) =>
      queryOptions({
        queryKey: [...queries.lists(), filters],
        queryFn: () => getChapters(filters),
      }),
  };

  queryClient.setMutationDefaults([ChapterMutations.joinChapter], {
    mutationFn: (chapterId: string) => {
      return joinChapter(chapterId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: userQueries.detail(myUserId).queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: userQueries.lists(),
      });
    },
  });
  const { doGet, doPost } = useApiService();

  interface GetChaptersParams {
    search?: string;
  }
  const getChapters = ({ search }: GetChaptersParams | undefined = {}) => {
    const urlParams: string[] = [];
    if (!_.isNil(search) && !_.isEmpty(search))
      urlParams.push(`search=${search.toString()}`);

    const urlSearchParams = urlParams.join("&");

    return doGet<Chapter[]>(`/v3/chapters?${urlSearchParams}`);
  };

  const joinChapter = (chapterId: string) =>
    doPost(`/v3/chapters/${chapterId}/join`);

  return {
    queries,
  };
}
