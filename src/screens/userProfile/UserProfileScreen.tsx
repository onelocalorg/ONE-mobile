/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { dummy } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { TabComponent } from "~/components/tab-component";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { useChapterService } from "~/network/api/services/useChapterService";
import { useUserService } from "~/network/api/services/useUserService";
import { findChapter } from "~/utils/common";
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
  const {
    queries: { list: listChapters },
  } = useChapterService();

  const { data: chapters } = useQuery(listChapters());

  return (
    <>
      <Loader visible={isPending} />
      <View style={styles.container}>
        {userProfile ? (
          <>
            <View style={styles.rowOnly}>
              <ImageComponent
                isUrl={!!userProfile.pic?.url}
                resizeMode="cover"
                uri={userProfile.pic?.url}
                source={dummy}
                style={styles.profile}
              />
              <View style={styles.fullName}>
                <View style={styles.rowOnly}>
                  <Text style={styles.name}>{userProfile.firstName} </Text>
                  <Text style={styles.name}>{userProfile.lastName}</Text>
                </View>
              </View>
            </View>

            <View style={styles.innerContainer}>
              <Text>
                Home chapter:{" "}
                {userProfile.chapterId
                  ? findChapter(userProfile.chapterId, chapters)?.name
                  : "None"}
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
