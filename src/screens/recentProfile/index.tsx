/* eslint-disable react-hooks/exhaustive-deps */
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { dummy } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Navbar } from "~/components/navbar/Navbar";
import { getUserProfile } from "~/network/api/services/user-service";
import { UserProfile } from "~/types/user-profile";
import { Recentabout } from "./about";
import { RecentMyEvents } from "./my-events";
import { createStyleSheet } from "./style";

interface RecentProfileScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
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
    if (userId) {
      getUserProfile(userId).then(setUserProfile);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} isAvatarVisible={false} />

      {userProfile ? (
        <>
          <ImageComponent
            isUrl={!!userProfile.pic}
            resizeMode="cover"
            uri={userProfile.pic}
            source={dummy}
            style={styles.profile}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedTab === 0 && <Recentabout userProfile={userProfile} />}
            {selectedTab === 1 && userId ? (
              <RecentMyEvents userId={userId} navigation={navigation} />
            ) : null}
          </ScrollView>
        </>
      ) : null}
    </View>
  );
};
