import React, { useState } from "react";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { buttonArrowGreen } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { Post } from "~/types/post";
import { PostData } from "~/types/post-data";
import { handleApiError } from "~/utils/common";
import { PostEditor } from "./PostEditor";
import { createStyleSheet } from "./style";

interface PostRequestProps {
  post?: Post;
  onSubmit?: (postData: PostData) => void;
}

export const PostRequest = ({ post, onSubmit }: PostRequestProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [isLoading, setLoading] = useState(false);
  const [postData, setPostData] = useState<PostData | undefined>(post);

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  // useEffect(() => {
  //   LogBox.ignoreAllLogs();
  //   getResourcesAPI();
  // }, []);

  const createOrUpdateRequest = async () => {
    if (!postData?.name) {
      Toast.show("Enter Title", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (!postData.details) {
      Toast.show("Enter Body", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      setLoading(true);
      try {
        if (post) {
          await updatePost(post.id, { ...postData, type: "request" });
        } else {
          await createPost(postData);
        }
        onSubmit?.(postData);
      } catch (e) {
        handleApiError("Failed to save post", e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={keyboardDismiss}
        activeOpacity={1}
        style={styles.createPostModal}
      >
        <View>
          <View style={styles.postClass}>
            <Text style={styles.title}>Ask</Text>
            <PostEditor
              type="request"
              post={postData}
              onLoading={setLoading}
              onFieldsChanged={setPostData}
            />
            <View style={styles.bottomButton}>
              <ButtonComponent
                onPress={() => createOrUpdateRequest()}
                icon={buttonArrowGreen}
                title={post ? strings.editRequest : strings.postRequest}
                style={styles.postButton}
                disabled={!postData || isLoading}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
