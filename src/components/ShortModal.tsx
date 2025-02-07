import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, View } from "react-native";

type ShortModalProps = {
  height: number;
  children: React.ReactNode;
};
export const ShortModal = ({ height, children }: ShortModalProps) => {
  const navigation = useNavigation();

  const dismissModal = () => {
    navigation.goBack();
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <Pressable onPress={dismissModal}>
          <View
            style={{
              height,
              backgroundColor: "#fff",
              justifyContent: "center",
            }}
          >
            {children}
          </View>
        </Pressable>
      </View>
    </>
  );
};

export const ShortModalScreenOptions = {
  gestureResponseDistance: 800,
  cardStyle: {
    backgroundColor: "transparent",
    opacity: 0.99,
  },
};
