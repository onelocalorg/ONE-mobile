import React from "react";
import { View } from "react-native";
import { useNavigations } from "~/app-hooks/useNavigations";
import { Map } from "~/components/map/Map";

export const MapScreen = () => {
  const { gotoUserProfile, gotoPostDetails, gotoEventDetails } =
    useNavigations();

  return (
    <View style={{ flex: 1 }}>
      <Map
        onEventPress={gotoEventDetails}
        onPostPress={gotoPostDetails}
        onAvatarPress={gotoUserProfile}
      />
    </View>
  );
};
