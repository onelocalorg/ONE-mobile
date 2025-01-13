import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useMyUserId } from "~/navigation/AuthContext";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { GroupMutations } from "~/network/api/services/useGroupService";
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

  // TODO Figure out a better way to have the current user always available
  const myUserId = useMyUserId();
  const {
    queries: { detail: getUser },
  } = useUserService();
  const { data: myProfile } = useQuery(getUser(myUserId));

  const mutateCreateGroup = useMutation<Group, Error, GroupData>({
    mutationKey: [GroupMutations.createGroup],
    onSuccess: () => {
      navigation.goBack();
    },
  });

  return (
    <ScrollView>
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
