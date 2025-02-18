import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { OneUser } from "~/types/one-user";
import { OneAvatar } from "../avatar/OneAvatar";
import { Center } from "../ui/center";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
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
  const { gotoUserProfile } = useNavigations();

  const handleRemoveUser = (user: OneUser) => {
    onRemoveUser!(user);
  };

  return (
    <ScrollView horizontal={true}>
      <HStack>
        {users.map((user) => (
          <Center key={user.id}>
            <Pressable onPress={gotoUserProfile(user.id)}>
              <VStack className="mx-4 items-center">
                <View style={styles.detailsSubCont}>
                  <OneAvatar user={user} size="md" />
                  {onRemoveUser && (
                    <Pressable onPress={() => handleRemoveUser(user)}>
                      <FontAwesomeIcon icon={faXmark} size={20} color="red" />
                    </Pressable>
                  )}
                </View>
                <VStack>
                  <Center>
                    <Text size="sm">{user.firstName}</Text>
                    <Text size="sm">{user.lastName}</Text>
                  </Center>
                </VStack>
              </VStack>
            </Pressable>
          </Center>
        ))}
      </HStack>
    </ScrollView>
  );
};
