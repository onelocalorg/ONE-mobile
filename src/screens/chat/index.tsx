import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { Navbar } from "~/components/navbar/Navbar";
import { createStyleSheet } from "./style";

interface ChatScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const ChatScreen = ({ navigation }: ChatScreenProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();

  return (
    <View style={styles.chatContainer}>
      <Navbar navigation={navigation} />
      <Text style={styles.text}>
        This is the beginning of your chat messages.
      </Text>
    </View>
  );
};
