import _ from "lodash/fp";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { HomeStackScreenProps, Screens } from "~/navigation/types";
import { getRecentlyJoined } from "~/network/api/services/user-service";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";
import { handleApiError } from "~/utils/common";
import { AddPostView } from "./AddPostView";
import { RecentUsers } from "./HorizontalAvatarView";
import { PostsList } from "./PostsList";
import { createStyleSheet } from "./style";

export const HomeScreen = ({
  navigation,
}: HomeStackScreenProps<Screens.HOME_SCREEN>) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [userList, setUserList] = useState<OneUser[]>([]);

  useEffect(() => {
    async function fetchRecentlyJoinedUsers() {
      try {
        const recentlyJoined = await getRecentlyJoined();
        setUserList(
          _.reject(
            (u: OneUser) => u.pic?.includes("defaultUser.jpg"),
            recentlyJoined
          )
        );
      } catch (error) {
        handleApiError("Error loading recent users", error);
      }
    }

    fetchRecentlyJoinedUsers();
  }, []);

  const navigateToUserProfile = (user: OneUser) => {
    navigation.push(Screens.USER_PROFILE, { id: user.id });
  };

  const showGiveGratsModal = (post: Post) => {
    navigation.push(Screens.GIVE_GRATS_MODAL, { postId: post.id });
  };

  const navigateToCreatePost = () => {
    navigation.navigate(Screens.CREATE_POST);
  };

  const handlePostPress = (item: Post) => {
    navigation.push(Screens.POST_DETAIL, {
      id: item.id,
    });
  };

  const navigateToProfile = (user: OneUser) => {
    navigation.push(Screens.USER_PROFILE, {
      id: user.id,
    });
  };

  const showContextMenu = (post: Post) =>
    navigation.push(Screens.POST_CONTEXT_MENU_MODAL, { id: post.id });

  return (
    <>
      <View style={styles.MainPostContainer}>
        <PostsList
          header={
            <>
              <RecentUsers users={userList} onPress={navigateToUserProfile} />
              <AddPostView onPress={navigateToCreatePost} />
            </>
          }
          onContextMenuPress={showContextMenu}
          onGiveGratsPress={showGiveGratsModal}
          onPostPress={handlePostPress}
          onAvatarPress={navigateToProfile}
        />
      </View>
    </>
  );
};
