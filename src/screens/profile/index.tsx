/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getReadableVersion } from "react-native-device-info";
import { TextInput } from "react-native-gesture-handler";
import ImagePicker from "react-native-image-crop-picker";
import { launchCamera } from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-simple-toast";
import GestureRecognizer from "react-native-swipe-gestures";
import { useDispatch } from "react-redux";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useLogout } from "~/app-hooks/use-logout";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { Gratis, dummy, sendPayoutImg } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Input } from "~/components/input";
import { Navbar } from "~/components/navbar/Navbar";
import { TabComponent } from "~/components/tab-component";
import { navigations } from "~/config/app-navigation/constant";
import {
  deleteUser,
  getUserProfile,
} from "~/network/api/services/user-service";
import { getData, persistKeys } from "~/network/constant";
import { useEditProfile } from "~/network/hooks/user-service-hooks/use-edit-profile";
import { UserProfile } from "~/types/user-profile";
import { handleApiError } from "~/utils/common";
import { About } from "./about";
import { MyEvents } from "./my-events";
import { createStyleSheet } from "./style";

interface ProfileScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const ProfileScreen = (props: ProfileScreenProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const { navigation } = props || {};
  const [selectedTab, setSelectedTab] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>();
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
  const [isLoading, setLoading] = useState(false);

  const { onLogout } = useLogout();

  const { mutateAsync } = useEditProfile();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    retrieveUser();
  }, []);

  const retrieveUser = async () => {
    try {
      const userId = await AsyncStorage.getItem(persistKeys.userProfileId);
      if (userId) {
        const userProfile = await getUserProfile(userId);
        console.log("userProfile", userProfile);
        setUserProfile(userProfile);
        setProfileUri(userProfile.pic);
        setBackgroundUri(userProfile.coverImage);
        setFirstName(userProfile.first_name);
        setLastName(userProfile.last_name);
        setNickName(userProfile.nick_name);
        setCatchphrase(userProfile.catch_phrase);
        setSkills(userProfile.skills);
        setProfileAnswers(userProfile.profile_answers);
      }
    } catch (e) {
      handleApiError("Error retrieving user", e);
    }
  };

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

  const onCheckReleaseHideShow = () => {
    if (Platform.OS === "ios") {
      const isShowPaymentCheck = getData("isShowPaymentFlow");
      return isShowPaymentCheck;
    } else {
      const isShowPaymentCheckAndroid = getData("isShowPaymentFlowAndroid");
      return isShowPaymentCheckAndroid;
    }
  };

  const imageSelection = async (no: any) => {
    selectImage(no);
    ImageOptionModal(true);
  };

  const imageOptionSelect = async (item: any) => {
    if (item === 1) {
      if (Platform.OS === "ios") {
        GallerySelect();
      } else if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the camera");
            GallerySelect();
          } else {
            Alert.alert("Camera permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      }
    } else if (item === 2) {
      if (Platform.OS === "ios") {
        onUploadImage();
      } else if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the camera");
            onUploadImage();
          } else {
            Alert.alert("Camera permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      }
    } else {
      ImageOptionModal(false);
    }
  };

  const onUploadImage = async () => {
    const { assets } = await launchCamera({
      mediaType: "photo",
      includeBase64: true,
      maxWidth: 800,
      maxHeight: 800,
    });
    ImageOptionModal(false);
    console.log("--------assets----------", assets);
    if (assets) {
      const img = assets?.[0];
      console.log("---------------assets Gallery 222---------------");
      console.log(assets);
      var fileNameTwo = img?.fileName ?? "";
      setLoading(true);
      var output =
        fileNameTwo.substr(0, fileNameTwo.lastIndexOf(".")) || fileNameTwo;
      var base64Two = img?.base64 ?? "";

      setFilename(output);
      setBase64Path(base64Two);

      if (setimageType === 1) {
        ProfileImageUploadAPI(output, base64Two);
      }
      if (setimageType === 2) {
        BackgroundImageUploadAPI(output, base64Two);
      }
      // imageUploadAPI(output, base64Two);
    }
  };

  const GallerySelect = async () => {
    // const {assets} = await launchImageLibrary({
    //   mediaType: 'photo',
    //   includeBase64: true,
    //   maxWidth: 800,
    //   maxHeight: 800,
    // });
    console.log("===============111111==================");
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropperRotateButtonsHidden: true,
      mediaType: "photo",
      includeBase64: true,
      cropping: true,
    }).then((image) => {
      if (image) {
        var fileNameTwo = image?.filename ?? "";
        setLoading(true);
        var output =
          fileNameTwo.substr(0, fileNameTwo.lastIndexOf(".")) || fileNameTwo;
        var base64Two = image?.data ?? "";

        setFilename(output);
        setBase64Path(base64Two);
        if (setimageType === 1) {
          ProfileImageUploadAPI(output, base64Two);
        }
        if (setimageType === 2) {
          BackgroundImageUploadAPI(output, base64Two);
        }
        // imageUploadAPI(output, base64Two);
      }
    });
  };

  const ProfileImageUploadAPI = async (fileItem: any, base64Item: any) => {
    if (Platform.OS === "ios") {
      var pic: any = {
        uploadKey: "pic",
        userId: userProfile?.id,
        imageName: fileItem,
        base64String: "data:image/jpeg;base64," + base64Item,
      };
    } else {
      var isImg: any = ".JPG";
      var pic: any = {
        uploadKey: "pic",
        userId: userProfile?.id,
        imageName: Math.random().toString() + isImg,
        base64String: "data:image/jpeg;base64," + base64Item,
      };
    }

    ImageOptionModal(false);
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/users/upload/file",
        {
          method: "post",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(pic),
        }
      );
      const dataItem = await response.json();
      setLoading(false);
      setProfileUri(dataItem?.data?.imageUrl);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const BackgroundImageUploadAPI = async (fileItem: any, base64Item: any) => {
    if (Platform.OS == "ios") {
      var pic: any = {
        uploadKey: "cover_image",
        userId: userProfile?.id,
        imageName: fileItem,
        base64String: "data:image/jpeg;base64," + base64Item,
      };
    } else {
      var isImg: any = ".JPG";
      var pic: any = {
        uploadKey: "cover_image",
        userId: userProfile?.id,
        imageName: Math.random().toString() + isImg,
        base64String: "data:image/jpeg;base64," + base64Item,
      };
    }

    ImageOptionModal(false);
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/users/upload/file",
        {
          method: "post",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(pic),
        }
      );
      const dataItem = await response.json();
      setLoading(false);
      setBackgroundUri(dataItem?.data?.imageUrl);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getPayoutConnectListAPI = async () => {
    var pic: any = {};

    setLoading(true);
    console.log(process.env.API_URL + "/v1/users/connect-link");
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        process.env.API_URL + "/v1/users/connect-link",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        }
      );
      const dataItem = await response.json();
      if (dataItem?.data) {
        Linking.openURL(dataItem?.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onSaveProfile = async (request: {
    about?: string;
    skills?: string[];
  }) => {
    Keyboard.dismiss();
    let body = {
      ...request,
      bio: updatedBio,
      coverImage: userProfile?.coverImage,
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
    if (userProfile?.pic !== profileUri) {
      body.profile = profileUri;
    }

    const res = await mutateAsync({
      bodyParams: body,
      userId: userProfile!.id,
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

  const closeModal = () => {
    ImageOptionModal(false);
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
      if (userProfile) {
        await deleteUser(userProfile.id);
        navigation?.navigate(navigations?.LOGIN);
      }
    } catch (error) {
      handleApiError("Error deleting user", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
      <Navbar navigation={navigation} isAvatarVisible={false} />
      {userProfile ? (
        <>
          <ImageComponent
            isUrl={!!profileUri}
            resizeMode="cover"
            uri={profileUri}
            source={dummy}
            style={styles.profile}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ position: "absolute", right: 10, top: 60 }}
            onPress={() => onLogout()}
          >
            <Text
              style={{
                fontSize: 16,
                color: theme.colors.white,
                fontWeight: "500",
                fontFamily: theme.fontType.medium,
              }}
            >
              {strings.logout}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPress={keyboardDismiss}
          >
            <Modal transparent onDismiss={closeModal} visible={imageOption}>
              <GestureRecognizer
                onSwipeDown={closeModal}
                style={styles.gesture}
              >
                <TouchableOpacity
                  style={styles.containerGallery}
                  activeOpacity={1}
                  onPress={closeModal}
                />
              </GestureRecognizer>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardViewTwo}
              >
                <View style={styles.imageActionSheet}>
                  <TouchableOpacity onPress={() => imageOptionSelect(1)}>
                    <Text style={styles.galleryText}>Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => imageOptionSelect(2)}>
                    <Text style={styles.cameraText}>Camera</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </Modal>
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
                  source={Gratis}
                  resizeMode="cover"
                  style={styles.gratiesImage}
                ></Image>
                <Text style={styles.gratiesNumber}>
                  {userProfile.points_balance}
                </Text>
              </View>

              {onCheckReleaseHideShow() ? (
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
                    {userProfile.isConnectedLinked
                      ? "Payout Connected"
                      : "link payout method"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
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
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              {selectedTab === 0 && (
                <About
                  user={userProfile}
                  onEditProfile={onSaveProfile}
                  navigation={navigation}
                />
              )}
              {selectedTab === 1 && (
                <MyEvents user={userProfile} navigation={navigation} />
              )}
            </KeyboardAwareScrollView>
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
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ position: "absolute", right: 10, top: 60 }}
          onPress={() => onLogout()}
        >
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.white,
              fontWeight: "500",
              fontFamily: theme.fontType.medium,
            }}
          >
            {strings.logout}
          </Text>
        </TouchableOpacity>
      )}
    </KeyboardAwareScrollView>
  );
};
