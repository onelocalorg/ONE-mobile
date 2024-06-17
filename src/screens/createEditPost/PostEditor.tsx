import { DateTime } from "luxon";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { pin, postCalender } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { LocationAutocomplete } from "~/components/location-autocomplete/LocationAutocomplete";
import { SizedBox } from "~/components/sized-box";
import { verticalScale } from "~/theme/device/normalize";
import { PostData } from "~/types/post-data";
import { createStyleSheet } from "./style";

interface PostEditorProps {
  post?: PostData;
}
export const PostEditor = ({ post }: PostEditorProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<PostData>();

  return (
    <>
      <Loader visible={isLoading} />
      <View>
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
      </View>
    </>
  );
};
