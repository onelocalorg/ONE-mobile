import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Map } from "~/components/map/Map";
import { Navbar } from "~/components/navbar/Navbar";
import { navigations } from "~/config/app-navigation/constant";
import { LocalEvent } from "~/types/local-event";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";

interface MapScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const MapScreen = (props: MapScreenProps) => {
  const { navigation } = props || {};

  const onNavigateToEvent = (item: LocalEvent) => {
    navigation?.push(navigations.EVENT_DETAIL, { id: item?.id });
  };

  const onNavigateToPost = (item: Post) => {
    navigation.push(navigations.COMMENTLIST, {
      postData: item,
    });
  };

  const onNavigateToUserProfile = (user: OneUser) => {
    navigation.push(navigations.RECENTUSERPROFILE, { userId: user.id });
  };

  return (
    <View style={{ flex: 1 }}>
      <Navbar navigation={navigation} />
      <Map
        onEventPress={onNavigateToEvent}
        onPostPress={onNavigateToPost}
        onAvatarPress={onNavigateToUserProfile}
      />
    </View>
  );
};
