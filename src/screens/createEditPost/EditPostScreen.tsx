import React from "react";
import { ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { HomeStackScreenProps, Screens } from "~/navigation/types";
import { PostData } from "~/types/post-data";
import { PostOffer } from "./PostOffer";
import { PostRequest } from "./PostRequest";

export const EditPostScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<Screens.EDIT_POST>) => {
  const post = route.params.post;

  const handleSubmit = (postData: PostData) => {
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
