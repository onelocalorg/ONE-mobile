import React from "react";
import { Text, View } from "react-native";
import Markdown from "react-native-markdown-display";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { Box } from "~/components/ui/box";
import { UserListHorizontal } from "~/components/user-list-horizontal";
import { Group } from "~/types/group";
import { createStyleSheet } from "./style";

interface AboutProps {
  group: Group;
}

export const AboutGroup = ({ group }: AboutProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.input}>{strings.details}</Text>
      <Box className="px-4">
        <Markdown>{group.details}</Markdown>
      </Box>
      <Text style={styles.input}>{strings.admins}</Text>
      <UserListHorizontal users={group.admins} />
      <Text style={styles.input}>{strings.members}</Text>
      <UserListHorizontal users={group.members} />
    </View>
  );
};
