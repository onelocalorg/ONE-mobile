import React from "react";
import { View } from "react-native";
import { Map } from "~/components/map/Map";
import { MapStackScreenProps, Screens } from "~/navigation/types";
import { LocalEvent } from "~/types/local-event";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";

export const MapScreen = ({ navigation }: MapStackScreenProps<Screens.MAP>) => {
  const navigateToEventDetail = (event: LocalEvent) => {
    navigation.push(Screens.MAIN_TABS, {
      screen: Screens.EVENTS_STACK,
      params: {
        screen: Screens.EVENT_DETAIL,
        params: { id: event.id },
      },
    });
  };

  const navigateToPostDetail = (post: Post) => {
    console.log("click");
    navigation.push(Screens.MAIN_TABS, {
      screen: Screens.HOME_STACK,
      params: {
        screen: Screens.POST_DETAIL,
        params: { id: post.id },
      },
    });
  };
  const navigateToUserProfile = (user: OneUser) => {
    navigation.push(Screens.USER_PROFILE, { id: user.id });
  };

  return (
    <View style={{ flex: 1 }}>
      <Map
        onEventPress={navigateToEventDetail}
        onPostPress={navigateToPostDetail}
        onAvatarPress={navigateToUserProfile}
      />
    </View>
  );
};
