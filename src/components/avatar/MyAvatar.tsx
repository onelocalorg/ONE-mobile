import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useUserService } from "~/network/api/services/useUserService";
import { OneAvatar } from "./OneAvatar";

type MyAvatarProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | undefined;
};
export const MyAvatar = ({ className, size = "sm" }: MyAvatarProps) => {
  const {
    queries: { me: getMe },
  } = useUserService();
  const { data: myProfile } = useQuery(getMe());

  return <OneAvatar user={myProfile} className={className} size={size} />;
};
