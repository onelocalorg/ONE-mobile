import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ShortModal } from "~/components/ShortModal";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";

export const PostContextMenu = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.POST_CONTEXT_MENU_MODAL>) => {
  const postId = route.params.id;
  const isMine = route.params.isMine ?? false;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();

  const [isLoading, setLoading] = useState(false);

  const confirmBlockUser = () => {
    Alert.alert(strings.blockUser, strings.blockUserConfirm, [
      { text: strings.no, onPress: () => null, style: "destructive" },
      {
        text: strings.yes,

        onPress: async () => {
          if (isLoading) {
            // Ignore multiple clicks
            return;
          }

          setLoading(true);
          try {
            await blockUser(postId);
            navigation.popToTop();
          } catch (e) {
            handleApiError("Error blocking user", e);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const confirmDeletePost = () => {
    Alert.alert(strings.deletePost, strings.deletePostConfirm, [
      { text: strings.no, onPress: () => null, style: "destructive" },
      {
        text: strings.yes,

        onPress: async () => {
          if (isLoading) {
            // Ignore multiple clicks
            return;
          }

          setLoading(true);
          try {
            await deletePost(postId);
            navigation.popToTop();
          } catch (e) {
            handleApiError("Error deleting post", e);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleReportContent = () => {
    navigation.push(Screens.REPORT_CONTENT_MODAL, { postId: postId });
  };

  const navigateToEditPost = () => {
    navigation.push(Screens.MAIN_TABS, {
      screen: Screens.HOME_STACK,
      params: {
        screen: Screens.EDIT_POST,
        params: { id: postId },
      },
    });
  };

  return (
    <ShortModal height={200}>
      <View style={styles.postActionSheet}>
        {isMine ? (
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
