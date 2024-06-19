import { useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import React from "react";
import { View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { useMyUserId } from "~/navigation/AuthContext";
import { HomeStackScreenProps, Screens } from "~/navigation/types";
import {
  GetUsersSort,
  useUserService,
} from "~/network/api/services/useUserService";
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
  const myUserId = useMyUserId();
  const { gotoUserProfile } = useNavigations();

  const {
    queries: { list: listUsers },
  } = useUserService();

  const {
    isError,
    data: userList,
    error,
  } = useQuery(listUsers({ sort: GetUsersSort.joinDate }));
  if (isError) handleApiError("Recent users", error);

  const withoutProfilePic = _.reject((u: OneUser) =>
    u.pic?.includes("defaultUser.jpg")
  );

  const showGiveGratisModal = (post: Post) => {
    navigation.push(Screens.GIVE_GRATIS_MODAL, { postId: post.id });
  };

  const navigateToCreatePost = () => {
    navigation.navigate(Screens.CREATE_EDIT_POST);
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
    navigation.push(Screens.POST_CONTEXT_MENU_MODAL, {
      id: post.id,
      isMine: myUserId == post.author.id,
    });

  return (
    <>
      <View style={styles.MainPostContainer}>
        <PostsList
          header={
            <>
              {userList ? (
                <RecentUsers
                  users={withoutProfilePic(userList)}
                  onPress={gotoUserProfile}
                />
              ) : null}
              <AddPostView onPress={navigateToCreatePost} />
            </>
          }
          onContextMenuPress={showContextMenu}
          onGiveGratisPress={showGiveGratisModal}
          onPostPress={handlePostPress}
          onAvatarPress={navigateToProfile}
        />
      </View>
    </>
  );
};
