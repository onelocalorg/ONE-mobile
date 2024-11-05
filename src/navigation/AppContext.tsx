import { createContext, useContext } from "react";
import { Chapter } from "~/types/chapter";

type AppContextType = {
  chapterFilter: Chapter | null;
  setChapterFilter: (chapter: Chapter | null) => void;
};

export const AppContext = createContext<AppContextType | null>(null);

export function useChapterFilter() {
  return useContext(AppContext)?.chapterFilter;
}
