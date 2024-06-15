import React from "react";
import { View } from "react-native";
import { Map } from "~/components/map/Map";
import { MapStackScreenProps, Screens } from "~/navigation/types";
import { LocalEvent } from "~/types/local-event";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";

export const MapScreen = ({ navigation }: MapStackScreenProps<Screens.MAP>) => {
  const navigateToEventDetail = (event: LocalEvent) => {
    navigation.push(Screens.EVENT_DETAIL, { id: event.id });
  };

  const navigateToPostDetail = (post: Post) => {
    navigation.push(Screens.POST_DETAIL, { id: post.id });
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
