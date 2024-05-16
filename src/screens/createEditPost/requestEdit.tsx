import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  ListRenderItem,
  LogBox,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import GetLocation from "react-native-get-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { launchImageLibrary } from "react-native-image-picker";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import Toast from "react-native-simple-toast";
import { useSelector } from "react-redux";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import {
  addGreen,
  arrowDown,
  buttonArrowGreen,
  pin,
  postCalender,
  requestGreen,
} from "~/assets/images";
import {
  DatePickerRefProps,
  DateRangePicker,
} from "~/components/date-range-picker";
import { FlatListComponent } from "~/components/flatlist-component";
import { ImageComponent } from "~/components/image-component";
import { Navbar } from "~/components/navbar/Navbar";
import { Pill } from "~/components/pill";
import { SizedBox } from "~/components/sized-box";
import { useUserProfile } from "~/network/hooks/user-service-hooks/use-user-profile";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { verticalScale } from "~/theme/device/normalize";
import { createStyleSheet } from "./style";

interface EditPostRequestScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      postData: any;
    };
  };
}

export const EditPostRequestScreen = (props: EditPostRequestScreenProps) => {
  const { navigation, route } = props || {};
  const { postData } = route?.params ?? {};
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [selecttype, createPostSelectType] = useState(1);
  const [type, createPostType] = useState("offer");
  const [typeIconWhat, getTypeIconWhat]: any = useState();
  const [showWhatPopover, setWhatShowPopover] = useState(false);
  const [getResourceList, getResourseData]: any = useState([]);
  const [whatSelectType, getWhatTypeValue]: any = useState();
  const [getResourcewhatList, getResourseDatawhat]: any = useState([]);
  const [getResourcefromList, getResourseDataFrom]: any = useState([]);
  const [getResourceToList, getResourseDataTo]: any = useState([]);
  const [getResourceForLis, getResourseDataFor]: any = useState([]);
  const [icontotype, getTypeIconTo]: any = useState();
  const [valueTotype, getToTypeValue] = useState("");
  const [iconFrom, getTypeIconFrom]: any = useState();
  const [typrFrom, getFromTypeValue]: any = useState();
  const [imageArray, setImageArray]: any = useState([]);
  const [imageArrayKey, setImageArrayKey]: any = useState([]);
  const [forName, createPostforName] = useState("");
  var [forQuantity, createPostforQuantity] = useState(1);
  const [whereAddress, createPostwhereAddress] = useState("");
  const [imageKey, selectedImageKey] = useState();
  const [when, createPostwhen]: any = useState();
  const [content, createPostcontent] = useState("");
  const [tags, createPosttags]: any = useState("");
  const [tagArray, tagselectArray]: any = useState([]);
  const [whatName, createPostwhatName] = useState("");
  const [fromName, createPostFromName] = useState("");
  const [addnewCmt, onAddComment] = useState("");
  const [addnewCmtReply, onAddCommentReply] = useState("");
  var [whatQuantity, createPostwhatQuantity] = useState(1);
  const [typeIconFor, getTypeIconFor]: any = useState();
  const [whatForType, getForTypeValue]: any = useState();
  const [showForPopover, setForShowPopover] = useState(false);
  const [isLoading, LodingData] = useState(false);
  const [showFromPopover, setFronShowPopover] = useState(false);
  var [location, setUserLocation]: any = useState();
  var [gratisNo, totalGratisData]: any = useState(1);
  const [userList, recentlyJoinUser]: any = useState([]);
  const [userListArray, setuserListArray]: any = useState([]);
  const [usergratisList, userGratiesListData]: any = useState([]);
  const [usertext, onUserSearch] = useState("");
  const [settoTitle, setToTitleData]: any = useState();
  var [latitude, setLatitude]: any = useState();
  var [longitude, setLongitude]: any = useState();
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
    requestLocationPermission();
    getResourcesAPI();
    getPostDetailAPI();
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

  const selectForTypePost = (icon: any, type: any) => {
    getTypeIconFor(icon);
    getForTypeValue(type);
    setForShowPopover(false);
  };

  const selectFromTypePost = (icon: any, type: any, title: any) => {
    if (title === "Everyone") {
      setToTitleData(title);
    } else {
      setToTitleData();
    }
    if (type === "everyone") {
      recentlyJoinUser([]);
      setuserListArray([]);
    }
    getTypeIconTo(icon);
    getFromTypeValue(type);
    getToTypeValue(type);
    setFronShowPopover(false);
  };

  const onConfirmStartDateTime = (startDate: Date) => {
    console.log(startDate);
    createPostwhen(startDate);
    datePickerRef.current?.onOpenModal("end");
  };

  const requestLocationPermission = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 6000,
    })
      .then((location) => {
        setUserLocation(location);
        console.log(
          "---------------------location---------------------",
          location
        );
        if (location) {
          // postListAPI();
        }
      })
      .catch((error) => {
        console.log("---------------------error---------------------", error);
        const { code, message } = error;
        console.log(code, message);
      });
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
            "Content-Type": "application/json",
          }),
        }
      );
      const dataItem = await response.json();
      console.log(
        "-------------------Get Resources API Response---------------------"
      );
      console.log(dataItem);
      getResourseDatawhat(dataItem?.data?.what);
      getResourseDataTo(dataItem?.data?.to);
      getResourseDataFrom(dataItem?.data?.from);
      getResourseDataFor(dataItem?.data?.for);
      // getTypeIconWhat(dataItem?.data?.what[0]['icon']);
      // getTypeIconFor(dataItem?.data?.for[0]['icon']);
      // getForTypeValue(dataItem?.data?.for[0]['value']);
      // getTypeIconTo(dataItem?.data?.to[0]['icon']);
      // setToTitleData(dataItem?.data?.to[0]['title']);
      // getToTypeValue(dataItem?.data?.to[0]['value']);
      // getTypeIconFrom(dataItem?.data?.from[0]['icon']);
      // getFromTypeValue(dataItem?.data?.from[0]['value']);
      // getWhatTypeValue(dataItem?.data?.what[0]['value']);
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
      var tempData = imageArray;
      tempData.push(dataItem?.data);
      setImageArray(tempData);

      var tempTwo = imageArrayKey;
      tempTwo.push(dataItem?.data?.key);
      setImageArrayKey(tempTwo);
      selectedImageKey(dataItem?.data?.key);
      console.log(dataItem);
      LodingData(false);
    } catch (error) {
      console.log(error);
      LodingData(false);
    }
  };

  async function getPostDetailAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");

    console.log(process.env.API_URL + "/v2/posts/get/detail/" + postData?.id);
    try {
      console.log("222222");

      const response = await fetch(
        process.env.API_URL + "/v2/posts/get/detail/" + postData?.id,
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            Accept: "application/json",
          }),
        }
      );
      const dataItem = await response.json();
      console.log("=========== Get detail Post API Response ==============");
      console.log(dataItem);
      createPostwhatName(dataItem?.data?.what?.name);
      createPostwhatQuantity(dataItem?.data?.what?.quantity);
      getTypeIconWhat(dataItem?.data?.what?.icon);
      getWhatTypeValue(dataItem?.data?.what?.type);
      createPostcontent(dataItem?.data?.content);
      createPostforName(dataItem?.data?.for?.name);
      getForTypeValue(dataItem?.data?.for?.type);
      if (dataItem?.data?.from?.type === "person") {
        setToTitleData();
        recentlyJoinUser(dataItem?.data?.usersArray);
        let modifiedArray = dataItem?.data?.usersArray.map((obj: any) => {
          const { first_name, last_name, pic, id, point, ...rest } = obj;
          setuserListArray([...userListArray, obj.id]);
        });
      } else {
        setToTitleData(dataItem?.data?.from?.title);
      }
      getFromTypeValue(dataItem?.data?.from?.type);
      getTypeIconTo(dataItem?.data?.from?.icon);
      createPostforQuantity(dataItem?.data?.for?.quantity);
      getTypeIconFor(dataItem?.data?.for?.icon);
      createPostwhen(dataItem?.data?.when);
      setLatitude(dataItem?.data?.where?.location?.coordinates[1]);
      setLongitude(dataItem?.data?.where?.location?.coordinates[0]);
      createPostwhereAddress(dataItem?.data?.where?.address);

      tagselectArray(dataItem?.data?.tags);
      setImageArray(dataItem?.data?.imageUrl);
      setImageArrayKey(dataItem?.data?.image);
      LodingData(false);
    } catch (error) {
      console.log("33333");

      LodingData(false);
      console.error(error);
    }
  }

  async function createPostAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      type: "request",
      what_type: whatSelectType,
      what_name: whatName,
      what_quantity: whatQuantity,
      for_type: whatForType,
      for_name: forName,
      for_quantity: forQuantity,
      where_address: whereAddress,
      where_lat: latitude?.toString(),
      where_lng: longitude?.toString(),
      when: when?.toString(),
      content: content,
      tags: tagArray,
      post_image: imageArrayKey,
      from_type: typrFrom,
      from_users: userListArray,
    };

    console.log(process.env.API_URL + "/v2/posts/update/" + postData?.id);
    console.log(data);
    try {
      const response = await fetch(
        process.env.API_URL + "/v2/posts/update/" + postData?.id,
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(data),
        }
      );
      const dataItem = await response.json();
      console.log("=========== Create Post API Response ==============");
      console.log(dataItem);
      LodingData(false);
      Toast.show(dataItem?.message, Toast.LONG, {
        backgroundColor: "black",
      });
      if (dataItem?.success === true) {
        navigation?.goBack();
      }

      // postListAPI();
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  const onBackPress = () => {
    navigation?.goBack();
  };

  const GallerySelect = async () => {
    const { assets } = await launchImageLibrary({
      mediaType: "photo",
      // selectionLimit: 2,
      includeBase64: true,
      maxWidth: 800,
      maxHeight: 800,
    });
    console.log(assets);
    if (assets) {
      const img = assets?.[0];
      console.log("---------------assets Gallery 222---------------");
      console.log(assets);
      var fileNameTwo = img?.fileName ?? "";
      LodingData(true);
      var output =
        fileNameTwo.substr(0, fileNameTwo.lastIndexOf(".")) || fileNameTwo;
      var base64Two = img?.base64 ?? "";
      postImageUploadAPI(output, base64Two);
    }
  };

  const CreateNewPostModal = () => {
    if (whatName.length === 0) {
      Toast.show("Enter About What", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (forName.length === 0) {
      Toast.show("Enter About For", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (content.length === 0) {
      Toast.show("Enter Post Content", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (tagArray.length === 0) {
      Toast.show("Enter Post Tag", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (imageArray.length === 0) {
      Toast.show("Add Image to Post", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      createPostAPI();
    }
    // } else {
    //   CreatePostModal(false);
  };

  const whatQtyMinus = () => {
    if (whatQuantity > 1) {
      whatQuantity = whatQuantity - 1;
      createPostwhatQuantity(whatQuantity);
    }
  };

  const whatQtyPlus = () => {
    whatQuantity = whatQuantity + 1;
    createPostwhatQuantity(whatQuantity);
  };

  const ForQtyMinus = () => {
    if (forQuantity > 1) {
      forQuantity = forQuantity - 1;
      createPostforQuantity(forQuantity);
    }
  };

  const ForQtyPlus = () => {
    forQuantity = forQuantity + 1;
    createPostforQuantity(forQuantity);
  };

  const handleRemove = (id: any) => {
    const newPeople = tagArray.filter((person: any) => person !== id);
    console.log("--------newPeople---------", newPeople);

    tagselectArray(newPeople);
  };

  const onAddSkill = (text: any) => {
    if (text !== "" && text !== undefined) {
      tagselectArray([...tagArray, text]);
      console.log("onSubmitEditing onSubmitEditing", tags, tagArray, text);
      createPosttags("");
    }
  };

  const renderItem: ListRenderItem<string> = ({ item }) => (
    <Pill
      onPressPill={() => handleRemove(item)}
      pillStyle={styles.marginBottom}
      key={item}
      label={item}
    />
  );

  const removeuserSelect = (userlist: any) => {
    const newPeople = userList.filter((person: any) => person !== userlist);
    console.log("--------newPeople---------", newPeople);

    recentlyJoinUser(newPeople);
    const ids = newPeople.map((obj: any) => obj.id);
    setuserListArray(ids);
  };

  const AddUserList = (item: any) => {
    const found = userList.find((element: any) => element.id == item.id);
    if (!found) {
      recentlyJoinUser([...userList, item]);

      const newItems = { ...item };
      delete newItems.first_name;
      delete newItems.last_name;
      delete newItems.pic;
      delete newItems.id;
      delete newItems.gratisNo;
      console.log(item.gratisNo);
      setuserListArray([...userListArray, item.id]);

      console.log(userListArray);
    } else {
      Toast.show("Already Added", Toast.LONG, {
        backgroundColor: "black",
      });
    }
  };

  async function gratisUserList(textUser: any) {
    const token = await AsyncStorage.getItem("token");
    var datas: any = {
      searchtext: textUser,
    };
    onUserSearch(textUser);
    LodingData(true);
    console.log("=========== User List Gratis API Request ==============");
    console.log(datas);
    console.log(
      process.env.API_URL + "/v1/users/search-user?searchtext=" + textUser
    );
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/users/search-user?searchtext=" + textUser,
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
        }
      );
      const dataItem = await response.json();
      console.log("=========== User List Gratis API Response ==============");
      const result = dataItem?.data?.map((item: any) => {
        return { ...item, gratisNo: 1 };
      });
      userGratiesListData(result);
      console.log(dataItem);
      Toast.show(dataItem?.message, Toast.LONG, {
        backgroundColor: "black",
      });
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  const removeSelectImage = (imageItem: any) => {
    console.log(imageItem, "image url");
    console.log(imageArrayKey);
    const newImage = imageArray.filter(
      (person: any) =>
        person.imageUrl !== imageItem?.imageUrl && person.key !== imageItem.key
    );
    setImageArray(newImage);
    const newImagekey = imageArrayKey.filter(
      (person: any) => person !== imageItem?.key
    );
    setImageArrayKey(newImagekey);
    console.log(imageArrayKey);
  };

  const gratisPlusClick = (item: any, index: any) => {
    // console.log(item)
    item.gratisNo = item.gratisNo + 1;
    console.log(item.gratisNo);
    let markers = [...usergratisList];
    markers[index] = {
      ...markers[index],
      gratisNo: item.gratisNo,
    };
    totalGratisData(markers);
  };
  const gratisMinusClick = (item: any, index: any) => {
    // console.log(item)
    if (item.gratisNo > 1) {
      item.gratisNo = item.gratisNo - 1;
      let markers = [...usergratisList];
      markers[index] = {
        ...markers[index],
        gratisNo: item.gratisNo,
      };
      totalGratisData(markers);
    }
  };

  const onNavigateToProfile = () => {
    navigation?.navigate("profileroute");
  };
  return (
    <>
      <Navbar navigation={navigation} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.postFilter}>
          <TouchableOpacity style={styles.container3} activeOpacity={1}>
            <ImageComponent source={requestGreen} style={styles.icon1} />
            <Text style={styles.label3}>Request Edit</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={keyboardDismiss}
          activeOpacity={1}
          style={styles.createPostModal}
        >
          <View>
            <View style={styles.postClass}>
              <View style={styles.createPostCont}>
                <Text style={styles.textOne}>What</Text>
                <TextInput
                  placeholder="What is your request?"
                  placeholderTextColor="darkgray"
                  value={whatName}
                  onChangeText={(text) => createPostwhatName(text)}
                  style={styles.postInputTwo}
                ></TextInput>
                <View style={styles.QuantityContainer}>
                  <TouchableOpacity onPress={whatQtyMinus}>
                    <Text style={styles.QuantityMinus}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.QuantityMunber}>{whatQuantity}</Text>
                  <TouchableOpacity onPress={whatQtyPlus}>
                    <Text style={styles.QuantityPlus}>+</Text>
                  </TouchableOpacity>
                </View>
                <Popover
                  isVisible={showWhatPopover}
                  placement={PopoverPlacement.BOTTOM}
                  onRequestClose={() => setWhatShowPopover(false)}
                  from={
                    <TouchableOpacity onPress={() => setWhatShowPopover(true)}>
                      <ImageComponent
                        resizeMode="contain"
                        source={arrowDown}
                        style={styles.arrowDown}
                      ></ImageComponent>
                    </TouchableOpacity>
                  }
                >
                  <FlatList
                    data={getResourcewhatList}
                    renderItem={({ item }) => (
                      <View style={{ width: 120 }}>
                        <TouchableOpacity
                          onPress={() =>
                            selectWhatTypePost(item?.icon, item?.value)
                          }
                          style={styles.container3}
                          activeOpacity={0.8}
                        >
                          <ImageComponent
                            source={{ uri: item?.icon }}
                            style={styles.icon1}
                          />
                          <Text style={styles.label2}>{item?.title}</Text>
                        </TouchableOpacity>
                        <View
                          style={{
                            height: 2,
                            backgroundColor: "lightgray",
                            marginHorizontal: 10,
                          }}
                        ></View>
                      </View>
                    )}
                  ></FlatList>
                </Popover>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setWhatShowPopover(true)}
                >
                  <ImageComponent
                    resizeMode="cover"
                    source={{ uri: typeIconWhat }}
                    style={styles.createImgOne}
                  ></ImageComponent>
                </TouchableOpacity>
              </View>
              <SizedBox height={10}></SizedBox>
              <View style={styles.createPostContTwo}>
                <Text style={styles.textTwoWhere}>Where</Text>

                {/* <View style={styles.postInputTwo}> */}
                <GooglePlacesAutocomplete
                  styles={{
                    textInput: {
                      backgroundColor: "#E8E8E8",
                      height: 35,
                      borderRadius: 10,
                      color: "black",
                      fontSize: 14,
                      borderColor: theme.colors.black,
                      borderWidth: theme.borderWidth.borderWidth1,
                    },
                    predefinedPlacesDescription: {
                      color: "black",
                    },
                    description: {
                      color: "black",
                      fontSize: 14,
                    },
                  }}
                  textInputProps={{
                    placeholderTextColor: "gray",
                  }}
                  GooglePlacesDetailsQuery={{ fields: "geometry" }}
                  fetchDetails={true}
                  placeholder="where do you need this?"
                  onPress={(data: any, details = null) => {
                    createPostwhereAddress(data.description);
                    setLatitude(details?.geometry?.location?.lat);
                    setLongitude(details?.geometry?.location?.lng);
                    console.log(data); // description
                    console.log(details);
                  }}
                  query={{
                    key: process.env.GOOGLE_KEY, // client
                  }}
                  // keepResultsAfterBlur={true}
                  // currentLocation={true}
                  currentLocationLabel="Current location"
                />
                <ImageComponent
                  resizeMode="cover"
                  source={pin}
                  style={styles.createImgTwo}
                ></ImageComponent>
              </View>
              <View style={styles.postCont}>
                <Text style={styles.textOne}>Post Body</Text>
                <TextInput
                  multiline
                  // placeholder="What do you want to say?"
                  placeholderTextColor="darkgray"
                  textAlignVertical={"top"}
                  value={content}
                  onChangeText={(text) => createPostcontent(text)}
                  style={styles.postinput}
                ></TextInput>
              </View>
              <SizedBox height={10}></SizedBox>
              {/* <View style={styles.quntitiyCont}>
                <Text style={styles.textOne}>Quantity</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="how many?"
                  value={whatQuantity}
                  placeholderTextColor="darkgray"
                  onChangeText={text => createPostwhatQuantity(text)}
                  style={styles.quntitiyInput}></TextInput>
              </View> */}
              <View style={styles.createPostCont}>
                <Text style={styles.textOne}>From</Text>
                <TextInput
                  // placeholder="who do you request this of?"
                  placeholderTextColor="darkgray"
                  value={settoTitle}
                  editable={settoTitle == "Everyone" ? false : true}
                  onChangeText={(text) => gratisUserList(text)}
                  style={styles.postInputTwo}
                ></TextInput>
                <SizedBox width={10}></SizedBox>
                <Popover
                  isVisible={showFromPopover}
                  placement={PopoverPlacement.BOTTOM}
                  onRequestClose={() => setFronShowPopover(false)}
                  from={
                    <TouchableOpacity onPress={() => setFronShowPopover(true)}>
                      <ImageComponent
                        resizeMode="contain"
                        source={arrowDown}
                        style={styles.arrowDown}
                      ></ImageComponent>
                    </TouchableOpacity>
                  }
                >
                  <FlatList
                    data={getResourceToList}
                    renderItem={({ item }) => (
                      <View style={{ width: 120 }}>
                        <TouchableOpacity
                          onPress={() =>
                            selectFromTypePost(
                              item?.icon,
                              item?.value,
                              item?.title
                            )
                          }
                          style={styles.container3}
                          activeOpacity={0.8}
                        >
                          <ImageComponent
                            source={{ uri: item?.icon }}
                            style={styles.icon1}
                          />
                          <Text style={styles.label2}>{item?.title}</Text>
                        </TouchableOpacity>
                        <View
                          style={{
                            height: 2,
                            backgroundColor: "lightgray",
                            marginHorizontal: 10,
                          }}
                        ></View>
                      </View>
                    )}
                  ></FlatList>
                </Popover>
                <SizedBox width={10}></SizedBox>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setFronShowPopover(true)}
                >
                  <ImageComponent
                    resizeMode="contain"
                    source={{ uri: icontotype }}
                    style={styles.createImgOne}
                  ></ImageComponent>
                </TouchableOpacity>
              </View>
              <SizedBox height={10}></SizedBox>
              <View style={styles.avatarContainer}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {userList.map((userList: any) => {
                    return (
                      <TouchableOpacity
                        onPress={() => removeuserSelect(userList)}
                      >
                        <ImageComponent
                          style={styles.avatarImage}
                          isUrl={!!userList?.pic}
                          resizeMode="cover"
                          uri={userList?.pic}
                        ></ImageComponent>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {settoTitle !== "Everyone" ? (
                <View
                  style={{
                    borderWidth: 1,
                    marginVertical: 10,
                    borderRadius: 10,
                    maxHeight: 275,
                    overflow: "hidden",
                    height: "auto",
                  }}
                >
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <FlatList
                      data={usergratisList}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          activeOpacity={1}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginVertical: 5,
                            borderBottomWidth: 1,
                            borderColor: "gray",
                            paddingVertical: 8,
                          }}
                        >
                          <View
                            style={{ flexDirection: "row", marginRight: 50 }}
                          >
                            <ImageComponent
                              style={{
                                height: 30,
                                width: 30,
                                marginRight: 20,
                                marginLeft: 10,
                                borderRadius: 100,
                              }}
                              resizeMode="cover"
                              source={{ uri: item?.pic }}
                            ></ImageComponent>
                            <Text
                              numberOfLines={1}
                              style={{
                                alignSelf: "center",
                                flexShrink: 1,
                                width: 125,
                                color: theme.colors.black,
                              }}
                            >
                              {item?.first_name} {item?.last_name}
                            </Text>
                          </View>

                          <View style={styles.gratisCont}>
                            <TouchableOpacity onPress={() => AddUserList(item)}>
                              <ImageComponent
                                style={{
                                  height: 20,
                                  width: 20,
                                }}
                                source={buttonArrowGreen}
                              ></ImageComponent>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      )}
                    ></FlatList>
                  </ScrollView>
                </View>
              ) : (
                <View></View>
              )}
              <View style={styles.createPostCont}>
                <Text style={styles.textOne}>For</Text>

                <TextInput
                  value={forName}
                  placeholder="what reciprocity do you offer?"
                  placeholderTextColor="darkgray"
                  onChangeText={(text) => createPostforName(text)}
                  style={styles.postInputTwo}
                ></TextInput>
                <View style={styles.QuantityContainer}>
                  <TouchableOpacity onPress={ForQtyMinus}>
                    <Text style={styles.QuantityMinus}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.QuantityMunber}>{forQuantity}</Text>
                  <TouchableOpacity onPress={ForQtyPlus}>
                    <Text style={styles.QuantityPlus}>+</Text>
                  </TouchableOpacity>
                </View>
                <Popover
                  isVisible={showForPopover}
                  placement={PopoverPlacement.BOTTOM}
                  onRequestClose={() => setForShowPopover(false)}
                  from={
                    <TouchableOpacity onPress={() => setForShowPopover(true)}>
                      <ImageComponent
                        resizeMode="contain"
                        source={arrowDown}
                        style={styles.arrowDown}
                      ></ImageComponent>
                    </TouchableOpacity>
                  }
                >
                  <FlatList
                    data={getResourcewhatList}
                    renderItem={({ item }) => (
                      <View style={{ width: 120 }}>
                        <TouchableOpacity
                          onPress={() =>
                            selectForTypePost(item?.icon, item?.value)
                          }
                          style={styles.container3}
                          activeOpacity={0.8}
                        >
                          <ImageComponent
                            source={{ uri: item?.icon }}
                            style={styles.icon1}
                          />
                          <Text style={styles.label2}>{item?.title}</Text>
                        </TouchableOpacity>
                        <View
                          style={{
                            height: 2,
                            backgroundColor: "lightgray",
                            marginHorizontal: 10,
                          }}
                        ></View>
                      </View>
                    )}
                  ></FlatList>
                </Popover>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setForShowPopover(true)}
                >
                  <ImageComponent
                    resizeMode="cover"
                    source={{ uri: typeIconFor }}
                    style={styles.createImgOne}
                  ></ImageComponent>
                </TouchableOpacity>
              </View>
              <SizedBox height={verticalScale(10)}></SizedBox>
              <View style={styles.createPostCont}>
                <Text style={styles.textOne}>When</Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => datePickerRef.current?.onOpenModal("start")}
                  style={styles.postInputTwo}
                >
                  <Text style={styles.time}>
                    {`${moment(when).format("DD MMM YYYY hh:mm A")}`}
                  </Text>

                  <DateRangePicker
                    selectStartDate={onConfirmStartDateTime}
                    ref={datePickerRef}
                  />
                </TouchableOpacity>
                <ImageComponent
                  resizeMode="cover"
                  source={postCalender}
                  style={styles.calenderImage}
                ></ImageComponent>
              </View>
              <View style={styles.tagCont}>
                <Text style={styles.textOne}>Tags</Text>
                <TextInput
                  placeholder="add tags or people"
                  placeholderTextColor="darkgray"
                  value={tags}
                  onChangeText={(text) => createPosttags(text)}
                  style={styles.tagInput}
                ></TextInput>
              </View>
              {tags !== "" ? (
                <TouchableOpacity
                  style={{ zIndex: 1111111 }}
                  onPress={() => {
                    onAddSkill(tags);
                  }}
                >
                  <ImageComponent
                    style={styles.skillAddImage}
                    source={addGreen}
                  ></ImageComponent>
                </TouchableOpacity>
              ) : (
                <View></View>
              )}

              <View style={styles.row}>
                <FlatListComponent
                  data={tagArray}
                  keyExtractor={(item) => item.toString()}
                  renderItem={renderItem}
                  numColumns={100}
                  showsHorizontalScrollIndicator={false}
                  columnWrapperStyle={styles.flexWrap}
                />
              </View>
              <TouchableOpacity
                onPress={GallerySelect}
                style={styles.imagesCont}
              >
                <Text style={styles.textTwo}>Image</Text>
                <Text style={styles.textTwo}>+</Text>
                <Text style={styles.textThree}>add images</Text>
              </TouchableOpacity>

              <View style={styles.multipleImagecont}>
                {imageArray.map((item: any) => {
                  return (
                    <TouchableOpacity onPress={() => removeSelectImage(item)}>
                      <ImageComponent
                        source={{ uri: item?.imageUrl }}
                        style={styles.selectImage}
                      ></ImageComponent>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={CreateNewPostModal}
                activeOpacity={0.8}
                style={styles.purchaseContainer}
              >
                <View />
                <Text style={styles.titleTwo}>{strings.postOffer}</Text>
                <ImageComponent
                  source={buttonArrowGreen}
                  style={styles.buttonArrow}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};
