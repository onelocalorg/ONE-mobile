import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Map } from "~/components/map/Map";
import { Navbar } from "~/components/navbar/Navbar";
import { navigations } from "~/config/app-navigation/constant";
import { LocalEventData } from "~/types/local-event-data";

interface MapScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const MapScreen = (props: MapScreenProps) => {
  const { navigation } = props || {};

  const onNavigate = (item: LocalEventData) => {
    navigation?.navigate(navigations.EVENT_DETAIL, { id: item?.id });
  };

  return (
    <View style={{ flex: 1 }}>
      <Navbar
        navigation={
          navigation as unknown as NavigationContainerRef<ParamListBase>
        }
      />
      <Map onClicked={onNavigate} />
    </View>
  );
};
