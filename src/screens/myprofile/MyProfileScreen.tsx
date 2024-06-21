/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Alert,
  Button,
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getReadableVersion } from "react-native-device-info";
import { ScrollView } from "react-native-gesture-handler";
import ImagePicker from "react-native-image-crop-picker";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { dummy } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { useMyUserId } from "~/navigation/AuthContext";
import {
  UserMutations,
  useUserService,
} from "~/network/api/services/useUserService";
import { RemoteImage } from "~/types/remote-image";
import { FileKeys, UploadFileData } from "~/types/upload-file-data";
import { UserProfile, UserProfileUpdateData } from "~/types/user-profile";
import { LogoutPressable } from "./LogoutPressable";
import { MyEvents } from "./MyEvents";
import { ProfileEditor } from "./ProfileEditor";
import { createStyleSheet } from "./style";

export const MyProfileScreen = () => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const myUserId = useMyUserId();

  const {
    queries: { detail: getUser },
  } = useUserService();

  const { isLoading, data: myProfile } = useQuery(getUser(myUserId));

  const { mutate: uploadFile } = useMutation<
    RemoteImage,
    Error,
    UploadFileData
  >({
    mutationKey: [UserMutations.uploadFile],
  });

  const { mutate: updateUserProfile } = useMutation<
    UserProfile,
    Error,
    UserProfileUpdateData
  >({
    mutationKey: [UserMutations.updateUser],
  });

  const { mutate: deleteUser } = useMutation<never, Error, string>({
    mutationKey: [UserMutations.deleteUser],
  });

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const chooseImage = async () => {
    try {
      const {
        mime,
        data: base64,
        filename: fileName,
      } = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        mediaType: "photo",
        includeBase64: true,
        multiple: false,
        cropperCircleOverlay: true,
        showsSelectedCount: false,
      });
      if (!base64) {
        Alert.alert("Image picker did not return data");
      } else {
        uploadFile(
          {
            uploadKey: FileKeys.signupPic,
            imageName: fileName || "profile_pic",
            mimeType: mime || "image/jpg",
            userId: myUserId,
            base64,
          },
          {
            onSuccess(data) {
              updateUserProfile({
                id: myUserId!,
                pic: { key: data.key },
              });
            },
          }
        );
      }
    } catch (e) {
      if ((e as Error).message !== "User cancelled image selection") {
        console.error("Error choosing image", e);
      }
    }
  };

  const deleteAccount = () => {
    Alert.alert(
      strings.deleteAccount,
      strings.areYouDeleteAccount,
      [
        { text: strings.no, onPress: () => null, style: "cancel" },
        {
          text: strings.yes,
          onPress: () => {
            deleteUser(myUserId!);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <Loader visible={isLoading} showOverlay={true} />
      <ScrollView>
        {myProfile ? (
          <>
            <View style={styles.profileContainer}>
              <Pressable onPress={chooseImage}>
                <ImageComponent
                  isUrl={!!myProfile.pic.url}
                  resizeMode="cover"
                  style={styles.profile}
                  uri={myProfile.pic.url}
                  source={dummy}
                />
                <Button title="Update" onPress={chooseImage} />
              </Pressable>
            </View>

            {myProfile && (
              <ProfileEditor
                userProfile={myProfile}
                saveProfile={updateUserProfile}
              />
            )}

            <View style={styles.line} />

            <View style={styles.innerConatiner}>
              <Text style={styles.membership}>My events</Text>
            </View>
            <MyEvents user={myProfile} />

            <TouchableOpacity onPress={deleteAccount}>
              <Text style={styles.deleteAccount}>{strings.deleteAccount}</Text>
            </TouchableOpacity>
            <Text>
              Build: {getReadableVersion()} -{" "}
              {process.env.API_URL?.includes("app.onelocal.one")
                ? "Production"
                : process.env.API_URL?.includes("beta.onelocal.one")
                ? "Beta"
                : process.env.API_URL?.includes("dev.onelocal.one")
                ? "Dev"
                : `??? ${process.env.API_URL}`}
            </Text>
            <View style={{ height: 40 }}></View>
          </>
        ) : (
          <View style={{ position: "absolute", right: 10, top: 60 }}>
            <LogoutPressable />
          </View>
        )}
      </ScrollView>
    </>
  );
};
