import React from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { UserListHorizontal } from "~/components/user-list-horizontal";
import { Group } from "~/types/group";
import { OneUser } from "~/types/one-user";
import { createStyleSheet } from "./style";

interface AboutProps {
  group: Group;
}

export const AboutGroup = ({ group }: AboutProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);

  const handleOnDeleteUser = (user: OneUser) => {};

  return (
    <View style={styles.container}>
      <Text style={styles.input}>{strings.details}</Text>
      <Text style={styles.input}>{group.details}</Text>
      <Text style={styles.input}>{strings.admins}</Text>
      <UserListHorizontal users={group.admins} />
    </View>
  );
};
