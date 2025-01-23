import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  PostMutations,
  usePostService,
} from "~/network/api/services/usePostService";
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
  const queryClient = useQueryClient();
  const { queries: postQueries } = usePostService();

  const { mutate: createPost } = useMutation<Post, Error, PostData>({
    mutationKey: [PostMutations.createPost],
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: postQueries.lists(),
        })
        .then(() => navigation.goBack());
    },
  });

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled">
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
