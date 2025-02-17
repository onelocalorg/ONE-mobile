import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect } from "react";
import { AppContext } from "~/navigation/AppContext";
import { useUserService } from "~/network/api/services/useUserService";
import { OneAvatar } from "./OneAvatar";

type MyAvatarProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | undefined;
};
export const MyAvatar = ({ className, size = "sm" }: MyAvatarProps) => {
  const { chapterFilter, setChapterFilter } = useContext(AppContext)!;

  const {
    queries: { me: getMe },
  } = useUserService();
  const { data: myProfile } = useQuery(getMe());

  useEffect(() => {
    // TODO Set the chapterFilter to null if the homeChapter is null. However
    // the current API returns undefined if the homeChapter is not set, so
    // this is not possible yet.
    if (chapterFilter === undefined && myProfile?.homeChapter !== undefined) {
      setChapterFilter(myProfile?.homeChapter);
    }
  }, [myProfile?.homeChapter, chapterFilter, setChapterFilter]);

  return (
    <>
      {myProfile && (
        <OneAvatar user={myProfile} className={className} size={size} />
      )}
    </>
  );
};
