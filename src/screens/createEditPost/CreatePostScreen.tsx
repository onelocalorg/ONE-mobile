import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { PostMutations } from "~/network/api/services/usePostService";
import { Post, PostData } from "~/types/post";
import { PostEditor } from "./PostEditor";
import { createStyleSheet } from "./style";

export const CreatePostScreen = ({
  route,
}: RootStackScreenProps<Screens.CREATE_POST>) => {
  const groupId = route.params?.groupId;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const navigation = useNavigation();

  const { mutate: createPost } = useMutation<Post, Error, PostData>({
    mutationKey: [PostMutations.createPost],
    onSuccess: () => {
      navigation.goBack();
    },
  });

  return (
    <>
      <ScrollView>
        <View style={styles.postClass}>
          <PostEditor
            onSubmitCreate={(postData) => createPost({ ...postData, groupId })}
            isLoading={false}
          />
        </View>
      </ScrollView>
    </>
  );
};
