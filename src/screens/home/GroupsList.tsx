import { useQuery } from "@tanstack/react-query";
import React, { ReactElement, useState } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { Loader } from "~/components/loader";
import { useChapterFilter } from "~/navigation/AppContext";
import { useGroupService } from "~/network/api/services/useGroupService";
import { Group } from "~/types/group";
import { handleApiError } from "~/utils/common";
import { AddGroupView } from "./AddGroupView";
import { GroupCard } from "./GroupCard";
import { createStyleSheet } from "./style";

type GroupsListProps = {
  header?: ReactElement;
};
export const GroupsList = ({ header }: GroupsListProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [isLoading, setLoading] = useState(false);
  const chapterFilter = useChapterFilter();

  const {
    queries: { list: listGroups },
  } = useGroupService();

  const {
    isPending,
    isError,
    data: eventsList,
    error,
  } = useQuery(listGroups({ chapterId: chapterFilter?.id }));
  if (isPending !== isLoading) setLoading(isPending);
  if (isError) handleApiError("Groups", error);

  const renderLocalEvent: ListRenderItem<Group> = ({ item }) => {
    return (
      <View>
        <GroupCard style={styles.listContainer} group={item} />
      </View>
    );
  };

  return (
    <View>
      <Loader visible={isLoading} showOverlay />
      <AddGroupView />
      <FlatList
        renderItem={renderLocalEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollView}
        data={eventsList}
      />

      {!isLoading && eventsList?.length === 0 ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>{strings.noGroupsFound}</Text>
        </View>
      ) : null}
    </View>
  );
};
