import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import React, { useState } from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { defaultUser } from "~/assets/images";
import { createStyleSheet } from "~/components/user-list-searchable/style";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { GroupMutations } from "~/network/api/services/useGroupService";
import { useUserService } from "~/network/api/services/useUserService";
import { Group, GroupUpdateData } from "~/types/group";
import { OneUser } from "~/types/one-user";
import { ImageComponent } from "../image-component";

export const UserListSearchable = ({
  route,
}: RootStackScreenProps<Screens.SELECT_USERS>) => {
  const { groupId, type, users } = route.params;

  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [searchText, setSearchText] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(users || []);

  const {
    queries: { list: listUsers },
  } = useUserService();

  const { isLoading, data: allUsers } = useQuery(
    listUsers({
      search: searchText,
    })
  );

  const { mutate: updateGroup } = useMutation<Group, Error, GroupUpdateData>({
    mutationKey: [GroupMutations.editGroup],
  });

  const separatedUsers = allUsers
    ? Object.entries(
        _.groupBy((user: OneUser) => user.firstName.charAt(0), allUsers)
      ).sort()
    : [];

  const toggleSelectUser = (user: OneUser) => {
    if (selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }

    if (groupId) {
      updateGroup({
        id: groupId,
        [type]: selectedUsers.map((u) => ({ id: u.id })),
      });
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
