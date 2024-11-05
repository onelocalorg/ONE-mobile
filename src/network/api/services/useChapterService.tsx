import { queryOptions, useQueryClient } from "@tanstack/react-query";
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
    list: () =>
      queryOptions({
        queryKey: [...queries.lists()],
        queryFn: () => getChapters(),
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
    },
  });
  const { doGet, doPost } = useApiService();

  const getChapters = () => {
    return doGet<Chapter[]>(`/v3/chapters`);
  };

  const joinChapter = (chapterId: string) =>
    doPost(`/v3/chapters/${chapterId}/join`);

  return {
    queries,
  };
}
