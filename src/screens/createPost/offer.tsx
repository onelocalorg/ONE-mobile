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
import { createPost } from "~/network/api/services/post-service";
import { PostData } from "~/types/post-data";
import { PostView } from "./PostView";
import { createStyleSheet } from "./style";

interface CreatePostOfferScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
}
export const CreatePostOfferScreen = (props: CreatePostOfferScreenProps) => {
  const { navigation } = props || {};
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [isLoading, setLoading] = useState(false);

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const CreateNewPostModal = async (data: PostData) => {
    if (!data.what_name) {
      Toast.show("Title is required", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (!data.content) {
      Toast.show("Body is required", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      setLoading(true);
      const dataItem = await createPost(data);
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
              <Text style={styles.title}>My Abundance</Text>
              <PostView
                type="offer"
                onLoading={setLoading}
                onSubmit={CreateNewPostModal}
              />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};
