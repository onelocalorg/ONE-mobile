import React, { useState } from "react";
import { Control } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

interface PostOfferProps {
  control: Control<PostData>;
  post?: Post;
  onSubmit?: (postData: PostData) => void;
}
export const PostOffer = ({ post, onSubmit }: PostOfferProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [isLoading, setLoading] = useState(false);
  const [postData, setPostData] = useState<PostData | undefined>(post);

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const createOrUpdateOffer = async () => {
    if (!postData?.name) {
      Toast.show("Title is required", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (!postData.details) {
      Toast.show("Body is required", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      setLoading(true);
      try {
        if (post) {
          await updatePost(post.id, { ...postData, type: "offer" });
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
      <ActivityIndicator animating={isLoading} />
      <TouchableOpacity
        onPress={keyboardDismiss}
        activeOpacity={1}
        style={styles.createPostModal}
      >
        <View>
          <View style={styles.postClass}>
            <Text style={styles.title}>Give</Text>
            <PostEditor
              type="offer"
              post={post}
              onLoading={setLoading}
              onFieldsChanged={setPostData}
            />
            <View style={styles.bottomButton}>
              <ButtonComponent
                onPress={() => createOrUpdateOffer()}
                icon={buttonArrowGreen}
                title={post ? strings.editOffer : strings.postOffer}
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
