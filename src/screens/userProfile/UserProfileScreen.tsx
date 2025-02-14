/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { OneAvatar } from "~/components/avatar/OneAvatar";
import { Loader } from "~/components/loader";
import { TabComponent } from "~/components/tab-component";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { useUserService } from "~/network/api/services/useUserService";
import { MyEvents } from "../myprofile/MyEvents";
import { MyGroups } from "../myprofile/MyGroups";
import { About } from "./about";
import { createStyleSheet } from "./style";

export const UserProfileScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.USER_PROFILE>) => {
  const userId = route.params.id;
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    queries: { detail: getUser },
  } = useUserService();

  const { isPending, data: userProfile } = useQuery(getUser(userId));

  return (
    <>
      <Loader visible={isPending} />
      <View style={styles.container}>
        {userProfile ? (
          <>
            <View style={styles.rowOnly}>
              <OneAvatar user={userProfile} className="p-2" size="2xl" />

              <View style={styles.fullName}>
                <View style={styles.rowOnly}>
                  <Text style={styles.name}>{userProfile.firstName} </Text>
                  <Text style={styles.name}>{userProfile.lastName}</Text>
                </View>
              </View>
            </View>

            <View style={styles.innerContainer}>
              <Text>
                {`Home chapter: ${userProfile.homeChapter?.name ?? "None"}`}
              </Text>
            </View>

            <View style={styles.line} />
            <TabComponent
              tabs={[
                strings.about,
                `${userProfile.firstName}'s Events`,
                strings.groups,
              ]}
              onPressTab={setSelectedTab}
            />
            {navigation ? (
              <>
                {selectedTab === 0 && <About user={userProfile} />}
                {selectedTab === 1 && <MyEvents user={userProfile} />}
                {selectedTab === 2 && <MyGroups user={userProfile} />}
              </>
            ) : null}

            {/* <ScrollView showsVerticalScrollIndicator={false}>
            {selectedTab === 0 && <Recentabout userProfile={userProfile} />}
            {selectedTab === 1 && userId ? (
              <RecentMyEvents userId={userId} navigation={navigation} />
            ) : null}
          </ScrollView> */}
          </>
        ) : null}
      </View>
    </>
  );
};
