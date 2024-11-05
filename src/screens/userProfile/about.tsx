import React from "react";
import { ListRenderItem, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { FlatListComponent } from "~/components/flatlist-component";
import { Pill } from "~/components/pill";
import { UserProfile } from "~/types/user-profile";
import { createStyleSheet } from "./style";

interface AboutDataProps {
  user: UserProfile;
}

export const About = ({ user }: AboutDataProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const renderItem: ListRenderItem<string> = ({ item }) => (
    <Pill pillStyle={styles.marginBottom} key={item} label={item} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.input}>{user.catchphrase}</Text>
      <View style={styles.innerContainer}>
        <Text style={styles.membership}>About</Text>
        <Text style={styles.input}>{user.about}</Text>
        <Text style={styles.membership}>{strings.skills}</Text>

        <View style={styles.row}>
          <FlatListComponent
            data={user.skills}
            keyExtractor={(item) => item.toString()}
            renderItem={renderItem}
            numColumns={100}
            showsHorizontalScrollIndicator={false}
            columnWrapperStyle={styles.flexWrap}
          />
        </View>
      </View>
    </View>
  );
};
