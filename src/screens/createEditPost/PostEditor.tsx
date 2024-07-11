import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash/fp";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
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
import { ImageChooser } from "~/components/image-chooser/ImageChooser";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { LocationAutocomplete } from "~/components/location-autocomplete/LocationAutocomplete";
import { UserMutations } from "~/network/api/services/useUserService";
import { ImageKey } from "~/types/image-info";
import { Post, PostData, PostType, PostUpdateData } from "~/types/post";
import { RemoteImage } from "~/types/remote-image";
import { FileKey, UploadFileData } from "~/types/upload-file-data";
import { createStyleSheet } from "./style";

interface Callback {
  onSuccess: () => void;
}
interface PostEditorProps {
  post?: Post;
  isLoading: boolean;
  onSubmitCreate?: (data: PostData, callback: Callback) => void;
  onSubmitUpdate?: (data: PostUpdateData, callback: Callback) => void;
}
export const PostEditor = ({
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
      type: PostType.OFFER,
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

  const type = useWatch({
    control,
    name: "type",
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

  const handleChangeImages = (images: ImageKey[]) => {
    setValue("images", images);
  };

  const getButtonName = () => {
    if (type === PostType.OFFER) {
      return post ? strings.editOffer : strings.createOffer;
    } else {
      return post ? strings.editRequest : strings.createRequest;
    }
  };

  const PostTypeChooser = () => (
    <View style={styles.postFilter}>
      <TouchableOpacity
        style={styles.container3}
        activeOpacity={1}
        onPress={() => setValue("type", PostType.OFFER)}
      >
        <ImageComponent
          source={type === PostType.OFFER ? greenOffer : blackOffer}
          style={styles.icon1}
        />
        <Text
          style={[type === PostType.OFFER ? styles.emphasized : styles.regular]}
        >
          Offer
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.container3}
        activeOpacity={0.8}
        onPress={() => setValue("type", PostType.REQUEST)}
      >
        <ImageComponent
          source={type === PostType.REQUEST ? requestGreen : request}
          style={styles.icon1}
        />
        <Text
          style={[
            type === PostType.REQUEST ? styles.emphasized : styles.regular,
          ]}
        >
          Request
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <Loader visible={isLoading || isUploadingImage} />
      <PostTypeChooser />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ justifyContent: "space-between" }}>
          <View style={{ rowGap: 8 }}>
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
                  style={styles.postInput}
                  autoFocus={!post}
                ></TextInput>
              )}
              name="name"
            />
            {errors.name && <Text>This is required.</Text>}
            <View style={styles.rowContainer}>
              <FontAwesomeIcon icon={faLocationDot} size={20} />
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
            </View>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  multiline
                  placeholder="Details"
                  placeholderTextColor="darkgray"
                  textAlignVertical={"top"}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.postInputBody}
                ></TextInput>
              )}
              name="details"
            />
            {errors.details && <Text>This is required.</Text>}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setDatePickerVisible(true)}
              style={styles.rowContainer}
            >
              <FontAwesomeIcon icon={faCalendar} size={20} />

              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Text
                      style={[
                        styles.postInput,
                        { color: getValues("startDate") ? "black" : "#8B8888" },
                      ]}
                    >
                      {getValues("startDate")?.toLocaleString(
                        DateTime.DATE_MED
                      ) ?? "Date"}
                    </Text>
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
                  </>
                )}
                name="startDate"
              />
            </TouchableOpacity>

            <Text style={styles.label1}>Images</Text>
            <ImageChooser
              id={post?.id}
              uploadKey={FileKey.postImage}
              defaultValue={getValues("images")}
              onChangeImages={handleChangeImages}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              bottom: 0,
              marginBottom: 0,
              marginTop: 30,
            }}
          >
            <ButtonComponent
              onPress={navigation.goBack}
              hasIcon={false}
              title="Cancel"
              style={styles.cancelButton}
            />
            <ButtonComponent
              onPress={handleSubmit(onSubmit)}
              icon={buttonArrowGreen}
              title={getButtonName()}
              style={styles.postButton}
              disabled={isLoading}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
