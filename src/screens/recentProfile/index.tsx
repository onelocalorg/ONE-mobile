/* eslint-disable react-hooks/exhaustive-deps */
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { dummy } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Navbar } from "~/components/navbar/Navbar";
import { TabComponent } from "~/components/tab-component";
import { getUserProfile } from "~/network/api/services/user-service";
import { UserProfile } from "~/types/user-profile";
import { handleApiError } from "~/utils/common";
import { About } from "../profile/about";
import { MyEvents } from "../profile/my-events";
import { createStyleSheet } from "./style";

interface RecentProfileScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      userId: string;
    };
  };
}

export const RecentProfileScreen = ({
  navigation,
  route,
}: RecentProfileScreenProps) => {
  const userId = route?.params.userId;
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
      <Navbar navigation={navigation} />

      {userProfile ? (
        <>
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

          <View style={styles.line} />
          <TabComponent
            tabs={[strings.about, strings.myEvents]}
            onPressTab={setSelectedTab}
          />
          {navigation ? (
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              {selectedTab === 0 && (
                <About user={userProfile} navigation={navigation} />
              )}
              {selectedTab === 1 && (
                <MyEvents user={userProfile} navigation={navigation} />
              )}
            </KeyboardAwareScrollView>
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
