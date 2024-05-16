import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StoreType } from "~/network/reducers/store";

import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { arrowLeft, dummy, onelogo } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { navigations } from "~/config/app-navigation/constant";
import { useUserProfile } from "~/network/hooks/user-service-hooks/use-user-profile";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";

import { createStyleSheet } from "./style";

import { useAppTheme } from "~/app-hooks/use-app-theme";
import { LOG } from "~/config";

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
  const [page, setPage] = useState(1);
  const [profileData, setUserProfile]: any = useState();

  useEffect(() => {
    getUserProfileAPI();
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

  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { id: string; pic: string } };
  const { refetch } = useUserProfile({
    userId: user?.id,
  });

  const dispatch = useDispatch();

  const getUserProfileAPI = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/users/" + user.id,
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        }
      );
      const dataItem = await response.json();
      setUserProfile(dataItem.data);
      if (dataItem?.data?.isEventActiveSubscription === true) {
        AsyncStorage.setItem("isEventActive", "true");
      } else {
        AsyncStorage.setItem("isEventActive", "false");
      }
      AsyncStorage.setItem("profile", dataItem.data.pic);
      AsyncStorage.setItem("uniqueId", dataItem.data.user_unique_id);
    } catch (error) {
      LOG.error("gertUserProfileAPI", error);
    }
  };

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
              isUrl={!!profileData?.pic}
              source={dummy}
              uri={profileData?.pic}
              style={styles.profile}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
