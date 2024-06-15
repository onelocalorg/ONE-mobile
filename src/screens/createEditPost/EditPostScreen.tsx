import React from "react";
import { ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { getPost } from "~/network/api/services/post-service";
import { Post } from "~/types/post";
import { handleApiError } from "~/utils/common";
import { PostOffer } from "./PostOffer";
import { PostRequest } from "./PostRequest";

export const EditPostScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.EDIT_POST>) => {
  const postId = route.params.id;

  const [post, setPost] = React.useState<Post>();

  React.useEffect(() => {
    getPost(postId).then(setPost).catch(handleApiError("Post"));
  }, [postId]);

  const handleSubmit = () => {
    navigation.goBack();
  };

  return (
    <>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {post?.type === "offer" ? (
            <PostOffer onSubmit={handleSubmit} post={post} />
          ) : post?.type === "request" ? (
            <PostRequest onSubmit={handleSubmit} post={post} />
          ) : // ) : post?.type === "gratis" ? (
          //   <CreateEditPostGratisScreen navigation={navigation} />
          null}
        </ScrollView>
      </KeyboardAwareScrollView>
    </>
  );
};
