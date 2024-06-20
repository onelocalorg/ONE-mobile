import { OneUser } from "~/types/one-user";
import { UserProfile, UserProfileUpdateData } from "~/types/user-profile";

import { queryOptions, useQueryClient } from "@tanstack/react-query";
import _ from "lodash/fp";
import { RemoteImage } from "~/types/remote-image";
import { UploadFileData } from "~/types/upload-file-data";
import { useApiService } from "./ApiService";

export enum UserMutations {
  updateUser = "updateUser",
  deleteUser = "deleteUser",
  uploadFile = "uploadFile",
}

export enum GetUsersSort {
  joinDate = "joinDate",
}
export function useUserService() {
  const queryClient = useQueryClient();

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

  queryClient.setMutationDefaults([UserMutations.uploadFile], {
    mutationFn: (data: UploadFileData) => {
      return uploadFile(data);
    },
  });

  queryClient.setMutationDefaults([UserMutations.updateUser], {
    mutationFn: (data: UserProfileUpdateData) => {
      return updateUser(data);
    },
    onSuccess: (data: UserProfile) => {
      void queryClient.invalidateQueries({
        queryKey: queries.detail(data.id).queryKey,
      });
      // FIXME invalidate the post queries, but can't because postService
      // invalidates the user queries when they give gratis
      // void queryClient.invalidateQueries({
      //   queryKey: queries.lists(),
      // });
    },
  });

  queryClient.setMutationDefaults([UserMutations.deleteUser], {
    mutationFn: (data: string) => {
      return deleteUser(data);
    },
  });

  const { doDelete, doGet, doPatch, doPost } = useApiService();

  const getUser = (userId: string) => doGet<UserProfile>(`/v3/users/${userId}`);

  const deleteUser = (userId: string) => doDelete<never>(`/v3/users/${userId}`);

  interface GetUsersParams {
    sort?: GetUsersSort;
  }
  const getUsers = ({ sort }: GetUsersParams | undefined = {}) =>
    doGet<OneUser[]>(`/v3/users?${sort ? `sort=${sort}` : ""}`);

  // eslint-disable-next-line no-empty-pattern
  const uploadFile = (props: UploadFileData) =>
    doPost<RemoteImage>("/v3/users/upload/file", {
      ..._.omit(["base64", "mimeType"], props),
      base64String: `data:${props.mimeType};base64,${props.base64}`,
    });

  const updateUser = (data: UserProfileUpdateData) =>
    doPatch<UserProfile>(`/v3/users/${data.id}`, {
      ..._.omit(["id"], data),
      skills: !_.isEmpty(data.skills) ? data.skills?.join(",") : undefined,
    });

  return {
    queries,
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    uploadFile,
  };
}
