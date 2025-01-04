import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { buttonArrowGreen } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import {
  ImageChooser,
  ImageKey,
} from "~/components/image-chooser/ImageChooser";
import { Loader } from "~/components/loader";
import { LocationAutocomplete } from "~/components/location-autocomplete/LocationAutocomplete";
import { useChapterFilter } from "~/navigation/AppContext";
import { useMyUserId } from "~/navigation/AuthContext";
import {
  UserMutations,
  useUserService,
} from "~/network/api/services/useUserService";
import { Group, GroupData, GroupUpdateData } from "~/types/group";
import { RemoteImage } from "~/types/remote-image";
import { FileKey, UploadFileData } from "~/types/upload-file-data";
import { isNotEmpty } from "~/utils/common";
import { createStyleSheet } from "./style";

interface Callback {
  onSuccess: () => void;
}
interface GroupEditorProps {
  group?: Group;
  isLoading: boolean;
  onSubmitCreate?: (data: GroupData, callback: Callback) => void;
  onSubmitUpdate?: (data: GroupUpdateData, callback: Callback) => void;
}
export const GroupEditor = ({
  group,
  isLoading,
  onSubmitCreate,
  onSubmitUpdate,
}: GroupEditorProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const navigation = useNavigation();
  const chapterFilter = useChapterFilter();

  // TODO Figure out a better way to have the current user always available
  const myUserId = useMyUserId();
  const {
    queries: { detail: getUser },
  } = useUserService();
  const { data: myProfile } = useQuery(getUser(myUserId));

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupUpdateData>({
    defaultValues: group
      ? {
          ..._.omit(["parentId"], group),
        }
      : {
          name: "",
          chapterId: chapterFilter?.id,
          summary: "",
          details: "",
          venue: "",
          address: "",
          coordinates: [],
          pic: { key: "" },
        },
  });

  console.log("errors", errors);

  const { isPending: isUploadingImage } = useMutation<
    RemoteImage,
    Error,
    UploadFileData
  >({
    mutationKey: [UserMutations.uploadFile],
  });

  const onSubmit = (data: GroupData | GroupUpdateData) => {
    console.log("onSubmit");
    const onSuccess = () => {
      navigation.goBack();
    };

    const removeUrls = (data: GroupData | GroupUpdateData) => ({
      // ChapterId is overridden by chapterFilter set in defaultValues
      chapterId: myProfile?.chapterId,
      ..._.pickBy(isNotEmpty, data),
    });

    const clean = removeUrls(data);

    if (
      !group &&
      chapterFilter?.id &&
      myProfile?.chapterId &&
      chapterFilter.id !== myProfile.chapterId
    ) {
      Alert.alert(
        "Create outside of home chapter?",
        `This will create a group in ${chapterFilter.name} which is different from your home chapter. Are you sure you want to proceed?`,
        [
          { text: strings.no, onPress: () => null, style: "cancel" },
          {
            text: strings.yes,
            onPress: () => onSubmitCreate!(clean as GroupData, { onSuccess }),
          },
        ],
        { cancelable: false }
      );
    } else {
      group
        ? onSubmitUpdate!(clean as GroupUpdateData, { onSuccess })
        : onSubmitCreate!(clean as GroupData, { onSuccess });
    }
  };

  const getButtonName = () => {
    return group ? strings.editGroup : strings.createGroup;
  };

  const handleChangeImages = (images: ImageKey[]) => {
    setValue("pic", _.head(images));
  };

  return (
    <View>
      <Loader visible={isLoading || isUploadingImage} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ justifyContent: "space-between" }}>
          <View style={{ rowGap: 8 }}>
            <Text style={styles.emphasized}>
              {group ? strings.editGroup : strings.createGroup}
            </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Name"
                  placeholderTextColor="#8B8888"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  style={styles.groupInput}
                  autoFocus={!group}
                ></TextInput>
              )}
              name="name"
            />
            {errors.name && <Text>This is required.</Text>}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Summary"
                  placeholderTextColor="#8B8888"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  style={styles.groupInput}
                  autoFocus={!!group}
                ></TextInput>
              )}
              name="summary"
            />

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
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Venue"
                  placeholderTextColor="#8B8888"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  style={styles.groupInput}
                  autoFocus={!!group}
                ></TextInput>
              )}
              name="venue"
            />

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  multiline
                  placeholder="Details"
                  placeholderTextColor="darkgray"
                  textAlignVertical={"top"}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.groupInputBody}
                ></TextInput>
              )}
              name="details"
            />

            <ImageChooser
              id={group?.id}
              uploadKey={FileKey.groupImage}
              defaultValue={getValues("pic") ? [getValues("pic")!] : undefined}
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
              style={styles.groupButton}
              disabled={isLoading}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
