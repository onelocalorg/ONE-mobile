import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { ScrollView, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useMyUserId } from "~/navigation/AuthContext";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  GroupMutations,
  useGroupService,
} from "~/network/api/services/useGroupService";
import { useUserService } from "~/network/api/services/useUserService";
import { Group, GroupData } from "~/types/group";
import { GroupEditor } from "./GroupEditor";
import { createStyleSheet } from "./style";

export const CreateGroupScreen = ({
  route,
}: RootStackScreenProps<Screens.CREATE_GROUP>) => {
  const parentId = route.params?.parentId;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  // TODO Figure out a better way to have the current user always available
  const myUserId = useMyUserId();
  const {
    queries: { detail: getUser },
  } = useUserService();
  const { data: myProfile } = useQuery(getUser(myUserId));

  const { queries: groupQueries } = useGroupService();

  const mutateCreateGroup = useMutation<Group, Error, GroupData>({
    mutationKey: [GroupMutations.createGroup],
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: groupQueries.lists(),
        })
        .then(() => navigation.goBack());
    },
  });

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.groupClass}>
        {myProfile && (
          <GroupEditor
            onSubmitCreate={(data) =>
              mutateCreateGroup.mutate({ ...data, parentId })
            }
            isLoading={false}
            myProfile={myProfile}
          />
        )}
      </View>
    </ScrollView>
  );
};
