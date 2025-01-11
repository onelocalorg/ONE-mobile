import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { Loader } from "~/components/loader";
import { useMyUserId } from "~/navigation/AuthContext";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  GroupMutations,
  useGroupService,
} from "~/network/api/services/useGroupService";
import { useUserService } from "~/network/api/services/useUserService";
import { Group, GroupUpdateData } from "~/types/group";
import { GroupEditor } from "./GroupEditor";
import { createStyleSheet } from "./style";

export const EditGroupScreen = ({
  route,
}: RootStackScreenProps<Screens.EDIT_GROUP>) => {
  const groupId = route.params.id;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const {
    queries: { detail: getGroup },
  } = useGroupService();

  const { data: group, isPending, isLoading } = useQuery(getGroup(groupId));

  // TODO Figure out a better way to have the current user always available
  const myUserId = useMyUserId();
  const {
    queries: { detail: getUser },
  } = useUserService();
  const { data: myProfile } = useQuery(getUser(myUserId));

  const mutateEditGroup = useMutation<Group, Error, GroupUpdateData>({
    mutationKey: [GroupMutations.editGroup],
  });

  return (
    <>
      <Loader visible={!!group && isPending} />
      <View>
        <View style={styles.groupClass}>
          {myProfile ? (
            <GroupEditor
              group={group}
              onSubmitUpdate={mutateEditGroup.mutate}
              isLoading={isLoading}
              myProfile={myProfile}
            />
          ) : null}
        </View>
      </View>
    </>
  );
};
