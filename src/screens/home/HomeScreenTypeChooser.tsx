import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { createStyleSheet } from "./style";

export const HomeScreenTypeChooser = ({
  onGroupsChosen,
}: {
  onGroupsChosen: (isGroupsChosen: boolean) => void;
}) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [isGroupsChosen, setGroupsChosen] = React.useState(false);

  const notifySetGroupsChosen = (newSetting: boolean) => {
    if (isGroupsChosen !== newSetting) {
      onGroupsChosen(newSetting);
      setGroupsChosen(newSetting);
    }
  };

  const postsButtonStyle = isGroupsChosen
    ? styles.button
    : { ...styles.button, ...styles.buttonPressed };
  const groupsButtonStyle = isGroupsChosen
    ? { ...styles.button, ...styles.buttonPressed }
    : styles.button;

  return (
    <>
      <View style={styles.buttonContainer}>
        <Pressable onPress={() => notifySetGroupsChosen(false)}>
          <View style={postsButtonStyle}>
            <Text style={styles.buttonText}>Posts</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => notifySetGroupsChosen(true)}>
          <View style={groupsButtonStyle}>
            <Text style={styles.buttonText}>Groups</Text>
          </View>
        </Pressable>
      </View>
    </>
  );
};
