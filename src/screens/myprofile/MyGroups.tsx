/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { GroupCard } from "~/components/groups/GroupCard";
import { Loader } from "~/components/loader";
import { useGroupService } from "~/network/api/services/useGroupService";
import { Group } from "~/types/group";
import { LocalEvent } from "~/types/local-event";
import { UserProfile } from "~/types/user-profile";
import { handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";

interface MyGroupsProps {
  user?: UserProfile;
  onEventPress?: (event: LocalEvent) => void;
}

export const MyGroups = ({ user }: MyGroupsProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [isLoading, setLoading] = useState(false);

  const {
    queries: { list: listGroups },
  } = useGroupService();

  const {
    isPending,
    isError,
    data: groups,
    error,
  } = useQuery(listGroups({ userId: user?.id }));
  if (isPending !== isLoading) setLoading(isPending);
  if (isError) handleApiError("My groups", error);

  const renderItem: ListRenderItem<Group> = ({ item }) => {
    return <GroupCard key={item.id} group={item} />;
  };

  return (
    <View>
      <Loader containerStyle={styles.loader} visible={isLoading} />
      <FlatList
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.scrollViewEvent}
        data={groups}
        initialNumToRender={10}
        onEndReached={() => {
          if (isLoading) {
            setLoading(false);
          }
        }}
        onEndReachedThreshold={0.8}
      ></FlatList>
      {!groups ? (
        <Text style={styles.noMoreTitle}>{strings.noGroupsFound}</Text>
      ) : (
        <></>
      )}
    </View>
  );
};
