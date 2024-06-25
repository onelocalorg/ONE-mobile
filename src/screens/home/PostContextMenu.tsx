import { useMutation } from "@tanstack/react-query";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ShortModal } from "~/components/ShortModal";
import { useMyUserId } from "~/navigation/AuthContext";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { PostMutations } from "~/network/api/services/usePostService";
import { UserMutations } from "~/network/api/services/useUserService";
import { Block } from "~/types/block";
import { createStyleSheet } from "./style";

export const PostContextMenu = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.POST_CONTEXT_MENU_MODAL>) => {
  const postId = route.params.postId;
  const authorId = route.params.authorId;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const myId = useMyUserId();

  const mutateBlockUser = useMutation<Block, Error, string>({
    mutationKey: [UserMutations.blockUser],
  });
  const mutateDeletePost = useMutation<never, Error, string>({
    mutationKey: [PostMutations.deletePost],
  });

  const confirmBlockUser = () => {
    Alert.alert(strings.blockUser, strings.blockUserConfirm, [
      { text: strings.no, onPress: () => null, style: "destructive" },
      {
        text: strings.yes,

        onPress: () => {
          mutateBlockUser.mutate(authorId, {
            onSuccess: () => {
              navigation.popToTop();
            },
          });
        },
      },
    ]);
  };

  const confirmDeletePost = () => {
    Alert.alert(strings.deletePost, strings.deletePostConfirm, [
      { text: strings.no, onPress: () => null, style: "destructive" },
      {
        text: strings.yes,

        onPress: () => {
          mutateDeletePost.mutate(postId, {
            onSuccess: () => {
              navigation.popToTop();
            },
          });
        },
      },
    ]);
  };

  const handleReportContent = () => {
    navigation.popToTop();
    navigation.navigate(Screens.REPORT_CONTENT_MODAL, { postId });
  };

  const navigateToEditPost = () => {
    navigation.popToTop();
    navigation.navigate(Screens.CREATE_EDIT_POST, { id: postId });
  };

  return (
    <ShortModal height={200}>
      <View style={styles.postActionSheet}>
        {myId === authorId ? (
          <>
            <TouchableOpacity onPress={navigateToEditPost}>
              <Text style={[styles.postText, { color: "white" }]}>
                {strings.editPost}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmDeletePost}>
              <Text style={[styles.postText, { color: "white" }]}>
                {strings.deletePost}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={confirmBlockUser}>
              <Text style={[styles.postText, { color: "white" }]}>
                {strings.blockUser}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReportContent}>
              <Text style={[styles.postText, { color: "white" }]}>
                {strings.reportContent}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ShortModal>
  );
};
