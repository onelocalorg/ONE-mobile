import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ListRenderItem,
  LogBox,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { useToken } from "~/app-hooks/use-token";
import { arrowLeft, onelogo } from "~/assets/images";
import { FlatListComponent } from "~/components/flatlist-component";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { Pill } from "~/components/pill";
import { createStyleSheet } from "./style";

interface RecentaboutDataProps {
  ref: React.Ref<unknown> | undefined;
  about: string;
  skills: string[];
  profileAnswers: any[];
  idUser: string;
  onEditProfile?: (data: { about?: string; skills?: string[] }) => void;
  navigation: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      id: string;
    };
  };
}

export const Recentabout = (props: RecentaboutDataProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const { about, skills, profileAnswers, idUser, route, navigation } =
    props || {};
  const [updatedAbout, setAbout] = useState(about);
  const [allSkills, setSkills] = useState(skills);
  const [skillValue, setSkillValue]: any = useState("");
  const [isLoading, LodingData] = useState(false);
  const [profileUri, setProfileUri] = useState("");
  const [updatedBio, setBio] = useState("");
  const [recentUser, recentUserDetail]: any = useState([]);
  const { token } = useToken();
  const { id } = route?.params ?? {};
  const [openQues, quesAnsModal] = useState(false);
  var [ansQueData, submitAnsState] = useState(profileAnswers);
  var [ansQueDataTwo, submitAnsStateTwo] = useState(profileAnswers);
  const {} = props || {};
  useEffect(() => {
    LodingData(true);
    userRecentProfileUpdate();
    setAbout(about);
    setSkills(skills);
  }, [about, skills]);

  // =================Update Answer API====================

  async function userRecentProfileUpdate() {
    const token = await AsyncStorage.getItem("token");
    const userID = await AsyncStorage.getItem("recentUserId");
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/users/userprofile/" + userID,
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        }
      );
      const dataItem = await response.json();
      submitAnsState(dataItem?.data?.profile_answers);
      recentUserDetail(dataItem?.data);
      setAbout(dataItem?.about);
      setSkills(dataItem?.skills);
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  const updateAnsBack = () => {
    quesAnsModal(false);
  };

  const handleRemove = (id: any) => {
    const newPeople = allSkills.filter((person) => person !== id);

    setSkills(newPeople);
  };

  const onAddSkill = (text: any) => {
    if (text !== "" && text !== undefined) {
      setSkills([...allSkills, text]);
      setSkillValue("");
    }
  };

  const renderItem: ListRenderItem<string> = ({ item }) => (
    <Pill pillStyle={styles.marginBottom} key={item} label={item} />
  );

  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

  function handleToggleYourList(name: any, jindex: any) {
    let newArr = ansQueDataTwo.map((item, index) => {
      const target: Partial<typeof item> = { ...item };
      delete target["question"];

      if (index == jindex) {
        return { ...target, answer: name };
      } else {
        return target;
      }
    });
    let newArrs = ansQueDataTwo.map((item, index) => {
      const target: Partial<typeof item> = { ...item };

      if (index == jindex) {
        return { ...target, answer: name };
      } else {
        return target;
      }
    });
    submitAnsState(newArr);
    submitAnsStateTwo(newArrs);
  }

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
          <TouchableOpacity style={styles.row2} onPress={onBackPress}>
            <View>
              <ImageComponent source={arrowLeft} style={styles.arrowLeft} />
            </View>
          </TouchableOpacity>
          <View style={styles.oneContainer}>
            <ImageComponent
              style={styles.oneContainerImage}
              source={onelogo}
            ></ImageComponent>
            <View>
              <Text style={styles.oneContainerText}>NE</Text>
              <Text style={styles.localText}>L o c a l</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <TouchableOpacity activeOpacity={1}>
            <ImageComponent
              isUrl={!!recentUser?.pic}
              resizeMode="cover"
              uri={recentUser?.pic}
              // source={dummy}
              style={styles.profile}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text style={styles.name}>
            {recentUser?.first_name} {recentUser?.last_name}
          </Text>
          <View style={styles.circularView}>
            <Text style={styles.des}>{recentUser?.status}</Text>
          </View>
        </View>
        <View style={styles.aboutView}>
          <Text style={styles.input}>{recentUser?.bio}</Text>
        </View>
        <View style={styles.line} />
      </View>
      <View style={styles.innerConatiner}>
        <Loader visible={false} showOverlay />
        <Text style={styles.membership}>About</Text>
        <Text style={styles.input}>{recentUser?.about}</Text>
        <Text style={styles.membership}>{strings.skills}</Text>

        <View style={styles.row}>
          <FlatListComponent
            data={recentUser?.skills}
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
                data={recentUser?.profile_answers}
                renderItem={({ item }) => (
                  <View>
                    {item.length != 0 ? (
                      <View>
                        <Text style={styles.questionsDisplayLbl}>
                          {item.question}
                        </Text>
                        <Text style={styles.answerDisplayCont}>
                          {item.answer}
                        </Text>
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
