/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { GroupCard } from "~/components/groups/GroupCard";
import { Loader } from "~/components/loader";
import { useChapterFilter } from "~/navigation/AppContext";
import { useMyUserId } from "~/navigation/AuthContext";
import { useGroupService } from "~/network/api/services/useGroupService";
import { Group } from "~/types/group";
import { handleApiError } from "~/utils/common";
import { Box } from "../ui/box";
import { AddGroupView } from "./AddGroupView";
import { createStyleSheet } from "./style";

interface GroupListProps {
  placeholder?: string;
  parent?: Group;
}
export const GroupList = ({ placeholder, parent }: GroupListProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() + 1);
  const [isLoading, setLoading] = useState(false);
  const chapterFilter = useChapterFilter();
  const myId = useMyUserId();

  const isAdmin = parent && parent.admins?.find((a) => a.id === myId);
  const isEditor =
    isAdmin || (parent && parent.editors?.find((a) => a.id === myId));
  const isMember =
    isEditor || (parent && parent.members?.find((a) => a.id === myId));

  const {
    queries: { list: listGroups },
  } = useGroupService();

  const {
    isPending,
    isError,
    data: groupsList,
    error,
  } = useQuery(
    listGroups({
      chapterId: chapterFilter?.id,
      parentId: parent?.id || null,
    })
  );
  if (isPending !== isLoading) setLoading(isPending);
  if (isError) handleApiError("Groups", error);

  const renderLocalGroup: ListRenderItem<Group> = ({ item }) => {
    return (
      <Box className="mx-4 my-2">
        <GroupCard style={styles.listContainer} group={item} />
      </Box>
    );
  };

  return (
    <View>
      <Loader visible={isLoading} showOverlay />
      {isEditor && <AddGroupView placeholder={placeholder} parent={parent} />}
      <FlatList
        renderItem={renderLocalGroup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollView}
        data={groupsList}
      />

      {!isLoading && groupsList?.length === 0 ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.noGroupLbl}>{strings.noGroupsFound}</Text>
        </View>
      ) : null}
    </View>
  );
};
