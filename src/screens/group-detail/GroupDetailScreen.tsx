/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { useNavigations } from "~/app-hooks/useNavigations";
import { ChapterListHorizontal } from "~/components/chapter-list-horizontal";
import { EventList } from "~/components/events/EventList";
import { GroupList } from "~/components/groups/GroupList";
import { Loader } from "~/components/loader";
import { TabComponent } from "~/components/tab-component";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "~/components/ui/avatar";
import { Box } from "~/components/ui/box";
import { Button, ButtonText } from "~/components/ui/button";
import { Grid, GridItem } from "~/components/ui/grid";
import { Heading } from "~/components/ui/heading";
import { HStack } from "~/components/ui/hstack";
import { Text } from "~/components/ui/text";
import { VStack } from "~/components/ui/vstack";
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
      <ScrollView>
        <Box>
          {group ? (
            <>
              <HStack space="md" className="flex m-3">
                <Avatar size="2xl">
                  <AvatarFallbackText>{group.name}</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: _.head(group.images)?.url,
                    }}
                    alt="Profile image"
                  />
                </Avatar>
                {/* FIXME Replace this right margin hack with proper sizing */}
                <VStack className="pr-8 mr-24">
                  <Heading size="lg">{group.name}</Heading>
                  <Text isTruncated={true}>{group.summary}</Text>
                </VStack>
              </HStack>

              <Grid
                _extra={{
                  className: "grid-cols-2",
                }}
              >
                <GridItem
                  _extra={{
                    className: "col-span-1",
                  }}
                >
                  <ChapterListHorizontal chapters={group.chapters} />
                  {/* </Box> */}
                </GridItem>
                <GridItem
                  _extra={{
                    className: "col-span-1",
                  }}
                  className="pr-6"
                >
                  {isEditor || isAdmin ? (
                    <Button
                      className="mh-6 bg-purple-300"
                      onPress={() => gotoEditGroup(groupId)}
                    >
                      <ButtonText>Edit</ButtonText>
                    </Button>
                  ) : isMember ? (
                    <Button
                      className="mh-6 bg-purple-300"
                      onPress={handleLeaveGroup}
                    >
                      <ButtonText>Leave</ButtonText>
                    </Button>
                  ) : (
                    <Button
                      className="mh-6 bg-purple-300"
                      onPress={handleJoinGroup}
                    >
                      <ButtonText>Join</ButtonText>
                    </Button>
                  )}
                </GridItem>
              </Grid>

              <View style={styles.line} />
              <TabComponent tabs={tabs} onPressTab={setSelectedTab} />
              {navigation ? (
                <>
                  {selectedTab === 0 && (
                    <>
                      <AboutGroup group={group} />
                      {isAdmin && (
                        <Button
                          className="mt-4 mb-4 w-36 ml-8 bg-red-600"
                          onPress={confirmDeleteGroup}
                        >
                          <ButtonText>Delete</ButtonText>
                        </Button>
                      )}
                    </>
                  )}
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
                    <EventList
                      group={group}
                      placeholder={strings.createEvent}
                    />
                  )}
                  {selectedTab === 3 && (
                    <GroupList
                      parent={group}
                      placeholder={strings.createSubgroup}
                    />
                  )}
                </>
              ) : null}
            </>
          ) : null}
        </Box>
      </ScrollView>
    </>
  );
};
