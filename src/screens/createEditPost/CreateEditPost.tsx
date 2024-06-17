import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import {
  blackOffer,
  buttonArrowGreen,
  greenOffer,
  request,
  requestGreen,
} from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { usePostService } from "~/network/api/services/usePostService";
import { Post } from "~/types/post";
import { PostData, PostType } from "~/types/post-data";
import { handleApiError } from "~/utils/common";
import { PostEditor } from "./PostEditor";
import { createStyleSheet } from "./style";

interface CreateEditPostProps {
  post?: Post;
}
export const CreateEditPost = ({ post }: CreateEditPostProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();

  const { createPost, updatePost } = usePostService();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const formMethods = useForm<PostData>({
    defaultValues: {
      type: PostType.OFFER,
      name: "",
      details: "",
      timezone: "America/Denver",
    },
  });

  const { control, handleSubmit } = formMethods;

  const mutateCreatePost = useMutation({
    mutationFn: (data: PostData) => {
      return createPost(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const mutateEditPost = useMutation({
    mutationFn: (data: PostData) => {
      return updatePost(post!.id, data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const isLoading = mutateCreatePost.isPending && mutateEditPost.isPending;

  const sendToApi = (data: PostData) => {
    console.log("createPost", data);
    mutateCreatePost.mutate(data, {
      onSuccess: () => {
        Toast.show("New post created", 5);
        navigation.goBack();
      },
      onError: (error) => {
        handleApiError("Create post", error);
      },
    });
  };

  const onSubmit = handleSubmit((data) => sendToApi(data));

  return (
    <>
      <Loader visible={isLoading} />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.postFilter}>
            <TouchableOpacity
              style={styles.container3}
              activeOpacity={1}
              onPress={() => onChange(PostType.OFFER)}
            >
              <ImageComponent
                source={value === PostType.OFFER ? greenOffer : blackOffer}
                style={styles.icon1}
              />
              <Text
                style={[
                  value === PostType.OFFER ? styles.label3 : styles.label4,
                ]}
              >
                Offer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.container3}
              activeOpacity={0.8}
              onPress={() => onChange(PostType.REQUEST)}
            >
              <ImageComponent
                source={value === PostType.REQUEST ? requestGreen : request}
                style={styles.icon1}
              />
              <Text
                style={[
                  value === PostType.REQUEST ? styles.label3 : styles.label4,
                ]}
              >
                Request
              </Text>
            </TouchableOpacity>
          </View>
        )}
        name="type"
      />
      <View>
        <View style={styles.postClass}>
          <FormProvider {...formMethods}>
            <PostEditor post={post} />
          </FormProvider>
          <View style={styles.bottomButton}>
            <ButtonComponent
              onPress={onSubmit}
              icon={buttonArrowGreen}
              title={post ? strings.editOffer : strings.postOffer}
              style={styles.postButton}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </>
  );
};
