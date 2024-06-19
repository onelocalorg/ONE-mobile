import { OneUser } from "~/types/one-user";
import { UserProfile, UserProfileUpdateData } from "~/types/user-profile";

import { queryOptions } from "@tanstack/react-query";
import { RemoteImage } from "~/types/remote-image";
import { UploadKey } from "~/types/upload-key";
import { useApiService } from "./ApiService";

export enum GetUsersSort {
  joinDate = "joinDate",
}

export function useUserService() {
  const queries = {
    all: () => ["users"],
    lists: () => [...queries.all(), "list"],
    list: (filters?: GetUsersParams) =>
      queryOptions({
        queryKey: [...queries.lists(), filters],
        queryFn: () => getUsers(filters),
      }),
    details: () => [...queries.all(), "detail"],
    detail: (id?: string) =>
      queryOptions({
        queryKey: [...queries.details(), id],
        queryFn: () => getUser(id!),
        enabled: !!id,
        staleTime: 5000,
      }),
  };

  const { doDelete, doGet, doPatch, doPost } = useApiService();

  const getUser = (userId: string) => doGet<UserProfile>(`/v3/users/${userId}`);

  const updateUserProfile = (userId: string, data: UserProfileUpdateData) =>
    doPatch<UserProfile>(`/v3/users/${userId}`, data);

  const deleteUser = (userId: string) => doDelete<never>(`/v3/users/${userId}`);

  interface GetUsersParams {
    sort?: GetUsersSort;
  }
  const getUsers = ({ sort }: GetUsersParams | undefined = {}) =>
    doGet<OneUser[]>(`/v3/users?${sort ? `sort=${sort}` : ""}`);

  const uploadFile = (
    uploadKey: UploadKey,
    name: string,
    type: string,
    base64: string
  ) =>
    doPost<RemoteImage>("/v3/users/upload/file", {
      uploadKey: uploadKey.toString(),
      imageName: name,
      base64String: `data:${type};base64,${base64}`,
    });

  const updateUser = async (props: UserProfileUpdateData) =>
    doPatch<UserProfile>(`/v3/users/${props.id}`);

  return {
    queries,
    getUsers,
    getUser,
    updateUserProfile,
    deleteUser,
    updateUser,
    uploadFile,
    GetUsersSort,
  };
}
