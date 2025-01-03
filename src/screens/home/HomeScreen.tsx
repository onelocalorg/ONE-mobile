import { useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import React from "react";
import { View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import {
  ChapterFilter,
  GetUsersSort,
  useUserService,
} from "~/network/api/services/useUserService";
import { OneUser } from "~/types/one-user";
import { AddPostView } from "./AddPostView";
import { RecentUsers } from "./HorizontalAvatarView";
import { PostsList } from "./PostsList";
import { createStyleSheet } from "./style";

export const HomeScreen = () => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const navigations = useNavigations();

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
        {!isLoading && (
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
        )}
      </View>
    </>
  );
};
