import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import React, { useState } from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { defaultUser } from "~/assets/images";
import { createStyleSheet } from "~/components/user-list-searchable/style";
import { useUserService } from "~/network/api/services/useUserService";
import { OneUser } from "~/types/one-user";
import { ImageComponent } from "../image-component";

interface UserListSearchableProps {
  curSelectedUsers?: OneUser[];
  onSelectUsers?: (users: OneUser[]) => void;
}
export const UserListSearchable = ({
  curSelectedUsers,
  onSelectUsers,
}: UserListSearchableProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [searchText, setSearchText] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(curSelectedUsers || []);

  const {
    queries: { list: listUsers },
  } = useUserService();

  const { isLoading, data: users } = useQuery(
    listUsers({
      search: searchText,
    })
  );

  console.log("users", users);

  const separatedUsers = users
    ? Object.entries(
        _.groupBy((user: OneUser) => user.firstName.charAt(0), users)
      ).sort()
    : [];

  console.log("separatedUsers", JSON.stringify(separatedUsers));

  const toggleSelectUser = (user: OneUser) => {
    if (selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <>
      <View style={styles.searchContainer}>
        <FontAwesomeIcon
          icon={faSearch}
          size={20}
          color={theme.colors.lightGray}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          onChangeText={setSearchText}
          placeholder="Search name"
          placeholderTextColor={theme.colors.lightGray}
        />
      </View>
      <SectionList
        style={styles.container}
        sections={separatedUsers.map(([key, value]) => ({
          title: key,
          data: value,
        }))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleSelectUser(item)}>
            <View style={styles.userDetailsCont}>
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 10,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <View style={styles.detailsSubCont}>
                    <ImageComponent
                      resizeMode="cover"
                      style={styles.userImage}
                      isUrl={!!item?.pic}
                      uri={item?.pic}
                      source={defaultUser}
                    />
                  </View>
                  <Text style={styles.usernameLbl}>
                    {item.firstName} {item.lastName}
                  </Text>
                </View>
                {selectedUsers.find((u) => u.id === item.id) ? (
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    size={32}
                    color={theme.colors.darkGreen}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCircle}
                    size={32}
                    color={theme.colors.lightGray}
                  />
                )}
              </View>
            </View>
          </Pressable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      ></SectionList>
    </>
  );
};
