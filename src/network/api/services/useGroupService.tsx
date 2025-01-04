import { queryOptions, useQueryClient } from "@tanstack/react-query";
import _ from "lodash/fp";
import { Group, GroupData, GroupUpdateData } from "~/types/group";
import { useApiService } from "./ApiService";

export enum GroupMutations {
  createGroup = "createGroup",
  editGroup = "editGroup",
}

export function useGroupService() {
  const queryClient = useQueryClient();

  const queries = {
    all: () => ["groups"],
    lists: () => [...queries.all(), "list"],
    list: (filters?: GetGroupsParams) =>
      queryOptions({
        queryKey: [...queries.lists(), filters],
        queryFn: () => getGroups(filters),
      }),
    details: () => [...queries.all(), "detail"],
    detail: (id?: string) =>
      queryOptions({
        queryKey: [...queries.details(), id],
        queryFn: () => getGroup(id!),
        enabled: !!id,
        staleTime: 5000,
      }),
  };

  queryClient.setMutationDefaults([GroupMutations.createGroup], {
    mutationFn: (data: GroupData) => {
      return createGroup(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queries.lists(),
      });
    },
  });
  queryClient.setMutationDefaults([GroupMutations.editGroup], {
    mutationFn: (params: GroupUpdateData) => {
      return updateGroup(params);
    },
    onSuccess: (resp: Group) => {
      void queryClient.invalidateQueries({
        queryKey: queries.detail(resp.id).queryKey,
      });

      // TODO Change cache to invalidate less
      void queryClient.invalidateQueries({ queryKey: queries.lists() });
    },
  });

  const { doGet, doPost, doPatch } = useApiService();

  const getGroup = (id: string) => doGet<Group>(`/v3/groups/${id}`);

  type GetGroupsParams = {
    chapterId?: string;
  };
  const getGroups = ({ chapterId }: GetGroupsParams | undefined = {}) => {
    const urlParams: string[] = [];
    if (!_.isNil(chapterId)) urlParams.push(`chapter=${chapterId}`);
    const urlSearchParams = urlParams.join("&");

    return doGet<Group[]>(`/v3/groups?${urlSearchParams}`);
  };

  const createGroup = (data: GroupData) => doPost(`/v3/groups/`, data);

  const updateGroup = (data: GroupUpdateData) =>
    doPatch<Group>(`/v3/groups/${data.id}`, _.omit(["id"], data));

  return {
    queries,
    getGroup,
    getGroups,
  };
}
