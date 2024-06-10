import { apiConstants } from "~/network/constant";
import { getApiResponse } from "~/network/utils/get-api-response";
import { RecentlyJoined } from "~/types/recently-joined";
import { RemoteImage } from "~/types/remote-image";
import { UploadKey } from "~/types/upload-key";
import { UserProfile } from "~/types/user-profile";
import { UserProfileData } from "~/types/user-profile-data";
import { API } from "..";
import { doDelete, doGet, doPatch, doPost, doPostList } from "./api-service";

export const getUserProfile = (userId: string) =>
  doGet<UserProfile>(`/v1/users/${userId}/profile`);

export const updateUserProfile = (userId: string, data: UserProfileData) =>
  doPatch<UserProfile>(`/v1/users/${userId}/profile`, data);

export const deleteUser = (userId: string) =>
  doDelete<never>(`/v1/users/${userId}`);

export const getRecentlyJoined = () =>
  doPostList<RecentlyJoined>("/v1/users/recently-joined");

export const uploadFile = (
  uploadKey: UploadKey,
  name: string,
  type: string,
  base64: string
) =>
  doPost<RemoteImage>("/v1/users/upload/file", {
    uploadKey: uploadKey.toString(),
    imageName: name,
    base64String: `data:${type};base64,${base64}`,
  });

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
