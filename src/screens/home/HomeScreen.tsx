import notifee, { EventType } from "@notifee/react-native";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";

import { Notification } from "@notifee/react-native";
import { useNavigations } from "~/app-hooks/useNavigations";
import {
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
  const { gotoPostDetails } = useNavigations();

  // Subscribe to events
  useEffect(() => {
    const handleNotificationPress = (notification: Notification) => {
      const data = notification?.data;
      if (data) {
        const post = data["post"] as string;
        const parent = data["parent"] as string;
        console.log("post", post);
        console.log("parent", parent);
        gotoPostDetails(post)();
      }
    };

    return notifee.onForegroundEvent(({ type, detail }) => {
      const { notification } = detail;

      switch (type) {
        case EventType.DISMISSED:
          console.log("User dismissed notification", notification);
          break;
        case EventType.PRESS:
          console.log("User pressed notification", notification);
          if (notification) {
            handleNotificationPress(notification);
          }
          break;
      }
    });
  }, [gotoPostDetails]);

  const {
    queries: { list: listUsers },
  } = useUserService();

  const { isLoading, data: userList } = useQuery(
    listUsers({ sort: GetUsersSort.Join, limit: 50, picsOnly: true })
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
