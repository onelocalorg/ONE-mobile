import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React, { forwardRef, useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { launchImageLibrary } from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { buttonArrowGreen, saveIcon } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { ModalRefProps } from "~/components/modal-component";
import { Navbar } from "~/components/navbar/Navbar";
import { createStyleSheet } from "./style";

interface AddPayoutExpenseScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      id: string;
      addPayOutExpense: any;
    };
  };
}

export const AddPayoutExpenseScreen = (
  props: AddPayoutExpenseScreenProps,
  ref: React.Ref<unknown> | undefined
) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const { navigation, route } = props || {};
  const { id, addPayOutExpense } = route?.params ?? {};
  const styles = createStyleSheet(theme);
  // const { profilt, id, onSuccessFulData } = props || {};
  const addItemRef: React.Ref<ModalRefProps> = useRef(null);
  const [isLoading, LodingData] = useState(false);
  const [borderData, setBorderData] = useState("Expense");
  const [priceData, setPriceData] = useState(1);
  const [whoName, createPayoutWhoName] = useState("");
  const [amount, setAmount]: any = useState(0);
  const [descriptions, setDescriptions] = useState("");
  const [expenseArray, setExpenseArray]: any = useState([]);
  const [usertext, onUserSearch] = useState("");
  const [userList, recentlyJoinUser]: any = useState([]);
  const [usergratisList, userGratiesListData]: any = useState([]);
  const [userListArray, getUsetList]: any = useState();
  const [user_id, SetuserData] = useState({});
  const [imageSelectArray, setImageSelectArray]: any = useState([]);
  const [imageSelectArrayKey, setImageSelectArrayKey]: any = useState([]);
  const [newUserId, setNewUserIdData]: any = useState("");
  const [payoutListData, setPayoutListData]: any = useState([]);

  const expenseContClick = (item: any) => {
    setBorderData(item);
  };

  const priceClick = (item: any) => {
    setPriceData(item);
  };

  const resetState = () => {
    onUserSearch("");
    setDescriptions("");
    setAmount("");
    setImageSelectArray([]);
    setImageSelectArrayKey([]);
    SetuserData({});
    recentlyJoinUser([]);
  };

  const AddUserList = (item: any) => {
    const found = userList.find((element: any) => element.id == item.id);
    if (userList.length < 1) {
      if (!found) {
        recentlyJoinUser([...userList, item]);
        const newItems = { ...item };
        delete newItems.gratisNo;
        const newuserData = {
          ...newItems,
          first_name: item.first_name,
          last_name: item.last_name,
          pic: item.pic,
          id: item.id,
        };
        SetuserData(newuserData);
        getUsetList([newuserData]);
        setNewUserIdData(newuserData.id);
      } else {
        Toast.show("Already Added", Toast.LONG, {
          backgroundColor: "black",
        });
      }
      onUserSearch("");
    } else {
      Toast.show("You can not select more than one users", Toast.LONG, {
        backgroundColor: "black",
      });
    }
  };

  const removeSelectImage = (imageUrl: any) => {
    const newImage = imageSelectArray.filter(
      (person: any) => person.imageUrl !== imageUrl
    );
    setImageSelectArray(newImage);
  };

  async function createPayoutAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");
    var getAmount = (addPayOutExpense * amount) / 100;
    if (priceData === 1) {
      var item: any = {
        user_id: newUserId,
        amount: parseInt(amount),
        description: descriptions,
        type: "price",
        images: imageSelectArrayKey,
        amount_percent: 0,
      };
    } else {
      var item: any = {
        user_id: newUserId,
        amount: getAmount,
        description: descriptions,
        type: "percentage",
        images: imageSelectArrayKey,
        amount_percent: parseInt(amount),
      };
    }

    try {
      const response = await fetch(
        process.env.API_URL +
          "/v1/events/event-financial/" +
          id +
          "/draft/payout",
        // process.env.API_URL + '/v1/events/event-financial/65d4c08f947463a3a650e663/draft/payout',
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(item),
        }
      );

      const dataItem = await response.json();
      LodingData(false);
      if (dataItem.success) {
        // onSuccessFulData(dataItem.data);
        resetState();
        navigation?.goBack();
      } else {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }
    } catch (error) {
      console.error(error);
      LodingData(false);
    }
  }

  const removeuserSelect = (id: any) => {
    const newPeople = userList.filter((person: any) => person !== id);
    recentlyJoinUser(newPeople);
  };

  async function gratisUserList(textUser: any) {
    const token = await AsyncStorage.getItem("token");
    var datas: any = {
      searchtext: textUser,
    };
    onUserSearch(textUser);
    LodingData(true);
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
      const result = dataItem?.data?.map((item: any) => {
        return { ...item };
      });
      userGratiesListData(result);
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function createExpenseAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");
    var item: any = {
      user_id: newUserId,
      amount: parseInt(amount),
      description: descriptions,
      type: "price",
      images: imageSelectArrayKey,
    };
    try {
      const response = await fetch(
        process.env.API_URL +
          "/v1/events/event-financial/" +
          id +
          "/draft/expense",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(item),
        }
      );

      const dataItem = await response.json();
      LodingData(false);
      if (dataItem.success) {
        // onSuccessFulData(dataItem.data);
        navigation?.goBack();
        resetState();
      } else {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }
    } catch (error) {
      console.error(error);
      LodingData(false);
    }
  }

  const submitClick = () => {
    if (userList.length === 0) {
      Toast.show("Select user", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (amount <= 0) {
      Toast.show("Enter Amount", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (descriptions.length === 0) {
      Toast.show("Enter Descriptions", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (imageSelectArray.length === 0) {
      Toast.show("Add Image to Post", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      if (borderData === "Expense") {
        createExpenseAPI();
      } else {
        createPayoutAPI();
      }
    }

    // createExpenseAPI();
  };

  const openGallary = async () => {
    const { assets } = await launchImageLibrary({
      mediaType: "photo",
      includeBase64: true,
      maxWidth: 800,
      maxHeight: 800,
    });
    if (assets) {
      const img = assets?.[0];
      var fileNameTwo = img?.fileName ?? "";
      LodingData(true);
      var output =
        fileNameTwo.substr(0, fileNameTwo.lastIndexOf(".")) || fileNameTwo;
      var base64Two = img?.base64 ?? "";
      postImageUploadAPI(output, base64Two);
    }
  };

  const postImageUploadAPI = async (fileItem: any, base64Item: any) => {
    const token = await AsyncStorage.getItem("token");
    var pic: any = {
      uploadKey: "createPostImg",
      imageName: fileItem,
      base64String: "data:image/jpeg;base64," + base64Item,
    };

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
      var tempData = imageSelectArray;
      tempData.push(dataItem?.data);
      setImageSelectArray(tempData);
      var tempTwo = imageSelectArrayKey;

      tempTwo.push(dataItem?.data?.key);
      setImageSelectArrayKey(tempTwo);
      LodingData(false);
    } catch (error) {
      console.log(error);
      LodingData(false);
    }
  };

  const onBackPress = () => {
    navigation?.goBack();
  };

  return (
    <>
      <Navbar navigation={navigation} />
      <View style={{ flex: 1 }}>
        <View style={styles.subBreakdowncont}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            horizontal={false}
          >
            <View
              style={{
                marginTop: 5,
                marginLeft: 0,
                paddingTop: 5,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.breakdownHeader}>Add Breakdown</Text>
            </View>

            <View style={styles.payModalContainer}>
              <Text style={styles.whoCont}>Who:</Text>
              <View>
                <TextInput
                  placeholder="select who to pay"
                  placeholderTextColor="darkgray"
                  value={usertext}
                  onChangeText={(text) => gratisUserList(text)}
                  style={styles.payInput}
                ></TextInput>
              </View>
            </View>

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

            {usertext.length !== 0 ? (
              <View
                style={{
                  borderWidth: 1,
                  marginVertical: 10,
                  marginHorizontal: 10,
                  marginRight: 20,
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
                        <View style={{ flexDirection: "row", marginRight: 50 }}>
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
                              width: 150,
                              color: theme.colors.black,
                            }}
                          >
                            {item?.first_name} {item?.last_name}
                          </Text>

                          <TouchableOpacity onPress={() => AddUserList(item)}>
                            <ImageComponent
                              style={{
                                height: 20,
                                width: 20,
                                marginLeft: 20,
                                marginTop: 2,
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
            <View style={styles.TypeModalContainer}>
              <Text style={styles.typeCont}>Type:</Text>
              <View style={styles.typeDisplayCont}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => expenseContClick("Expense")}
                >
                  <Text
                    style={[
                      borderData === "Expense"
                        ? styles.typeLbl
                        : styles.typeLblTwo,
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => expenseContClick("payout")}
                >
                  <Text
                    style={[
                      borderData === "payout"
                        ? styles.typeLbl
                        : styles.typeLblTwo,
                    ]}
                  >
                    payout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.amountCont}>
              <Text style={styles.amountLbl}>Amount</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => priceClick(1)}
              >
                <View
                  style={[
                    priceData === 1
                      ? styles.priceContainer
                      : styles.priceContainerTwo,
                  ]}
                >
                  <Text style={styles.percentageSign}>$</Text>
                </View>
              </TouchableOpacity>
              {borderData !== "Expense" ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => priceClick(2)}
                >
                  <View
                    style={[
                      priceData === 2
                        ? styles.priceContainer
                        : styles.priceContainerTwo,
                    ]}
                  >
                    <Text style={styles.percentageSign}>%</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View></View>
              )}
              <View style={{ flexDirection: "row", width: 150 }}>
                <Text style={styles.dollarIcon}>
                  {priceData === 1 ? "$ " : "% "}
                </Text>
                <TextInput
                  style={styles.dollarRupees}
                  value={amount}
                  keyboardType="number-pad"
                  onChangeText={(text) => {
                    setAmount(text);
                  }}
                ></TextInput>
              </View>
            </View>

            <View style={styles.descriptionCont}>
              <Text style={styles.descpLbl}>Description</Text>
            </View>
            <View>
              <TextInput
                value={descriptions}
                multiline
                onChangeText={(text) => setDescriptions(text)}
                style={styles.payoutDescLbl}
              ></TextInput>
            </View>

            <View
              style={{
                backgroundColor: "#A9A9A9",
                height: 1,
                marginRight: 20,
              }}
            ></View>
            <View style={styles.mediaCont}>
              <Text style={styles.mediaLbl}>Media</Text>
              <TouchableOpacity onPress={openGallary}>
                <Text style={styles.addPhotosCont}>add photos</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.multipleImagecont}>
              {imageSelectArray.map((item: any) => {
                return (
                  <TouchableOpacity
                    onPress={() => removeSelectImage(item?.imageUrl)}
                  >
                    <ImageComponent
                      source={{ uri: item?.imageUrl }}
                      style={styles.selectImage}
                    ></ImageComponent>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.submitButton}>
              <TouchableOpacity activeOpacity={0.8} onPress={submitClick}>
                <ImageComponent
                  source={saveIcon}
                  style={styles.saveIcon}
                ></ImageComponent>
              </TouchableOpacity>
              {/* <ImageComponent
                source={redDeleteIcon}
                style={styles.deleteIcon}
              ></ImageComponent> */}
            </View>
          </KeyboardAwareScrollView>
          {/* </KeyboardAvoidingView> */}
        </View>
      </View>
    </>
  );
};

export const AddPayoutExpenseModel = forwardRef(AddPayoutExpenseScreen);
