import { useQuery } from "@tanstack/react-query";
import {
  UserProfileProps,
  onGetUserProfile,
} from "~/network/api/services/user-service";
import { apiKeys } from "~/network/constant";

interface Root {
  bio: string;
  first_name: string;
  last_name: string;
  pic: string;
  status: string;
  user_type: string;
  about: string;
  skills: string[];
  is_active_subscription: boolean;
  isEventActiveSubscription: boolean;
  cover_image: string;
  eventProducerPackageId: string;
}

interface ParsedData {
  bio: string;
  name: string;
  pic: string;
  status: string;
  about: string;
  skills: string[];
  userType: string;
  isActiveSubscription: boolean;
  eventProducerID: string;
  coverImage: string;
}

export const userProfileParsedData = (data: Root) => {
  // LOG.debug("> userProfileParsedData");
  const val = {
    ...data,
    name: `${data?.first_name} ${data?.last_name}`,
    userType: data?.user_type,
    isActiveSubscription: data?.isEventActiveSubscription,
    eventProducerID: data?.eventProducerPackageId,
    coverImage: data?.cover_image,
  } as ParsedData;
  // LOG.debug("< userProfileParsedData", val);
  return val;
};

export const useUserProfile = (props: UserProfileProps) => {
  const query = useQuery([apiKeys.userProfile], () => onGetUserProfile(props), {
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  return { ...query, data: userProfileParsedData(query?.data?.data) };
};
