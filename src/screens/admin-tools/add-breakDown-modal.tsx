import React, { forwardRef, useEffect, useRef, useState } from "react";
import { createStyleSheet } from "./style";
import { View } from "react-native";
import { Text } from "react-native";
import { useAppTheme } from "@app-hooks/use-app-theme";
import { useStringsAndLabels } from "@app-hooks/use-strings-and-labels";
import { TextInput } from "react-native-gesture-handler";
import { ModalComponent, ModalRefProps } from "@components/modal-component";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@network/constant";
import { ScrollView } from "react-native";
import { FlatList } from "react-native";
import { ImageComponent } from "@components/image-component";
import { buttonArrowGreen } from "@assets/images";
import Toast from "react-native-simple-toast";
import { Loader } from "@components/loader";
import { launchImageLibrary } from "react-native-image-picker";
import { ButtonComponent } from "@components/button-component";

interface AddBreakDownModalProps {
  id: string;
  revenue: number;
  expense: number;
  profilt: number;
  payout: number;
  remainingAmt: number;
  userId: string;
  onSuccessFulData: (
    amount: Number,
    descriptions: string,
    imageSelectArrayKey: [],
    user_id: object,
    borderData: string,
    type: any
  ) => void;
}

export const AddBreakDownModal = (
  props: AddBreakDownModalProps,
  ref: React.Ref<unknown> | undefined
) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const {
    id,
    expense,
    revenue,
    remainingAmt,
    payout,
    profilt,
    userId,
    onSuccessFulData,
  } = props || {};
  const addItemRef: React.Ref<ModalRefProps> = useRef(null);
  const [isLoading, LodingData] = useState(false);
  const [borderData, setBorderData] = useState("Expense");
  const [whoName, createPayoutWhoName] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [expenseArray, setExpenseArray]: any = useState([]);
  const [usertext, onUserSearch] = useState("");
  const [userList, recentlyJoinUser]: any = useState([]);
  const [usergratisList, userGratiesListData]: any = useState([]);
  const [userListArray, getUsetList]: any = useState([]);
  const [imageSelectArray, setImageSelectArray]: any = useState([]);
  const [imageSelectArrayKey, setImageSelectArrayKey]: any = useState([]);
  const [priceData, setPriceData] = useState(1);
  const [user_id, SetuserData] = useState({});
  const [amount, setAmount]: any = useState(0);

  const expenseContClick = (item: any) => {
    setBorderData(item);
  };

  const priceClick = (item: any) => {
    setPriceData(item);
  };

  const addBreakDownData = () => {
    onSuccessFulData(
      amount,
      descriptions,
      imageSelectArrayKey,
      user_id,
      borderData,
      priceData
    );
    resetState();
  };

  const submitClick = () => {
    if (amount < 0) {
      Toast.show("Enter Ammount", Toast.LONG, {
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
      addBreakDownData();
    }
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
      } else {
        Toast.show("Already Added", Toast.LONG, {
          backgroundColor: "black",
        });
      }
    } else {
      Toast.show("You can not select more than one users", Toast.LONG, {
        backgroundColor: "black",
      });
    }
  };

  const removeuserSelect = (id: any) => {
    const newPeople = userList.filter((person: any) => person !== id);
    console.log("--------newPeople---------", newPeople);

    recentlyJoinUser(newPeople);
  };

  async function gratisUserList(textUser: any) {
    const token = await AsyncStorage.getItem("token");
    var datas: any = {
      searchtext: textUser,
    };
    onUserSearch(textUser);
    LodingData(true);
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
      const result = dataItem?.data?.map((item: any) => {
        return { ...item };
      });
      userGratiesListData(result);
      console.log(dataItem);
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  // </---------------createPayoutAPI--------------------/>
  async function createPayoutAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");
    var item: any = {
      user_id: userId,
      amount: amount,
      description: descriptions,
      images: userListArray,
      // images:userList[0]['pic']
      // images: imageSelectArrayKey,
    };
    console.log(
      "----------------userListArray1111-------------",
      userList[0]["pic"]
    );
    console.log("----------------userListArray-------------", userListArray);

    var tempData = expenseArray;
    tempData.push(item);
    setExpenseArray(tempData);

    if (borderData === "Expense") {
      var data: any = {
        revenue_amount: revenue,
        total_expenses: expense,
        total_payout: payout,
        total_profit: profilt,
        remaining_amount: remainingAmt,
        // expenses: expenseArray,
        expenses: [],
        payouts: [],
      };
    } else if (borderData === "payout") {
      var data: any = {
        revenue_amount: revenue,
        total_expenses: expense,
        total_payout: payout,
        total_profit: profilt,
        remaining_amount: remainingAmt,
        expenses: [],
        // payouts: expenseArray,
        payouts: [],
      };
    }

    console.log(data, "---------------setExpenseArray----------------");
    console.log("=========== createPayoutAPI Request ==============");

    try {
      const response = await fetch(
        // API_URL + '/v1/events/event-financial/' + id,
        API_URL + "/v1/events/event-financial/6565af618267f45414608d66/create",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(data),
          // body: Object.keys(data)
          // .map(key => key + '=' + data[key])
          // .join('&'),
        }
      );

      const dataItem = await response.json();
      LodingData(false);
      console.log("=========== createPayoutAPI==============");
      console.log(dataItem);
      closeModal();
    } catch (error) {
      console.error(error);
      LodingData(false);
    }
  }

  const closeModal = () => {
    addItemRef.current?.onCloseModal();
  };

  const resetState = () => {
    // onUserSearch('');
    // setDescriptions('');
    // setAmount('');
    // setImageSelectArray([]);
    // SetuserData({});
    // recentlyJoinUser([]);
  };

  const openGallary = async () => {
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
      console.log(assets);
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

    console.log("================ postImageUploadAPI Request=================");
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
      var tempData = imageSelectArray;
      tempData.push(dataItem?.data);
      setImageSelectArray(tempData);
      console.log(" console.log(imageSelectArray)", imageSelectArray);
      var tempTwo = imageSelectArrayKey;

      tempTwo.push(dataItem?.data?.key);
      setImageSelectArrayKey(tempTwo);
      console.log(" console.log(imageSelectArrayKey)", imageSelectArrayKey);
      LodingData(false);
    } catch (error) {
      console.log(error);
      LodingData(false);
    }
  };

  return (
    <>
      <View style={styles.breakDownCont}>
        <ModalComponent ref={ref}>
          <Loader visible={isLoading} showOverlay />
          <View style={styles.subBreakdowncont}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.breakdownHeader}>Add Breakdown</Text>

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
                                width: 150,
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

              {/* <View style={styles.amountCont}>
              <Text style={styles.amountLbl}>Ammount</Text>
              <View style={{flexDirection: 'row'}}>
              <Text style={styles.dollarIcon}>$</Text>
              <TextInput
                value={amount}
                onChangeText={text => setAmount(text)}
                style={styles.dollarRupees}></TextInput>
                </View>
            </View> */}

              <View style={styles.amountCont}>
                <Text style={styles.amountLbl}>Ammount</Text>
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
                    <Text
                      style={styles.percentageSign}
                      // style={[
                      //   priceData === 1
                      //     ? styles.dollarSign
                      //     : styles.percentageSign,
                      // ]}
                    >
                      $
                    </Text>
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
                      <Text
                        style={styles.percentageSign}
                        // style={[
                        //   priceData === 2
                        //     ? styles.dollarSign
                        //     : styles.percentageSign,
                        // ]}
                      >
                        %
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View></View>
                )}
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.dollarIcon}>
                    {priceData === 1 ? "$" : "%"}
                  </Text>
                  <TextInput
                    value={amount}
                    keyboardType="number-pad"
                    onChangeText={(text) => setAmount(text)}
                    style={styles.dollarRupees}
                  ></TextInput>
                </View>
              </View>

              <View style={styles.descriptionCont}>
                <Text style={styles.descpLbl}>Description</Text>
                <View>
                  <TextInput
                    value={descriptions}
                    onChangeText={(text) => setDescriptions(text)}
                    style={styles.payoutDescLbl}
                  ></TextInput>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: "lightgrey",
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
                    <ImageComponent
                      source={{ uri: item?.imageUrl }}
                      style={styles.selectImage}
                    ></ImageComponent>
                  );
                })}
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={submitClick}>
                <View style={styles.submitButton}>
                  <Text style={styles.submitLbl}>Submit</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </ModalComponent>
      </View>
    </>
  );
};

export const BreakDownModal = forwardRef(AddBreakDownModal);
