import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Map } from "~/components/map/Map";
import { Navbar } from "~/components/navbar/Navbar";

interface MapScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const MapScreen = (props: MapScreenProps) => {
  const { navigation } = props || {};

  return (
    <View style={{ flex: 1 }}>
      <Navbar
        navigation={
          navigation as unknown as NavigationContainerRef<ParamListBase>
        }
      />
      <Map />
    </View>
  );
};
