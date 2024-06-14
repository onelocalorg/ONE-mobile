import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { arrowLeft, defaultUser } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Screens } from "~/navigation/types";
import { persistKeys } from "~/network/constant";
import { OneLogo } from "./OneLogo";
import { createStyleSheet } from "./style";

export const Navbar = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const HIDE_HEADER_SCREENS = ["Login", "Signup"];

  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [searchQuery, setSearchQuery] = useState("");
  const [profilePic, setProfilePic] = useState<string>();

  useEffect(() => {
    AsyncStorage.getItem(persistKeys.userProfilePic).then((pic) => {
      if (pic) {
        setProfilePic(pic);
      }
    });
  }, []);

  // const setSerchValue = useCallback(
  //   (searchData: any) => {
  //     setSearchQuery(searchData);
  //     setPage(1);
  //     // FIXME
  //     //   setEventsList([]);
  //   },
  //   [searchQuery]
  // );

  // const getUserProfileAPI = async () => {
  //   const userId = await AsyncStorage.getItem(persistKeys.userProfileId);
  //   if (userId) {
  //     const userProfile = await getUserProfile(userId);
  //     if (userProfile) {
  //       setProfilePic(userProfile.pic);
  //       AsyncStorage.setItem(persistKeys.userProfilePic, userProfile.pic);
  //     }
  //   }
  // };

  const onNavigateToProfile = () => {
    navigation.push(Screens.MY_PROFILE);
  };

  const onBackPress = () => {
    navigation.pop();
  };

  return (
    <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
      {navigation.canGoBack() ? (
        <TouchableOpacity onPress={onBackPress} style={{ zIndex: 11111222222 }}>
          <View style={styles.row2}>
            <ImageComponent source={arrowLeft} style={styles.arrowLeft} />
          </View>
        </TouchableOpacity>
      ) : null}
      {/* <View style={styles.searchContainer}>
        <ImageComponent
          style={styles.searchIcon}
          source={Search}
        ></ImageComponent>
        <TextInput
          value={searchQuery}
          placeholderTextColor="#FFFF"
          placeholder="Search"
          style={styles.searchInput}
          onChangeText={(value) => {
            console.log(value);
            setSerchValue(value);
          }}
        ></TextInput>
      </View> */}
      <OneLogo
        localText={
          !HIDE_HEADER_SCREENS.includes(route?.name)
            ? "B o u l d e r"
            : "L o c a l"
        }
      />

      {!HIDE_HEADER_SCREENS.includes(route?.name) ? (
        <View style={styles.profileContainer}>
          {/* <ImageComponent
        style={styles.bellIcon}
        source={bell}></ImageComponent> */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNavigateToProfile}
            style={styles.profileView}
          >
            <ImageComponent
              resizeMode="cover"
              isUrl={!!profilePic}
              source={defaultUser}
              uri={profilePic}
              style={styles.profile}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
