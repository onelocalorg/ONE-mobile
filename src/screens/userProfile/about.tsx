import React from "react";
import { ListRenderItem, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { FlatListComponent } from "~/components/flatlist-component";
import { Pill } from "~/components/pill";
import { UserProfile } from "~/types/user-profile";
import { createStyleSheet } from "./style";

interface RecentaboutDataProps {
  user: UserProfile;
}

export const About = ({ user }: RecentaboutDataProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const renderItem: ListRenderItem<string> = ({ item }) => (
    <Pill pillStyle={styles.marginBottom} key={item} label={item} />
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.aboutView}>
          <Text style={styles.input}>{user.catchPhrase}</Text>
        </View>
        <View style={styles.line} />
      </View>
      <View style={styles.innerConatiner}>
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

        {/* ==========================Question Answer========================  */}

        <View>
          <View>
            <TouchableOpacity activeOpacity={1}>
              <Text style={styles.ProfileUpdateCont}>
                Question & Answer List
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};
