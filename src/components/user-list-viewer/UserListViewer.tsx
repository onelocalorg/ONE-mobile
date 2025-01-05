import React from "react";
import { ImageComponent, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { redDeleteIcon } from "~/assets/images";
import { OneUser } from "~/types/one-user";
import { createStyleSheet } from "./style";

interface UserListViewerProps {
  users: OneUser[];
  onDeleteUser: (user: OneUser) => void;
}
export const UserListViewer = ({
  users,
  onDeleteUser,
}: UserListViewerProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const handleDeleteUser = (user: OneUser) => {
    onDeleteUser(user);
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
              <TouchableOpacity onPress={() => handleDeleteUser(user)}>
                <ImageComponent
                  source={redDeleteIcon}
                  style={styles.deleteIcon}
                />
              </TouchableOpacity>

              <ImageComponent
                source={{ uri: user.pic }}
                resizeMode="cover"
                style={styles.userImage}
              />
              <View style={styles.userNameCont}>
                <Text style={styles.usernameLbl}>
                  {user.firstName} {user.lastName}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </>
  );
};
