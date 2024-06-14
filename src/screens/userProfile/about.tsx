import React, { useEffect } from "react";
import {
  FlatList,
  ListRenderItem,
  LogBox,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { FlatListComponent } from "~/components/flatlist-component";
import { Loader } from "~/components/loader";
import { Pill } from "~/components/pill";
import { UserProfile } from "~/types/user-profile";
import { createStyleSheet } from "./style";

interface RecentaboutDataProps {
  userProfile: UserProfile;
}

export const Recentabout = ({ userProfile }: RecentaboutDataProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const renderItem: ListRenderItem<string> = ({ item }) => (
    <Pill pillStyle={styles.marginBottom} key={item} label={item} />
  );

  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.name}>
            {userProfile.first_name} {userProfile.last_name}
          </Text>
          {/* <View style={styles.circularView}>
            <Text style={styles.des}>{userProfile.status}</Text>
          </View> */}
        </View>
        <View style={styles.aboutView}>
          <Text style={styles.input}>{userProfile.catch_phrase}</Text>
        </View>
        <View style={styles.line} />
      </View>
      <View style={styles.innerConatiner}>
        <Loader visible={false} showOverlay />
        <Text style={styles.membership}>About</Text>
        <Text style={styles.input}>{userProfile.about}</Text>
        <Text style={styles.membership}>{strings.skills}</Text>

        <View style={styles.row}>
          <FlatListComponent
            data={userProfile.skills}
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
            <View style={{ marginBottom: 30 }}>
              <FlatList
                data={userProfile.profile_answers}
                renderItem={({ item }) => (
                  <View>
                    {item.length != 0 ? (
                      <View>
                        {/* <Text style={styles.questionsDisplayLbl}>x
                          {item.question}
                        </Text>
                        <Text style={styles.answerDisplayCont}>
                          {item.answer}
                        </Text> */}
                      </View>
                    ) : (
                      <View></View>
                    )}
                  </View>
                )}
              ></FlatList>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
