import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";

import { arrowLeft, dummy, onelogo } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { navigations } from "~/config/app-navigation/constant";

import { createStyleSheet } from "./style";

import { useAppTheme } from "~/app-hooks/use-app-theme";
import { persistKeys } from "~/network/constant";

interface NavbarProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  isLoggedIn?: boolean;
  isAvatarVisible?: boolean;
}
export const Navbar = ({
  navigation,
  isLoggedIn = true,
  isAvatarVisible = true,
}: NavbarProps) => {
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
    if (navigation) {
      // if (user?.id) {
      //   refetch().then((res) => {
      //     const userData = userProfileParsedData(res?.data?.data);
      //     console.log("check1===", userData);
      //     dispatch(onSetUser(userData));
      //   });
      // }
      navigation.navigate(navigations.PROFILE);
    }
  };

  const onBackPress = () => {
    navigation?.goBack();
  };

  return (
    <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
      {navigation?.canGoBack() ? (
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
      <View style={styles.oneContainer}>
        <ImageComponent
          style={styles.oneContainerImage}
          source={onelogo}
        ></ImageComponent>
        <View>
          <Text style={styles.oneContainerText}>NE</Text>
          {isLoggedIn ? (
            <Text style={styles.localText}>B o u l d e r</Text>
          ) : (
            <Text style={styles.localText}>L o c a l</Text>
          )}
        </View>
      </View>
      {isLoggedIn && isAvatarVisible ? (
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
              source={dummy}
              uri={profilePic}
              style={styles.profile}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
