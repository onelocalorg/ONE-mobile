import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React, { useState } from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { buttonArrowGreen } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { LOG } from "~/config";
import { createPost, updatePost } from "~/network/api/services/post-service";
import { Post } from "~/types/post";
import { PostData } from "~/types/post-data";
import { PostView } from "./PostView";
import { createStyleSheet } from "./style";

interface PostRequestProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  post?: Post;
}

export const PostRequest = ({ navigation, post }: PostRequestProps) => {
  LOG.debug("PostRequest", post);
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [isLoading, setLoading] = useState(false);
  const [postData, setPostData] = useState<PostData | undefined>(post);

  LOG.debug("postData", postData);

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
      let dataItem;
      if (post) {
        LOG.debug("updating", postData);
        dataItem = await updatePost(post.id, postData);
      } else {
        dataItem = await createPost(postData);
      }
      Toast.show(dataItem?.message, Toast.LONG, {
        backgroundColor: "black",
      });
      if (dataItem?.success === true) {
        navigation?.goBack();
      }

      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={keyboardDismiss}
          activeOpacity={1}
          style={styles.createPostModal}
        >
          <View>
            <View style={styles.postClass}>
              <Text style={styles.title}>Your Abundance</Text>
              <PostView
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
                  disabled={!postData}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};
