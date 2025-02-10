import { createContext, useContext } from "react";
import { ChapterData } from "~/types/chapter";

type AppContextType = {
  chapterFilter: ChapterData | null;
  setChapterFilter: (chapter: ChapterData | null) => void;
};

export const AppContext = createContext<AppContextType | null>(null);

export function useChapterFilter() {
  return useContext(AppContext)?.chapterFilter;
}
