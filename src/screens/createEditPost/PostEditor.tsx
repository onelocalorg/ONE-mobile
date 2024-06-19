import { useNavigation } from "@react-navigation/native";
import _ from "lodash/fp";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { buttonArrowGreen, pin, postCalender } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { LocationAutocomplete } from "~/components/location-autocomplete/LocationAutocomplete";
import { SizedBox } from "~/components/sized-box";
import { verticalScale } from "~/theme/device/normalize";
import { PostData, PostType } from "~/types/post-data";
import { PostUpdateData } from "~/types/post-update-data";
import { createStyleSheet } from "./style";

interface PostEditorProps {
  type: PostType;
  post?: PostData;
  isLoading: boolean;
  onSubmitCreate?: (data: PostData, { onSuccess }) => void;
  onSubmitUpdate?: (data: PostUpdateData, { onSuccess }) => void;
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
    defaultValues: post
      ? { ..._.omit(["gratis", "replies", "postDate", "author"], post), type }
      : {
          type,
          name: "",
          details: "",
          timezone: "America/Denver",
        },
  });

  const onSubmit = (data: PostData | PostUpdateData) => {
    const onSuccess = () => {
      navigation.goBack();
    };

    post
      ? onSubmitUpdate!(data as PostUpdateData, { onSuccess })
      : onSubmitCreate!(data as PostData, { onSuccess });
  };

  return (
    <View>
      <Loader visible={isLoading} />
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

      {/* <ImageUploader
          onLoading={setLoading}
          onChangeImages={(images) => {
            setImages(images || []);
            setDirty(true);
          }}
        /> */}

      <View style={styles.bottomButton}>
        <ButtonComponent
          onPress={handleSubmit(onSubmit)}
          icon={buttonArrowGreen}
          title={post ? strings.editOffer : strings.postOffer}
          style={styles.postButton}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};
