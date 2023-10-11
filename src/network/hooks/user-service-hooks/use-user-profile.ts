import {
  UserProfileProps,
  onGetUserProfile,
} from '@network/api/services/user-service';
import {apiKeys} from '@network/constant';
import {useQuery} from '@tanstack/react-query';

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
  cover_image: string;
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
  coverImage: string;
}

export const userProfileParsedData = (data: Root) => {
  return {
    ...data,
    name: `${data?.first_name} ${data?.last_name}`,
    userType: data?.user_type,
    isActiveSubscription: data?.is_active_subscription,
    coverImage: data?.cover_image,
  } as ParsedData;
};

export const useUserProfile = (props: UserProfileProps) => {
  const query = useQuery([apiKeys.userProfile], () => onGetUserProfile(props), {
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  return {...query, data: userProfileParsedData(query?.data?.data)};
};
