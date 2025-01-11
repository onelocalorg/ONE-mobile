import { useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import React from "react";
import { View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { GroupList } from "~/components/groups/GroupList";
import {
  ChapterFilter,
  GetUsersSort,
  useUserService,
} from "~/network/api/services/useUserService";
import { OneUser } from "~/types/one-user";
import { AddPostView } from "./AddPostView";
import { HomeScreenTypeChooser } from "./HomeScreenTypeChooser";
import { PostsList } from "./PostsList";
import { RecentUsers } from "./RecentUsers";
import { createStyleSheet } from "./style";

export const HomeScreen = () => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [isGroupsChosen, setGroupsChosen] = React.useState(false);

  const {
    queries: { list: listUsers },
  } = useUserService();

  const { isLoading, data: userList } = useQuery(
    listUsers({
      sort: GetUsersSort.Join,
      limit: 50,
      picsOnly: true,
      chapter: ChapterFilter.Same,
    })
  );

  const withoutProfilePic = _.reject(
    (u: OneUser) => !u.pic || u.pic.includes("defaultUser.jpg")
  );

  return (
    <>
      <View style={styles.MainPostContainer}>
        <HomeScreenTypeChooser onGroupsChosen={setGroupsChosen} />

        {!isLoading ? (
          isGroupsChosen ? (
            <GroupList />
          ) : (
            <PostsList
              header={
                <>
                  {userList ? (
                    <RecentUsers users={withoutProfilePic(userList)} />
                  ) : null}
                  <AddPostView />
                </>
              }
            />
          )
        ) : null}
      </View>
    </>
  );
};
