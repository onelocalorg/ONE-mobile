/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { dummy } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { TabComponent } from "~/components/tab-component";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { getUserProfile } from "~/network/api/services/user-service";
import { UserProfile } from "~/types/user-profile";
import { handleApiError } from "~/utils/common";
import { About } from "../myprofile/about";
import { MyEvents } from "../myprofile/my-events";
import { createStyleSheet } from "./style";

export const UserProfileScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.USER_PROFILE>) => {
  const userId = route.params.id;
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    retrieveUser();
  }, []);

  const retrieveUser = async () => {
    try {
      if (userId) {
        const userProfile = await getUserProfile(userId);
        setUserProfile(userProfile);
      }
    } catch (e) {
      handleApiError("Error retrieving user", e);
    }
  };

  return (
    <View style={styles.container}>
      {userProfile ? (
        <>
          <View style={styles.rowOnly}>
            <ImageComponent
              isUrl={!!userProfile.pic}
              resizeMode="cover"
              uri={userProfile.pic}
              source={dummy}
              style={styles.profile}
            />
            <View style={styles.fullName}>
              <View style={styles.rowOnly}>
                <Text style={styles.name}>{userProfile.first_name} </Text>
                <Text style={styles.name}>{userProfile.last_name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.line} />
          <TabComponent
            tabs={[strings.about, `${userProfile.first_name}'s Events`]}
            onPressTab={setSelectedTab}
          />
          {navigation ? (
            <>
              {selectedTab === 0 && <About user={userProfile} />}
              {selectedTab === 1 && <MyEvents user={userProfile} />}
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
  );
};
