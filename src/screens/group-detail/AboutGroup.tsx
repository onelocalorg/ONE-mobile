import React from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
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
      <Text style={styles.input}>{group.details}</Text>
      <Text style={styles.input}>{strings.admins}</Text>
    </View>
  );
};
