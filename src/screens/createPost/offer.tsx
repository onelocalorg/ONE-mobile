import React, { useCallback, useEffect, useRef, useState } from "react";
import { createStyleSheet } from "./style";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import {
  FlatList,
  Image,
  Keyboard,
  ListRenderItem,
  LogBox,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ImageComponent } from "~/components/image-component";
import {
  addGreen,
  arrowDown,
  arrowLeft,
  bell,
  blackOffer,
  buttonArrowGreen,
  close,
  dummy,
  gratitudeBlack,
  greenOffer,
  minus,
  onelogo,
  pin,
  plus,
  postCalender,
  request,
} from "~/assets/images";
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GetLocation from "react-native-get-location";
import Popover, { PopoverPlacement, Rect } from "react-native-popover-view";
import { SizedBox } from "~/components/sized-box";
import { verticalScale } from "~/theme/device/normalize";
import {
  DatePickerRefProps,
  DateRangePicker,
} from "~/components/date-range-picker";
import { launchImageLibrary } from "react-native-image-picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Toast from "react-native-simple-toast";
import { Loader } from "~/components/loader";
import { navigations } from "~/config/app-navigation/constant";
import { DatePickerModal } from "react-native-paper-dates";
import { FlatListComponent } from "~/components/flatlist-component";
import { Pill } from "~/components/pill";
import { API_URL } from "~/network/constant";
import ActiveEnv from "~/config/env/env.dev.json";

interface CreatePostOfferScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
}
interface Range {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const CreatePostOfferScreen = (props: CreatePostOfferScreenProps) => {
  const { navigation } = props || {};
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [selecttype, createPostSelectType] = useState(1);
  const [type, createPostType] = useState("offer");
  const [typeIconWhat, getTypeIconWhat]: any = useState();
  const [showWhatPopover, setWhatShowPopover] = useState(false);
  const [showToPopover, setToShowPopover] = useState(false);
  const [getResourcewhatList, getResourseDatawhat]: any = useState([]);
  const [getResourcefromList, getResourseDataFrom]: any = useState([]);
  const [getResourceToList, getResourseDataTo]: any = useState([]);
  const [getResourceForLis, getResourseDataFor]: any = useState([]);
  const [whatSelectType, getWhatTypeValue]: any = useState();
  const [imageArray, setImageArray]: any = useState([]);
  const [imageArrayKey, setImageArrayKey]: any = useState([]);
  const [forName, createPostforName] = useState("");
  var [forQuantity, createPostforQuantity] = useState(1);
  const [whereAddress, createPostwhereAddress] = useState("");
  const [settoTitle, setToTitleData]: any = useState();
  const [whenDate, createPostwhen]: any = useState(new Date());
  const [content, createPostcontent] = useState("");
  const [tags, createPosttags]: any = useState("");
  const [tagArray, tagselectArray]: any = useState([]);
  const [whatName, createPostwhatName] = useState("");
  const [addnewCmt, onAddComment] = useState("");
  const [addnewCmtReply, onAddCommentReply] = useState("");
  var [whatQuantity, createPostwhatQuantity] = useState(1);
  const [typeIconFor, getTypeIconFor]: any = useState();
  const [whatForType, getForTypeValue]: any = useState();
  const [icontotype, getTypeIconTo]: any = useState();
  const [valueTotype, getToTypeValue] = useState("");
  const [toname, getToTypename] = useState("");
  const [iconFrom, getTypeIconFrom]: any = useState();
  const [typrFrom, getFromTypeValue]: any = useState();
  const [showForPopover, setForShowPopover] = useState(false);
  const [showFronPopover, setFronShowPopover] = useState(false);
  const [isLoading, LodingData] = useState(false);
  const [usergratisList, userGratiesListData]: any = useState([]);
  var [gratisNo, totalGratisData]: any = useState(1);
  const [userList, recentlyJoinUser]: any = useState([]);
  const [userListArray, setuserListArray]: any = useState([]);
  const [usertext, onUserSearch] = useState("");
  const [open, setOpen] = useState(false);
  var [location, setUserLocation]: any = useState();
  var makeDate = new Date();
  const [range, setRange] = useState<Range>({
    startDate: new Date(),
    endDate: makeDate,
  });

  const datePickerRef: React.Ref<DatePickerRefProps> = useRef(null);

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    LogBox.ignoreAllLogs();
    getResourcesAPI();
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

  const selectToTypePost = (icon: any, type: any, title: any) => {
    getTypeIconTo(icon);
    if (title === "Everyone") {
      setToTitleData(title);
    } else {
      setToTitleData();
    }
    getToTypeValue(type);
    setToShowPopover(false);
  };

  const selectForTypePost = (icon: any, type: any) => {
    getTypeIconFor(icon);
    getForTypeValue(type);
    setForShowPopover(false);
  };

  const onConfirmStartDateTime = (startDate: Date) => {
    console.log(startDate);
    createPostwhen(startDate);
    datePickerRef.current?.onOpenModal("end");
  };

  const getResourcesAPI = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(API_URL + "/v1/posts/resources", {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
      });
      const dataItem = await response.json();
      console.log(API_URL + "/v1/posts/resources");
      console.log(
        "-------------------Get Resources API Response---------------------"
      );
      console.log(dataItem);
      console.log(dataItem?.data?.to);

      getResourseDatawhat(dataItem?.data?.what);
      getResourseDataTo(dataItem?.data?.to);
      getResourseDataFrom(dataItem?.data?.from);
      getResourseDataFor(dataItem?.data?.for);
      getTypeIconWhat(dataItem?.data?.what[0]["icon"]);
      getWhatTypeValue(dataItem?.data?.what[0]["value"]);

      getTypeIconFor(dataItem?.data?.for[0]["icon"]);
      getForTypeValue(dataItem?.data?.for[0]["value"]);

      getTypeIconTo(dataItem?.data?.to[0]["icon"]);
      setToTitleData(dataItem?.data?.to[0]["title"]);
      getToTypeValue(dataItem?.data?.to[0]["value"]);

      getTypeIconFrom(dataItem?.data?.from[0]["icon"]);
      getFromTypeValue(dataItem?.data?.from[0]["value"]);

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
      const response = await fetch(API_URL + "/v1/users/upload/file", {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(pic),
      });
      const dataItem = await response.json();
      console.log("-----------------Response------------");
      var tempData = imageArray;
      tempData.push(dataItem?.data);
      setImageArray(tempData);

      var tempTwo = imageArrayKey;
      tempTwo.push(dataItem?.data?.key);
      setImageArrayKey(tempTwo);
      LodingData(false);
    } catch (error) {
      console.log(error);
      LodingData(false);
    }
  };

  async function createPostAPI() {
    console.log("1111111");
    LodingData(true);
    const token = await AsyncStorage.getItem("token");
    var data = {
      type: "offer",
      what_type: whatSelectType,
      what_name: whatName,
      what_quantity: whatQuantity,
      for_type: whatForType,
      for_name: forName,
      for_quantity: forQuantity,
      where_address: whereAddress,
      where_lat: location?.lat?.toString(),
      where_lng: location?.lng?.toString(),
      when: whenDate.toISOString(),
      content: content,
      tags: tagArray,
      post_image: imageArrayKey,
      to_type: valueTotype,
      to_offer_users: userListArray,
    };

    console.log("=========== Create Post API Request ==============");
    console.log(data);
    try {
      console.log("222222");

      const response = await fetch(API_URL + "/v1/posts/create", {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
        body: JSON.stringify(data),
      });
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
      console.log("33333");

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

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    (res: Range) => {
      console.log(res, "--------------date pick------------");
      const startDate = res?.startDate;
      const endDate = res?.endDate;
      setOpen(false);
      setRange({ startDate, endDate });
      console.log(range, "---------------set range ---------------");
    },
    [setOpen, setRange]
  );

  const CreateNewPostModal = () => {
    if (whatName.length === 0) {
      Toast.show("Enter About What", Toast.LONG, {
        backgroundColor: "black",
      });
      // } else if (whatQuantity.length === 0) {
      //   Toast.show('Enter What Quantity', Toast.LONG, {
      //     backgroundColor: 'black',
      //   });
    } else if (forName.length === 0) {
      Toast.show("Enter About For", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (valueTotype.length === 0) {
      Toast.show("Enter About To", Toast.LONG, {
        backgroundColor: "black",
      });
      // } else if (forQuantity.length === 0) {
      //   Toast.show('Enter For Quantity', Toast.LONG, {
      //     backgroundColor: 'black',
      //   });
    } else if (whereAddress.length === 0) {
      Toast.show("Enter Address", Toast.LONG, {
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
      console.log("create post api call");
      createPostAPI();
    }
    // } else {
    //   CreatePostModal(false);
  };

  // const onNavigateToProfile = () => {
  //   if (user?.id) {
  //     refetch().then(res => {
  //       const userData = userProfileParsedData(res?.data?.data);
  //       console.log('check1===', userData);
  //       dispatch(onSetUser(userData));
  //     });
  //   }
  //   navigation?.navigate(navigations.PROFILE);
  // };

  const renderItem: ListRenderItem<string> = ({ item }) => (
    <Pill
      onPressPill={() => handleRemove(item)}
      pillStyle={styles.marginBottom}
      key={item}
      label={item}
    />
  );

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

  async function gratisUserList(textUser: any) {
    const token = await AsyncStorage.getItem("token");
    var datas: any = {
      searchtext: textUser,
    };
    onUserSearch(textUser);
    LodingData(true);
    console.log("=========== User List Gratis API Request ==============");
    console.log(datas);
    console.log(API_URL + "/v1/users/search-user?searchtext=" + textUser);
    try {
      const response = await fetch(
        API_URL + "/v1/users/search-user?searchtext=" + textUser,
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

  const removeuserSelect = (id: any) => {
    const newPeople = userList.filter((person: any) => person !== id);
    console.log("--------newPeople---------", newPeople);

    recentlyJoinUser(newPeople);
    setuserListArray(newPeople);
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
  return (
    <>
      <Loader visible={isLoading} showOverlay />

      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
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
                  placeholder="What do you want to offer?"
                  placeholderTextColor="#8B8888"
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
              <SizedBox height={verticalScale(8)}></SizedBox>
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
                    listView: {
                      color: "black", //To see where exactly the list is
                      zIndex: 10000000, //To popover the component outwards
                      // position: 'absolute',
                      // top: 45
                    },
                    predefinedPlacesDescription: {
                      color: "black",
                    },
                    description: {
                      color: "black",
                      fontSize: 14,
                    },
                  }}
                  listViewDisplayed={false}
                  textInputProps={{
                    placeholderTextColor: "gray",
                  }}
                  placeholder="where is this offer located?"
                  GooglePlacesDetailsQuery={{ fields: "geometry" }}
                  fetchDetails={true}
                  onPress={(data: any, details = null) => {
                    createPostwhereAddress(data.description);
                    setUserLocation(details?.geometry?.location);
                    console.log(data);
                    console.log(details); // description
                  }}
                  query={{
                    key: ActiveEnv.GOOGLE_KEY, // client
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
              {/* <SizedBox height={10}></SizedBox> */}

              <View style={styles.postCont}>
                <Text style={styles.textOne}>Post Body</Text>
                <TextInput
                  multiline
                  placeholderTextColor="darkgray"
                  textAlignVertical={"top"}
                  value={content}
                  onChangeText={(text) => createPostcontent(text)}
                  style={styles.postinput}
                ></TextInput>
              </View>
              <SizedBox height={verticalScale(10)}></SizedBox>
              <View style={styles.createPostCont}>
                <Text style={styles.textOne}>To</Text>

                <TextInput
                  placeholderTextColor="darkgray"
                  value={settoTitle}
                  editable={settoTitle == "Everyone" ? false : true}
                  onChangeText={(text) => {
                    setToTitleData(text);
                    gratisUserList(text);
                  }}
                  style={styles.postInputToType}
                ></TextInput>
                <Popover
                  isVisible={showToPopover}
                  placement={PopoverPlacement.BOTTOM}
                  onRequestClose={() => setToShowPopover(false)}
                  from={
                    <TouchableOpacity onPress={() => setToShowPopover(true)}>
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
                            selectToTypePost(
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
                      </View>
                    )}
                  ></FlatList>
                </Popover>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setToShowPopover(true)}
                >
                  <ImageComponent
                    resizeMode="stretch"
                    source={{ uri: icontotype }}
                    style={styles.createImgOne}
                  ></ImageComponent>
                </TouchableOpacity>
              </View>
              <SizedBox height={10}></SizedBox>

              {/* -----------------------Selected user list-------------- */}
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
                  placeholder="what reciprocity do you want?"
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
              <SizedBox height={10}></SizedBox>
              <View style={styles.createPostCont}>
                <Text style={styles.textOne}>When</Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => datePickerRef.current?.onOpenModal("start")}
                  style={styles.postInputTwo}
                >
                  <Text style={styles.time}>
                    {`${moment(whenDate).format("DD MMM YYYY hh:mm A")}`}
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

              {/* <View style={styles.quntitiyCont}>
                <Text style={styles.textOne}>Quantity</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="how many?"
                  value={forQuantity}
                  placeholderTextColor="darkgray"
                  onChangeText={text => createPostforQuantity(text)}
                  style={styles.quntitiyInput}></TextInput>
              </View> */}

              <View style={styles.createPostCont}>
                {/* <Text style={styles.textOne}>When</Text> */}
                {/* <ImageComponent
                  resizeMode="cover"
                  source={postCalender}
                  style={styles.createImgOne}></ImageComponent> */}

                {/* <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setOpen(true)}
                  style={styles.postInputTwo}>
                  <Text style={styles.time}>
                    {`${moment(range.startDate).format('DD MMM YYYY hh:mm A')}`}
                  </Text>

                
                </TouchableOpacity> */}

                {/* <View>
                  <TouchableOpacity activeOpacity={0.8} style={styles.postdate}>
                    <ImageComponent
                      source={postCalender}
                      style={styles.calendar}
                    />
                    <ImageComponent
                      source={arrowDown}
                      style={{height: 10, width: 10}}
                    />

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setOpen(true)}>
                      <Text style={styles.time}>
                        {`${moment(range?.startDate).format(
                          'h:mma MMM D, YYYY',
                        )}`}
                        -
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setOpen(true)}>
                      <Text style={styles.time}>{`${moment(
                        range?.endDate,
                      ).format('h:mma MMM D, YYYY')}`}</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                  {/* <Text>+ add an additional timerange</Text> */}
                {/* </View> */}
              </View>

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

      <DatePickerModal
        locale="en"
        mode="range"
        visible={open}
        onDismiss={onDismiss}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={onConfirm}
        validRange={{ startDate: new Date() }}
        editIcon="none"
        closeIcon={close}
      />
    </>
  );
};
