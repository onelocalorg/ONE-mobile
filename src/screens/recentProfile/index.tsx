/* eslint-disable react-hooks/exhaustive-deps */
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { useToken } from "~/app-hooks/use-token";
import { StoreType } from "~/network/reducers/store";
import {
  UserProfileState,
  onSetCoverImage,
} from "~/network/reducers/user-profile-reducer";
import { Recentabout } from "./about";
import { RecentMyEvents } from "./my-events";
import { createStyleSheet } from "./style";

interface UserData {
  id: string;
  bio: string;
  name: string;
  pic: string;
  status: string;
  about: string;
  skills: string[];
  userType: string;
  isActiveSubscription: boolean;
  coverImage: string;
  profile_answers: string[];
}

interface RecentProfileScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const RecentProfileScreen = (props: RecentProfileScreenProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const { navigation } = props || {};
  const [selectedTab, setSelectedTab] = useState(0);
  const [profileUri, setProfileUri] = useState("");
  const [updatedBio, setBio] = useState("");
  const [isLoading, LodingData] = useState(false);
  var [recentUser, submitAnsState] = useState();
  var [ansQueDataTwo, submitAnsStateTwo] = useState();
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: UserData };
  const { about, bio, name, pic, skills, status, id, profile_answers } =
    user || {};
  const dispatch = useDispatch();
  const { token } = useToken();
  useEffect(() => {
    setBio(bio);
    setProfileUri(pic);
  }, [bio, pic]);

  useEffect(() => {
    userProfileUpdate();
    return () => {
      dispatch(onSetCoverImage(""));
    };
  }, []);

  const onBackPress = () => {
    navigation.goBack();
  };

  async function userProfileUpdate() {
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/users/userprofile/5f61a3b16f61450a2bb888e8",
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
        }
      );
      const dataItem = await response.json();
      submitAnsState(dataItem?.data);

      const { success, data } = dataItem || {};
      if (success) {
        const { about, bio, name, pic, skills, status, id, profile_answers } =
          data || {};
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 0 && (
          <Recentabout
            about={about}
            idUser={user?.id}
            skills={skills}
            profileAnswers={profile_answers}
            navigation={navigation}
            ref={undefined}
          />
        )}
        {selectedTab === 1 && (
          <RecentMyEvents userId={id} navigation={navigation} />
        )}
      </ScrollView>
    </View>
  );
};
