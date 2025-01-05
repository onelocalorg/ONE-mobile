import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { OneUser } from "~/types/one-user";
import { ImageComponent } from "../image-component";
import { createStyleSheet } from "./style";

interface UserListViewerProps {
  users: OneUser[];
  onDeleteUser?: (user: OneUser) => void;
}
export const UserListViewer = ({
  users,
  onDeleteUser,
}: UserListViewerProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const handleDeleteUser = (user: OneUser) => {
    onDeleteUser!(user);
  };

  return (
    <>
      {users.map((user) => (
        <View key={user.id} style={styles.userDetailsCont}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.detailsSubCont}>
              <ImageComponent
                source={{ uri: user.pic }}
                resizeMode="cover"
                style={styles.userImage}
              />
              {onDeleteUser && (
                <Pressable onPress={() => handleDeleteUser(user)}>
                  <FontAwesomeIcon icon={faXmark} size={20} color="red" />
                </Pressable>
              )}
            </View>
          </View>
          <View style={styles.userNameCont}>
            <Text style={styles.usernameLbl}>{user.firstName}</Text>
            <Text style={styles.usernameLbl}>{user.lastName}</Text>
          </View>
        </View>
      ))}
    </>
  );
};
