import { Alert } from "react-native";
import { LOG } from "~/config";
import { apiConstants } from "~/network/constant";
import { getApiResponse } from "~/network/utils/get-api-response";
import { UserProfile } from "~/types/user-profile";
import { UserProfileData } from "~/types/user-profile-data";
import { API } from "..";
import { doGet, doPatch } from "./api-service";

export const getUserProfile = async (userId: string) => {
  const response = await doGet<UserProfile>(`/v1/users/${userId}`);
  if (!response.success) {
    Alert.alert("Failed getting user profile", response.message);
  } else {
    return response.data;
  }
};

export const updateUserProfile = async (
  userId: string,
  data: UserProfileData
) => {
  const response = await doPatch<UserProfile>(`/v1/users/${userId}`, data);
  if (!response.success) {
    Alert.alert("Failed updating user profile", response.message);
  } else {
    return response.data;
  }
};

interface LoginProps {
  emailOrMobile: string;
  password: string;
  loginType: string;
  deviceToken: string;
  version: string;
  deviceInfo: string;
  googleToken: string;
}

export const onLogin = async (props: LoginProps) => {
  let response;
  try {
    const endPoint = apiConstants.login;
    const data = await API.userService.post(endPoint, props);
    LOG.debug("data", data);
    response = getApiResponse(data);
  } catch (error: any) {
    LOG.error("onLogin", error);
    response = getApiResponse(error);
  }

  return response;
};

export interface UserProfileProps {
  userId: string;
}

interface EditProfileProps {
  bodyParams: {
    profile?: string;
    bio?: string;
    about?: string;
    skills?: string[];
    coverImage?: string;
    first_name?: string;
    last_name?: string;
    nick_name?: string;
  };
  userId: string;
}

export const onEditUserProfile = async (props: EditProfileProps) => {
  const { bodyParams, userId } = props || {};
  const {
    skills,
    about,
    bio,
    profile,
    coverImage,
    first_name,
    last_name,
    nick_name,
  } = bodyParams || {};
  let response;
  try {
    const picData = {
      uri: profile,
      type: "jpg",
      name: "profile.jpg",
    };

    const coverImgData = {
      uri: coverImage,
      type: "jpg",
      name: "coverImage.jpg",
    };

    const attachments = {
      pic: JSON.stringify(picData),
      // 'cover_image' : JSON.stringify(coverImgData),
      about: about,
      skills: skills?.toString(),
      bio: bio,
      first_name: first_name,
      last_name: last_name,
      nick_name: nick_name,
    };

    const endPoint = `${apiConstants.editProfile}${userId}`;
    const data = await API.userService.patch(endPoint, attachments, {
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    });
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
    console.log("response=== profile page", response, error);
  }

  return response;
};

export const onGetAppConfig = async () => {
  let response;

  try {
    const endPoint = apiConstants.appConfig;
    const data = await API.userService.get(endPoint);
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};
