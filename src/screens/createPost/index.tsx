import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { blackOffer, greenOffer, request, requestGreen } from "~/assets/images";
import { DatePickerRefProps } from "~/components/date-range-picker";
import { ImageComponent } from "~/components/image-component";
import { Navbar } from "~/components/navbar/Navbar";
import { getData } from "~/network/constant";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { CreatePostGratisScreen } from "./gratis";
import { CreatePostOfferScreen } from "./offer";
import { CreatePostRequestScreen } from "./request";
import { createStyleSheet } from "./style";

interface CreatePostScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
}

export const CreatePostScreen = (props: CreatePostScreenProps) => {
  const { navigation } = props || {};
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [selecttype, createPostSelectType] = useState(
    getData("POST_TAB_OPEN_INDEX")
  );
  console.log("selectType", selecttype);
  const [type, setType] = useState("offer");
  const [typeIconWhat, setTypeIconWhat]: any = useState();
  const [showWhatPopover, setShowWhatPopover] = useState(false);
  const [resourceList, setResourceList]: any = useState([]);
  const [whatSelectType, setWhatSelectType]: any = useState();
  const [postImage, setCreatePostUri]: any = useState([]);
  const [imageKey, setImageKey] = useState();
  const [typeIconFor, setTypeIconFor]: any = useState();
  const [whatForType, setWhatForType]: any = useState();
  const [isLoading, LodingData] = useState(false);
  const datePickerRef: React.Ref<DatePickerRefProps> = useRef(null);
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { id: string; pic: string; city: string; state: string } };

  // useEffect(() => {
  //   LogBox.ignoreAllLogs();
  //   getResourcesAPI();
  //   // getUserProfileAPI();
  // }, []);

  const createPostSetType = (text: any, type: any) => {
    createPostSelectType(text);
    setType(type);
  };

  const selectWhatTypePost = (icon: any, type: any) => {
    setTypeIconWhat(icon);
    setWhatSelectType(type);
    setShowWhatPopover(false);
  };

  // const getResourcesAPI = async () => {
  //   const token = await AsyncStorage.getItem("token");
  //   try {
  //     const response = await fetch(
  //       process.env.API_URL + "/v1/posts/resources",
  //       {
  //         method: "get",
  //         headers: new Headers({
  //           Authorization: "Bearer " + token,
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         }),
  //       }
  //     );
  //     const dataItem = await response.json();
  //     console.log(
  //       "-------------------Get Resources API Response---------------------"
  //     );
  //     console.log(dataItem);
  //     setResourceList(dataItem?.data);
  //     setTypeIconWhat(dataItem?.data[0]["icon"]);
  //     setTypeIconFor(dataItem?.data[0]["icon"]);
  //     setWhatForType(dataItem?.data[0]["value"]);
  //     setWhatSelectType(dataItem?.data[0]["value"]);
  //     console.log(
  //       dataItem?.data[0]["icon"],
  //       "------------icon image--------------"
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <>
      <Navbar navigation={navigation} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.postFilter}>
            <TouchableOpacity
              style={styles.container3}
              activeOpacity={1}
              onPress={() => createPostSetType(1, "offer")}
            >
              <ImageComponent
                source={selecttype == 1 ? greenOffer : blackOffer}
                style={styles.icon1}
              />
              <Text style={[selecttype === 1 ? styles.label3 : styles.label4]}>
                Offer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.container3}
              activeOpacity={0.8}
              onPress={() => createPostSetType(2, "request")}
            >
              <ImageComponent
                source={selecttype === 2 ? requestGreen : request}
                style={styles.icon1}
              />
              <Text style={[selecttype == 2 ? styles.label3 : styles.label4]}>
                Request
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.container3}
              activeOpacity={0.8}
              onPress={() => createPostSetType(3, "gratis")}
            >
              <ImageComponent
                resizeMode="cover"
                source={selecttype === 3 ? gratisGreen : gratitudeBlack}
                style={styles.icon1}
              />
              <Text style={[selecttype == 3 ? styles.label3 : styles.label4]}>
                Gratis
              </Text>
            </TouchableOpacity> */}
          </View>
          {selecttype === 1 && (
            <CreatePostOfferScreen
              // about={about}
              // idUser={user?.id}
              // skills={skills}
              // profileAnswers={profile_answers}
              // onEditProfile={onSaveProfile}
              navigation={navigation}
              // ref={undefined}
            />
          )}
          {selecttype === 2 && (
            <CreatePostRequestScreen navigation={navigation} />
          )}
          {selecttype === 3 && (
            <CreatePostGratisScreen navigation={navigation} />
          )}
        </ScrollView>
      </KeyboardAwareScrollView>
    </>
  );
};
