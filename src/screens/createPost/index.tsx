import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  LogBox,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { blackOffer, greenOffer, request, requestGreen } from "~/assets/images";
import { DatePickerRefProps } from "~/components/date-range-picker";
import { ImageComponent } from "~/components/image-component";
import { Navbar } from "~/components/navbar/Navbar";
import { getData } from "~/network/constant";
import { useUserProfile } from "~/network/hooks/user-service-hooks/use-user-profile";
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
  const { strings } = useStringsAndLabels();
  const [selecttype, createPostSelectType] = useState(
    getData("POST_TAB_OPEN_INDEX")
  );
  console.log("selectType", selecttype);
  const [type, createPostType] = useState("offer");
  const [typeIconWhat, getTypeIconWhat]: any = useState();
  const [showWhatPopover, setWhatShowPopover] = useState(false);
  const [getResourceList, getResourseData]: any = useState([]);
  const [whatSelectType, getWhatTypeValue]: any = useState();
  const [postImage, setCreatePostUri]: any = useState([]);
  const [forName, createPostforName] = useState("");
  const [forQuantity, createPostforQuantity] = useState("");
  const [whereAddress, createPostwhereAddress] = useState("");
  const [imageKey, selectedImageKey] = useState();
  const [when, createPostwhen] = useState(new Date());
  const [content, createPostcontent] = useState("");
  const [tags, createPosttags] = useState("");
  const [whatName, createPostwhatName] = useState("");
  const [addnewCmt, onAddComment] = useState("");
  const [typeIconFor, getTypeIconFor]: any = useState();
  const [whatForType, getForTypeValue]: any = useState();
  const [showForPopover, setForShowPopover] = useState(false);
  const [isLoading, LodingData] = useState(false);
  var [location, setUserLocation]: any = useState();
  const datePickerRef: React.Ref<DatePickerRefProps> = useRef(null);
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { id: string; pic: string; city: string; state: string } };
  const { refetch } = useUserProfile({
    userId: user?.id,
  });

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    LogBox.ignoreAllLogs();
    getResourcesAPI();
    // getUserProfileAPI();
  }, []);

  const createPostSetType = (text: any, type: any) => {
    createPostSelectType(text);
    createPostType(type);
  };

  const selectWhatTypePost = (icon: any, type: any) => {
    getTypeIconWhat(icon);
    getWhatTypeValue(type);
    setWhatShowPopover(false);
  };

  const getResourcesAPI = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/posts/resources",
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
        }
      );
      const dataItem = await response.json();
      console.log(
        "-------------------Get Resources API Response---------------------"
      );
      console.log(dataItem);
      getResourseData(dataItem?.data);
      getTypeIconWhat(dataItem?.data[0]["icon"]);
      getTypeIconFor(dataItem?.data[0]["icon"]);
      getForTypeValue(dataItem?.data[0]["value"]);
      getWhatTypeValue(dataItem?.data[0]["value"]);
      console.log(
        dataItem?.data[0]["icon"],
        "------------icon image--------------"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const postImageUploadAPI = async (fileItem: any, base64Item: any) => {
    const token = await AsyncStorage.getItem("token");
    var pic: any = {
      uploadKey: "createPostImg",
      imageName: fileItem,
      base64String: "data:image/jpeg;base64," + base64Item,
    };

    console.log("================ postImageUploadAPI Request=================");
    console.log(pic);
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/users/upload/file",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(pic),
        }
      );
      const dataItem = await response.json();
      console.log("-----------------Response------------");
      setCreatePostUri(dataItem?.data?.imageUrl);
      selectedImageKey(dataItem?.data?.key);
      console.log(dataItem);
      LodingData(false);
    } catch (error) {
      console.log(error);
      LodingData(false);
    }
  };

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
