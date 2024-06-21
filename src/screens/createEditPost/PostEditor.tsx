import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash/fp";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { buttonArrowGreen, pin, postCalender } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { LocationAutocomplete } from "~/components/location-autocomplete/LocationAutocomplete";
import { SizedBox } from "~/components/sized-box";
import { UserMutations } from "~/network/api/services/useUserService";
import { verticalScale } from "~/theme/device/normalize";
import { Post, PostData, PostType, PostUpdateData } from "~/types/post";
import { RemoteImage } from "~/types/remote-image";
import { FileKeys, UploadFileData } from "~/types/upload-file-data";
import { createStyleSheet } from "./style";

interface Callback {
  onSuccess: () => void;
}
interface PostEditorProps {
  type: PostType;
  post?: Post;
  isLoading: boolean;
  onSubmitCreate?: (data: PostData, callback: Callback) => void;
  onSubmitUpdate?: (data: PostUpdateData, callback: Callback) => void;
}
export const PostEditor = ({
  type,
  post,
  isLoading,
  onSubmitCreate,
  onSubmitUpdate,
}: PostEditorProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<PostUpdateData>({
    defaultValues: {
      type,
      name: "",
      details: "",
      images: [],
      timezone: DateTime.local().zoneName,
      ..._.omit(
        ["gratis", "replies", "numReplies", "postDate", "author"],
        post
      ),
    },
  });
  const { append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });

  const { isPending: isUploadingImage, mutate: uploadFile } = useMutation<
    RemoteImage,
    Error,
    UploadFileData
  >({
    mutationKey: [UserMutations.uploadFile],
  });

  const onSubmit = (data: PostData | PostUpdateData) => {
    const onSuccess = () => {
      navigation.goBack();
    };

    const removeUrls = (data: PostData | PostUpdateData) => ({
      ...data,
      images: data.images?.map(_.omit("url")),
    });

    const clean = removeUrls(data);

    post
      ? onSubmitUpdate!(clean as PostUpdateData, { onSuccess })
      : onSubmitCreate!(clean as PostData, { onSuccess });
  };

  const chooseImages = async () => {
    try {
      const images = await ImagePicker.openPicker({
        width: 800,
        height: 400,
        cropping: true,
        mediaType: "photo",
        includeBase64: true,
        multiple: false,
        showsSelectedCount: false,
      });
      // for (const image of images) {
      const { filename, mime, data: base64 } = images;

      if (!base64) {
        Alert.alert("Image picker did not return data");
      } else {
        uploadFile(
          {
            uploadKey: FileKeys.postImage,
            imageName:
              filename || (post?.id ?? (Math.random() * 100000).toString()),
            mimeType: mime || "image/jpg",
            base64,
          },
          {
            onSuccess(uploadedFile) {
              appendImage({
                key: uploadedFile.key,
                url: uploadedFile.imageUrl,
              });
            },
          }
        );
        // }
      }
    } catch (e) {
      if ((e as Error).message !== "User cancelled image selection") {
        console.error("Error choosing image", e);
      }
    }
  };

  const getButtonName = () => {
    if (type === PostType.OFFER) {
      return post ? strings.editOffer : strings.createOffer;
    } else {
      return post ? strings.editRequest : strings.createRequest;
    }
  };

  const handlePressImage = (keyToRemove: string) => {
    const index = getValues("images")?.findIndex((i) => i.key === keyToRemove);
    removeImage(index);
  };

  return (
    <View>
      <Loader visible={isLoading || isUploadingImage} />
      <View style={styles.createPostCont}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Title"
              placeholderTextColor="#8B8888"
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
              style={styles.postInputTwo}
              autoFocus={!post}
            ></TextInput>
          )}
          name="name"
        />
      </View>
      {errors.name && <Text>This is required.</Text>}

      <View style={styles.postCont}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              multiline
              placeholder="Body"
              placeholderTextColor="darkgray"
              textAlignVertical={"top"}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              style={styles.postInput}
            ></TextInput>
          )}
          name="details"
        />
      </View>
      {errors.details && <Text>This is required.</Text>}

      <SizedBox height={verticalScale(10)}></SizedBox>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setDatePickerVisible(true)}
        style={styles.postContainer}
      >
        <Text style={styles.postInputIconRight}>
          {getValues("startDate")?.toLocaleString(DateTime.DATE_MED)}
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <DateTimePicker
              isVisible={isDatePickerVisible}
              date={value?.toJSDate()}
              mode="date"
              minimumDate={new Date()}
              onConfirm={(d) => {
                onChange(DateTime.fromJSDate(d));
                setDatePickerVisible(false);
              }}
              onCancel={() => setDatePickerVisible(false)}
            />
          )}
          name="startDate"
        />

        <ImageComponent
          resizeMode="cover"
          source={postCalender}
          style={styles.createImgTwo}
        ></ImageComponent>
      </TouchableOpacity>
      <SizedBox height={verticalScale(8)}></SizedBox>
      <View style={styles.createPostContTwo}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <LocationAutocomplete
              placeholder="Location"
              address={value}
              onPress={(data, details) => {
                onChange(data.description);
                if (details) {
                  setValue("coordinates", [
                    details.geometry.location.lng,
                    details.geometry.location.lat,
                  ]);
                }
              }}
            />
          )}
          name="address"
        />
        <ImageComponent
          resizeMode="cover"
          source={pin}
          style={styles.createImgTwo}
        ></ImageComponent>
      </View>

      <TouchableOpacity onPress={chooseImages} style={styles.imagesCont}>
        <Text style={styles.textTwo}>Image</Text>
        <Text style={styles.textTwo}>+</Text>
        <Text style={styles.textThree}>add images</Text>
      </TouchableOpacity>

      <View style={styles.multipleImagecont}>
        {getValues("images")?.map((ie) => (
          <TouchableOpacity
            key={ie.key}
            onPress={() => handlePressImage(ie.key)}
          >
            <ImageComponent
              source={{ uri: ie.url }}
              style={styles.selectImage}
            ></ImageComponent>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomButton}>
        <ButtonComponent
          onPress={handleSubmit(onSubmit)}
          icon={buttonArrowGreen}
          title={getButtonName()}
          style={styles.postButton}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};
