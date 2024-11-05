import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { Chapter } from "~/types/chapter";
import { useApiService } from "./ApiService";

export enum ChapterMutations {
  joinChapter = "joinChapter",
}

export function useChapterService() {
  const queryClient = useQueryClient();
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
    mutationFn: (chapter: Chapter) => {
      return joinChapter(chapter);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queries.all() });
    },
  });
  const { doGet, doPost } = useApiService();

  const getChapters = () => {
    return doGet<Chapter[]>(`/v3/chapters`);
  };

  const joinChapter = (chapter: Chapter) =>
    doPost(`/v3/chapters/${chapter.id}`);

  return {
    queries,
  };
}
