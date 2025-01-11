import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { OneUser } from "~/types/one-user";
import { ImageComponent } from "../image-component";
import { createStyleSheet } from "./style";

interface UserListHorizontalProps {
  users: OneUser[];
  onRemoveUser?: (user: OneUser) => void;
}
export const UserListHorizontal = ({
  users,
  onRemoveUser,
}: UserListHorizontalProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const handleRemoveUser = (user: OneUser) => {
    onRemoveUser!(user);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
      }}
    >
      {users.map((user) => (
        <View key={user.id} style={styles.userDetailsCont}>
          <View style={styles.detailsSubCont}>
            <ImageComponent
              source={{ uri: user.pic }}
              resizeMode="cover"
              style={styles.userImage}
            />
            {onRemoveUser && (
              <Pressable onPress={() => handleRemoveUser(user)}>
                <FontAwesomeIcon icon={faXmark} size={20} color="red" />
              </Pressable>
            )}
          </View>
          <View style={styles.userNameCont}>
            <Text style={styles.usernameLbl}>{user.firstName}</Text>
            <Text style={styles.usernameLbl}>{user.lastName}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};
