import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React from "react";
import { ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Navbar } from "~/components/navbar/Navbar";
import { LOG } from "~/config";
import { Post } from "~/types/post";
import { PostOffer } from "./PostOffer";
import { PostRequest } from "./PostRequest";
import { CreateEditPostGratisScreen } from "./gratis";

interface EditPostScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      postData?: Post;
    };
  };
}

export const EditPostScreen = ({ navigation, route }: EditPostScreenProps) => {
  LOG.debug("EditPostScreen", route);
  const post = route?.params.postData;

  return (
    <>
      <Navbar navigation={navigation} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {post?.type === "offer" ? (
            <PostOffer navigation={navigation} post={post} />
          ) : post?.type === "request" ? (
            <PostRequest navigation={navigation} post={post} />
          ) : post?.type === "gratis" ? (
            <CreateEditPostGratisScreen navigation={navigation} />
          ) : null}
        </ScrollView>
      </KeyboardAwareScrollView>
    </>
  );
};
