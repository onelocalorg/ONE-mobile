/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Button,
  Image,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getReadableVersion } from "react-native-device-info";
import ImagePicker from "react-native-image-crop-picker";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { dummy, gratis } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Input } from "~/components/input";
import { Loader } from "~/components/loader";
import { TabComponent } from "~/components/tab-component";
import { AuthDispatchContext, useMyUserId } from "~/navigation/AuthContext";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { useUserService } from "~/network/api/services/useUserService";
import { LocalEvent } from "~/types/local-event";
import { UploadKey } from "~/types/upload-key";
import { handleApiError } from "~/utils/common";
import { LogoutPressable } from "./LogoutPressable";
import { MyAbout } from "./MyAbout";
import { MyEvents } from "./MyEvents";
import { createStyleSheet } from "./style";

export const MyProfileScreen = ({
  navigation,
}: RootStackScreenProps<Screens.MY_PROFILE>) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const [selectedTab, setSelectedTab] = useState(0);
  const [profileUri, setProfileUri] = useState<string>();
  const [backgroundUri, setBackgroundUri] = useState<string>();
  const [setimageType, selectImage] = useState();
  const [updatedBio, setBio] = useState();
  const [filename, setFilename] = useState<string>();
  const [base64string, setBase64Path] = useState<string>();
  const [imageOption, ImageOptionModal] = useState(false);
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [nickName, setNickName] = useState<string>();
  const [catchphrase, setCatchphrase] = useState<string>();
  const [skills, setSkills] = useState<string[]>([]);
  const [profileAnswers, setProfileAnswers] = useState<string[]>([]);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const { handleSignOut } = useContext(AuthDispatchContext);
  const myUserId = useMyUserId();

  const {
    queries: { detail: getUser },
  } = useUserService();

  const {
    isPending,
    isError,
    data: myProfile,
    error,
  } = useQuery(getUser(myUserId));
  if (isError) handleApiError("Profile", error);

  React.useEffect(() => {
    if (myProfile) {
      setFirstName(myProfile.firstName);
      setLastName(myProfile.lastName);
      setNickName(myProfile.nickname);
      setSkills(myProfile.skills);
      setCatchphrase(myProfile.catchPhrase);
      setProfileUri(myProfile.pic);
    }
  }, []);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //       console.log("App has come to the foreground!");
  //     }

  //     appState.current = nextAppState;
  //     setAppStateVisible(appState.current);
  //     console.log("AppState", appState.current);
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  const onSaveProfile = async (request: {
    about?: string;
    skills?: string[];
  }) => {
    Keyboard.dismiss();
    const body = {
      ...request,
      bio: updatedBio,
      // coverImage: myProfile?.coverImage,
      first_name: firstName,
      last_name: lastName,
      nick_name: nickName,
    } as {
      about?: string;
      skills?: string[];
      profile?: string;
      first_name?: string;
      last_name?: string;
      nick_name?: string;
    };
    setLoading(true);
    if (myProfile?.pic !== profileUri) {
      body.profile = profileUri;
    }

    const res = await mutateAsync({
      bodyParams: body,
      userId: myProfile!.id,
    });
    if (res?.success) {
      navigation.goBack();
    } else {
      Toast.show(res?.message, Toast.LONG, {
        backgroundColor: "black",
      });
      setLoading(false);
    }
  };
  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const chooseImage = async () => {
    if (!myProfile) {
      return;
    }

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
      console.log(mime, fileName, base64);
      if (!base64) {
        Alert.alert("Image picker did not return data");
      } else {
        setLoading(true);
        const remote = await uploadFile(
          UploadKey.SIGNUP_PIC,
          fileName || "profile_pic",
          mime || "image/jpg",
          base64
        );
        setProfileUri(remote.imageUrl);
        await Promise.all([
          updateUserProfile(myProfile?.id, {
            pic: remote.key,
          }),
        ]);
      }
    } catch (e) {
      Alert.alert("caught exception", JSON.stringify(e));
      handleApiError("Error uploading image", e);
    } finally {
      setLoading(false);
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
            deleteUserAccountAPI();
          },
        },
      ],
      { cancelable: false }
    );
  };

  async function deleteUserAccountAPI() {
    try {
      if (myProfile) {
        await deleteUser(myProfile.id);
        handleSignOut();
      }
    } catch (error) {
      handleApiError("Error deleting user", error);
    } finally {
      setLoading(false);
    }
  }

  const navigateToEventDetail = (event: LocalEvent) => {
    navigation.push(Screens.MAIN_TABS, {
      screen: Screens.EVENTS_STACK,
      params: {
        screen: Screens.EVENT_DETAIL,
        params: { id: event.id },
      },
    });
  };

  return (
    <>
      <Loader visible={isPending} showOverlay={true} />
      {myProfile ? (
        <>
          <View style={styles.profileContainer}>
            <Pressable onPress={chooseImage}>
              <ImageComponent
                isUrl={!!profileUri}
                resizeMode="cover"
                style={styles.profile}
                uri={profileUri}
                source={dummy}
              />
              <Button title="Update" onPress={chooseImage} />
            </Pressable>
          </View>

          <TouchableOpacity
            style={styles.userData}
            activeOpacity={1}
            onPress={keyboardDismiss}
          >
            <View style={styles.center}>
              <View style={styles.userNameClass}>
                <TextInput
                  onChangeText={(text) => setFirstName(text)}
                  placeholder="first name"
                  placeholderTextColor="#818181"
                  style={styles.firstName}
                >
                  {firstName}
                </TextInput>
                <TextInput
                  onChangeText={(text) => setLastName(text)}
                  placeholder="last name"
                  placeholderTextColor="#818181"
                  style={styles.lastName}
                >
                  {lastName}
                </TextInput>
              </View>
              <View style={styles.circularView}>
                <TextInput
                  onChangeText={(text) => setNickName(text)}
                  placeholder="enter nickname"
                  placeholderTextColor="#818181"
                  style={styles.des}
                >
                  {nickName}
                </TextInput>
              </View>
            </View>

            <View style={styles.gratiesCont}>
              <View style={styles.payoutAndGratisCont}>
                <Image
                  source={gratis}
                  resizeMode="cover"
                  style={styles.gratiesImage}
                ></Image>
                <Text style={styles.gratiesNumber}>{myProfile.gratis}</Text>
              </View>

              {/* {onCheckReleaseHideShow() ? (
                <TouchableOpacity
                  onPress={getPayoutConnectListAPI}
                  activeOpacity={0.8}
                  style={styles.payView}
                >
                  <ImageComponent
                    style={styles.payoutIcon}
                    source={sendPayoutImg}
                  ></ImageComponent>
                  <Text style={styles.pay}>
                    {" "}
                    {myProfile.isConnectedLinked
                      ? "Payout Connected"
                      : "link payout method"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )} */}
            </View>

            <View style={styles.aboutView}>
              <Input
                inputStyle={styles.input}
                value={updatedBio}
                placeholderTextColor="#818181"
                placeholder="enter a catchphrase"
                onChangeText={setCatchphrase}
                multiline
              />
            </View>

            <View style={styles.line} />
            <TabComponent
              tabs={[strings.about, strings.myEvents]}
              onPressTab={setSelectedTab}
            />
            {selectedTab === 0 && (
              <MyAbout user={myProfile} onEditProfile={onSaveProfile} />
            )}
            {selectedTab === 1 && (
              <MyEvents user={myProfile} onEventPress={navigateToEventDetail} />
            )}
          </TouchableOpacity>
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
    </>
  );
};
