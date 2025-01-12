/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { useNavigations } from "~/app-hooks/useNavigations";
import { dummy } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { ChapterListHorizontal } from "~/components/chapter-list-horizontal";
import { EventList } from "~/components/events/EventList";
import { GroupList } from "~/components/groups/GroupList";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { TabComponent } from "~/components/tab-component";
import { useMyUserId } from "~/navigation/AuthContext";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  GroupMutations,
  useGroupService,
} from "~/network/api/services/useGroupService";
import { AddPostView } from "../home/AddPostView";
import { PostsList } from "../home/PostsList";
import { AboutGroup } from "./AboutGroup";
import { createStyleSheet } from "./style";

export const GroupDetailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.GROUP_DETAIL>) => {
  const groupId = route.params.id;
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const [selectedTab, setSelectedTab] = useState(0);
  const { gotoEditGroup } = useNavigations();
  const myId = useMyUserId();

  const {
    queries: { detail: getGroup },
  } = useGroupService();

  const { isPending, data: group } = useQuery(getGroup(groupId));

  const { mutate: joinGroup } = useMutation<void, Error, string>({
    mutationKey: [GroupMutations.joinGroup],
  });
  const { mutate: leaveGroup } = useMutation<void, Error, string>({
    mutationKey: [GroupMutations.leaveGroup],
  });
  const { mutate: deleteGroup } = useMutation<never, Error, string>({
    mutationKey: [GroupMutations.deleteGroup],
  });

  const isEditor = group && group.editors?.find((a) => a.id === myId);
  const isAdmin = group && group.admins?.find((a) => a.id === myId);
  const isMember = group && group.members?.find((a) => a.id === myId);

  const handleJoinGroup = () => {
    joinGroup(groupId);
  };

  const handleLeaveGroup = () => {
    leaveGroup(groupId);
  };

  const handleDeleteGroup = () => {
    // deleteGroup(groupId);
  };

  const tabs = [strings.about, strings.posts, strings.events];
  if (group && !group.parent) {
    tabs.push(strings.groups);
  }

  const confirmDeleteGroup = () => {
    Alert.alert(strings.deleteGroup, strings.deleteGroupConfirm, [
      { text: strings.no, onPress: () => null, style: "destructive" },
      {
        text: strings.yes,

        onPress: () => {
          deleteGroup(groupId, {
            onSuccess: () => {
              navigation.goBack();
            },
          });
        },
      },
    ]);
  };

  return (
    <>
      <Loader visible={isPending} />
      <View style={styles.container}>
        {group ? (
          <>
            <View style={styles.rowOnly}>
              <ImageComponent
                isUrl={!!_.head(group.images)?.url}
                resizeMode="cover"
                uri={_.head(group.images)?.url}
                source={dummy}
                style={styles.profile}
              />
              <View style={styles.fullName}>
                <View style={styles.rowOnly}>
                  <Text style={styles.name}>{group.name} </Text>
                </View>
                <Text style={styles.des}>{group.summary}</Text>
              </View>
            </View>

            {group.chapters && (
              <ChapterListHorizontal chapters={group.chapters} />
            )}
            {isEditor || isAdmin ? (
              <ButtonComponent
                title="Edit"
                onPress={() => gotoEditGroup(groupId)}
              />
            ) : isMember ? (
              <ButtonComponent title="Leave" onPress={handleLeaveGroup} />
            ) : (
              <ButtonComponent title="Join" onPress={handleJoinGroup} />
            )}

            <View style={styles.line} />
            <TabComponent tabs={tabs} onPressTab={setSelectedTab} />
            {navigation ? (
              <>
                {selectedTab === 0 && <AboutGroup group={group} />}
                {selectedTab === 1 && (
                  <PostsList
                    group={group}
                    header={
                      <AddPostView
                        placeholder={strings.createPost}
                        group={group}
                      />
                    }
                  />
                )}
                {selectedTab === 2 && (
                  <EventList group={group} placeholder={strings.createEvent} />
                )}
                {selectedTab === 3 && (
                  <GroupList
                    parent={group}
                    placeholder={strings.createSubgroup}
                  />
                )}
              </>
            ) : null}

            {isAdmin && (
              <ButtonComponent title="Delete" onPress={confirmDeleteGroup} />
            )}
          </>
        ) : null}
      </View>
    </>
  );
};
