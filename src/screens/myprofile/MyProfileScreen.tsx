/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import { getReadableVersion } from "react-native-device-info";
import { ScrollView } from "react-native-gesture-handler";
import { Menu } from "react-native-paper";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { dummy } from "~/assets/images";
import { ImageUploader } from "~/components/ImageUploader";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { AppContext } from "~/navigation/AppContext";
import { useMyUserId } from "~/navigation/AuthContext";
import {
  ChapterMutations,
  useChapterService,
} from "~/network/api/services/useChapterService";
import {
  UserMutations,
  useUserService,
} from "~/network/api/services/useUserService";
import { ImageKey } from "~/types/image-info";
import { RemoteImage } from "~/types/remote-image";
import { FileKey, UploadFileData } from "~/types/upload-file-data";
import { UserProfile, UserProfileUpdateData } from "~/types/user-profile";
import { findChapter } from "~/utils/common";
import { LogoutPressable } from "./LogoutPressable";
import { MyEvents } from "./MyEvents";
import { ProfileEditor } from "./ProfileEditor";
import { createStyleSheet } from "./style";

export const MyProfileScreen = () => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const myUserId = useMyUserId();
  const { chapterFilter, setChapterFilter } = useContext(AppContext)!;

  const [isChapterPickerVisible, setChapterPickerVisible] = useState(false);
  const openMenu = () => setChapterPickerVisible(true);
  const closeMenu = () => setChapterPickerVisible(false);

  const {
    queries: { detail: getUser },
  } = useUserService();

  const { isLoading, data: myProfile } = useQuery(getUser(myUserId));
  const {
    queries: { list: listChapters },
  } = useChapterService();

  const { data: chapters } = useQuery(listChapters());

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

  const { mutate: joinChapter } = useMutation<void, Error, string>({
    mutationKey: [ChapterMutations.joinChapter],
  });

  const handleImageAdded = (image: ImageKey) => {
    updateUserProfile({
      id: myUserId!,
      pic: { key: image.key },
    });
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
            {myProfile && (
              <View style={styles.innerContainer}>
                <Menu
                  visible={isChapterPickerVisible}
                  onDismiss={closeMenu}
                  anchor={
                    <Pressable onPress={openMenu}>
                      <Text>
                        Home chapter:{" "}
                        {myProfile.chapterId
                          ? findChapter(myProfile.chapterId, chapters)?.name
                          : "None"}
                        <Text style={{ fontSize: 10 }}>{"\u25BC"}</Text>
                      </Text>
                    </Pressable>
                  }
                >
                  {chapters?.map((chapter) => (
                    <Menu.Item
                      key={chapter.id}
                      onPress={() => {
                        joinChapter(chapter.id);
                        setChapterFilter(chapter);
                        closeMenu();
                      }}
                      title={chapter.name}
                    />
                  ))}
                </Menu>
              </View>
            )}
            <View style={styles.profileContainer}>
              <ImageUploader
                id={myUserId}
                uploadKey={FileKey.pic}
                onImageUpload={handleImageAdded}
              >
                <ImageComponent
                  isUrl={!!myProfile.pic.url}
                  resizeMode="cover"
                  style={styles.profile}
                  uri={myProfile.pic.url}
                  source={dummy}
                />
              </ImageUploader>
            </View>

            <View style={styles.line} />
            {myProfile && (
              <ProfileEditor
                userProfile={myProfile}
                saveProfile={updateUserProfile}
              />
            )}

            <View style={styles.line} />

            <View style={styles.innerContainer}>
              <Text style={styles.membership}>My events</Text>
            </View>
            <MyEvents user={myProfile} />

            <TouchableOpacity onPress={deleteAccount}>
              <Text style={styles.deleteAccount}>{strings.deleteAccount}</Text>
            </TouchableOpacity>
            <Text>
              Build: {getReadableVersion()} -{" "}
              {process.env.API_URL?.includes("prod.onelocal.one")
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
