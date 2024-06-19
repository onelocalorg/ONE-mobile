import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { blackOffer, greenOffer, request, requestGreen } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { usePostService } from "~/network/api/services/usePostService";
import { PostType } from "~/types/post-data";
import { PostEditor } from "./PostEditor";
import { createStyleSheet } from "./style";

export const CreateEditPostScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.CREATE_EDIT_POST>) => {
  const postId = route.params?.id;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [type, setType] = useState<PostType>(PostType.OFFER);

  const {
    queries: { detail: getPost },
    mutations: { createPost, editPost },
  } = usePostService();

  const { data: post, isPending, isLoading } = useQuery(getPost(postId));

  const getType = () => post?.type ?? type;

  const mutateCreatePost = useMutation(createPost);
  const mutateEditPost = useMutation(editPost);

  return (
    <>
      <Loader visible={isPending} />
      <View style={styles.postFilter}>
        <TouchableOpacity
          style={styles.container3}
          activeOpacity={1}
          onPress={() => (!post ? setType(PostType.OFFER) : {})}
        >
          <ImageComponent
            source={getType() === PostType.OFFER ? greenOffer : blackOffer}
            style={styles.icon1}
          />
          <Text
            style={[
              getType() === PostType.OFFER ? styles.label3 : styles.label4,
            ]}
          >
            Offer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.container3}
          activeOpacity={0.8}
          onPress={() => (!postId ? setType(PostType.REQUEST) : {})}
        >
          <ImageComponent
            source={getType() === PostType.REQUEST ? requestGreen : request}
            style={styles.icon1}
          />
          <Text
            style={[
              post?.type ?? type === PostType.REQUEST
                ? styles.label3
                : styles.label4,
            ]}
          >
            Request
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.postClass}>
          {!postId || post ? (
            <PostEditor
              type={getType()}
              post={post}
              onSubmitCreate={mutateCreatePost.mutate}
              onSubmitUpdate={mutateEditPost.mutate}
              isLoading={isLoading}
            />
          ) : null}
        </View>
      </View>
    </>
  );
};
