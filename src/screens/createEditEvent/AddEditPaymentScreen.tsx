import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { redDeleteIcon, saveIcon } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { useMyUserId } from "~/navigation/AuthContext";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  EventMutations,
  useEventService,
} from "~/network/api/services/useEventService";
import { useUserService } from "~/network/api/services/useUserService";
import {
  Payment,
  PaymentData,
  PaymentSplit,
  PaymentType,
} from "~/types/payment";
import { createStyleSheet } from "./style";

export const AddEditPaymentScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.ADD_EDIT_PAYMENT>) => {
  const { eventId, paymentId } = route.params;

  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [isExpenseorPayout, setIsExpenseorPayout] = useState("Expense");
  const [priceData, setPriceData] = useState(1);
  const [amount, setAmount]: any = useState(0);
  const [descriptions, setDescriptions] = useState("");
  const [usertext, onUserSearch] = useState("");
  const [userList, recentlyJoinUser]: any = useState([]);
  const [usergratisList, userGratiesListData]: any = useState([]);
  const [userListArray, getUsetList]: any = useState();
  const [user_id, SetuserData] = useState({});
  const [imageSelectArray, setImageSelectArray]: any = useState([]);
  const [imageSelectArrayKey, setImageSelectArrayKey]: any = useState([]);
  const [newUserId, setNewUserIdData]: any = useState("");
  const [payoutListData, setPayoutListData]: any = useState([]);
  const [expensePayoutID, setExpensePayoutID]: any = useState();

  // TODO Stop copying this around and put it as its own hook
  const myUserId = useMyUserId();
  const {
    queries: { detail: getUser },
  } = useUserService();
  const { data: myUser } = useQuery(getUser(myUserId));

  const {
    queries: { paymentDetail },
  } = useEventService();

  const {
    data: payment,
    isPending,
    isLoading,
  } = useQuery({ ...paymentDetail(eventId, paymentId!), enabled: !!paymentId });

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentData>({
    defaultValues: {
      eventId,
      user: myUser,
      paymentType: PaymentType.Expense,
      paymentSplit: PaymentSplit.Fixed,
      amount: 0,
      description: "",
    },
  });

  const paymentType = useWatch({ control, name: "paymentType" });
  const paymentSplit = useWatch({ control, name: "paymentSplit" });

  const mutateDeletePayment = useMutation<Payment, Error, string>({
    mutationKey: [EventMutations.deletePayment],
  });

  // useFocusEffect(
  //   useCallback(() => {
  //     if (payoutExpenseObject != undefined) {
  //       recentlyJoinUser([payoutExpenseObject?.userSelectedData]);
  //       setNewUserIdData(payoutExpenseObject?.userSelectedData.id);
  //       setIsExpenseorPayout(payoutExpenseObject?.isPayoutorExpense);
  //       setDescriptions(payoutExpenseObject?.description);
  //       setExpensePayoutID(payoutExpenseObject?.expensePayoutID);

  //       if (payoutExpenseObject?.images.length > 0) {
  //         setImageSelectArray(payoutExpenseObject?.images);

  //         const imageKeyArry = [];
  //         for (
  //           let index = 0;
  //           index < payoutExpenseObject?.images.length;
  //           index++
  //         ) {
  //           imageKeyArry.push(payoutExpenseObject?.images[index]["key"]);
  //         }
  //         setImageSelectArrayKey(imageKeyArry);
  //       }
  //       if (payoutExpenseObject?.percentageAmount > 0) {
  //         setAmount(payoutExpenseObject.percentageAmount.toString());
  //         setPriceData(2);
  //       } else {
  //         setAmount(payoutExpenseObject.amount.toString());
  //         setPriceData(1);
  //       }
  //     }
  //   }, [payoutExpenseObject])
  // );

  // const expenseContClick = (item: any) => {
  //   setIsExpenseorPayout(item);
  // };

  // const priceClick = (item: any) => {
  //   setPriceData(item);
  // };

  // </---------------EditPayoutAPI--------------------/>

  // async function editExpenseAPI() {
  //   // LodingData(true);
  //   const token = await AsyncStorage.getItem("token");
  //   const url =
  //     process.env.API_URL +
  //     "/v3/events/event-financial/" +
  //     id +
  //     "/edit/expense";
  //   const item: any = {
  //     user_id: newUserId,
  //     amount: amount,
  //     description: descriptions,
  //     type: "price",
  //     images: imageSelectArrayKey,
  //     key: expensePayoutID,
  //   };
  //   try {
  //     const response = await fetch(url, {
  //       method: "post",
  //       headers: new Headers({
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //       }),
  //       body: JSON.stringify(item),
  //     });

  //     const dataItem = await response.json();
  //     console.log("------------editExpenseAPI response-------------", dataItem);
  //     LodingData(false);
  //     if (dataItem.success) {
  //       // onSuccessFulData(dataItem.data);
  //       navigation?.goBack();
  //       resetState();
  //     } else {
  //       Toast.show(dataItem?.message, Toast.LONG, {
  //         backgroundColor: "black",
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     LodingData(false);
  //   }
  // }

  // async function editPayoutAPI() {
  //   LodingData(true);
  //   const token = await AsyncStorage.getItem("token");
  //   const url =
  //     process.env.API_URL + "/v3/events/event-financial/" + id + "/edit/payout";

  //   const getAmount = (payoutExpenseObject?.profitAmt * amount) / 100;
  //   if (priceData === 1) {
  //     var item: any = {
  //       user_id: newUserId,
  //       amount: amount,
  //       description: descriptions,
  //       type: "price",
  //       images: imageSelectArrayKey,
  //       amount_percent: 0,
  //       key: expensePayoutID,
  //     };
  //   } else {
  //     var item: any = {
  //       user_id: newUserId,
  //       amount: getAmount,
  //       description: descriptions,
  //       type: "percentage",
  //       images: imageSelectArrayKey,
  //       amount_percent: amount,
  //       key: expensePayoutID,
  //     };
  //   }

  //   console.log("------------editPayoutAPI url-------------", url);
  //   console.log("------------editPayoutAPI request-------------", item);

  //   try {
  //     const response = await fetch(url, {
  //       method: "post",
  //       headers: new Headers({
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //       }),
  //       body: JSON.stringify(item),
  //     });
  //     const dataItem = await response.json();
  //     console.log("------------editPayoutAPI response-------------", dataItem);
  //     LodingData(false);
  //     if (dataItem.success) {
  //       // onSuccessFulData(dataItem.data);
  //       navigation?.goBack();
  //       resetState();
  //     } else {
  //       Toast.show(dataItem?.message, Toast.LONG, {
  //         backgroundColor: "black",
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     LodingData(false);
  //   }
  // }

  // </---------------Delete Expense and Payout--------------------/>

  const deleteClick = () => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete it?",
      [
        {
          text: "Yes",
          onPress: () => {
            mutateDeletePayment.mutate(paymentId!);
          },
          style: "destructive",
        },
        {
          text: "No",
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
    // postContentModal(false);
  };

  // const openGallary = async () => {
  //   const { assets } = await launchImageLibrary({
  //     mediaType: "photo",
  //     includeBase64: true,
  //     maxWidth: 800,
  //     maxHeight: 800,
  //   });
  //   if (assets) {
  //     const img = assets?.[0];
  //     const fileNameTwo = img?.fileName ?? "";
  //     LodingData(true);
  //     const output =
  //       fileNameTwo.substr(0, fileNameTwo.lastIndexOf(".")) || fileNameTwo;
  //     const base64Two = img?.base64 ?? "";
  //     postImageUploadAPI(output, base64Two);
  //   }
  // };

  // const postImageUploadAPI = async (fileItem: any, base64Item: any) => {
  //   const token = await AsyncStorage.getItem("token");
  //   const pic: any = {
  //     uploadKey: "createPostImg",
  //     imageName: fileItem,
  //     base64String: "data:image/jpeg;base64," + base64Item,
  //   };

  //   console.log("================ postImageUploadAPI Request=================");
  //   try {
  //     const response = await fetch(
  //       process.env.API_URL + "/v3/users/upload/file",
  //       {
  //         method: "post",
  //         headers: new Headers({
  //           Authorization: "Bearer " + token,
  //           "Content-Type": "application/json",
  //         }),
  //         body: JSON.stringify(pic),
  //       }
  //     );
  //     const dataItem = await response.json();
  //     const tempData = imageSelectArray;
  //     tempData.push(dataItem?.data);
  //     setImageSelectArray(tempData);
  //     const tempTwo = imageSelectArrayKey;

  //     tempTwo.push(dataItem?.data?.key);
  //     setImageSelectArrayKey(tempTwo);
  //     LodingData(false);
  //   } catch (error) {
  //     console.log(error);
  //     LodingData(false);
  //   }
  // };
  //
  // const removeSelectImage = (imageItem: any) => {
  //   const newImage = imageSelectArray.filter(
  //     (person: any) =>
  //       person.imageUrl !== imageItem.imageUrl && person.key !== imageItem.key
  //   );

  //   setImageSelectArray(newImage);

  //   const newImageKey = imageSelectArrayKey.filter(
  //     (person: any) => person !== imageItem.key
  //   );
  //   setImageSelectArrayKey(newImageKey);
  // };

  const handleSave = () => {
    const onSuccess = () => {
      navigation.goBack();
    };

    handleSubmit;
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.breakDownCont}>
          <View style={styles.subBreakdowncont}>
            {/* <ScrollView showsVerticalScrollIndicator={false}> */}
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
                  <Controller
                    control={control}
                    // rules={{
                    //   required: true,
                    // }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="select who to pay"
                        placeholderTextColor="darkgray"
                        // value={value}
                        // onChangeText={(text) => gratisUserList(text)}
                        style={styles.payInput}
                        onBlur={onBlur}
                      ></TextInput>
                    )}
                    name="user"
                  />
                  {errors.user && <Text>This is required.</Text>}
                </View>
              </View>

              {/* <UserChooser /> */}

              <View style={styles.TypeModalContainer}>
                <Text style={styles.typeCont}>Type:</Text>
                <View style={styles.typeDisplayCont}>
                  {paymentType === PaymentType.Expense ? (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        setValue("paymentType", PaymentType.Expense)
                      }
                    >
                      <Text
                        style={[
                          paymentType === PaymentType.Expense
                            ? styles.typeLbl
                            : styles.typeLblTwo,
                        ]}
                      >
                        Expense
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        setValue("paymentType", PaymentType.Payout)
                      }
                    >
                      <Text
                        style={[
                          paymentType === PaymentType.Payout
                            ? styles.typeLbl
                            : styles.typeLblTwo,
                        ]}
                      >
                        Payout
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.amountCont}>
                <Text style={styles.amountLbl}>Amount</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setValue("paymentSplit", PaymentSplit.Fixed)}
                >
                  <View
                    style={[
                      paymentSplit === PaymentSplit.Fixed
                        ? styles.priceContainer
                        : styles.priceContainerTwo,
                    ]}
                  >
                    <Text style={styles.percentageSign}>$</Text>
                  </View>
                </TouchableOpacity>
                {paymentType !== PaymentType.Expense ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      setValue("paymentSplit", PaymentSplit.Percent)
                    }
                  >
                    <View
                      style={[
                        paymentSplit === PaymentSplit.Percent
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
                    {paymentSplit === PaymentSplit.Fixed ? "$ " : "% "}
                  </Text>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value.toFixed(2)}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="number-pad"
                        style={styles.dollarRupees}
                      ></TextInput>
                    )}
                    name="amount"
                  />
                  {errors.amount && <Text>This is required.</Text>}
                </View>
              </View>

              <View style={styles.descriptionCont}>
                <Text style={styles.descpLbl}>Description</Text>
              </View>
              <View>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      multiline
                      onChangeText={onChange}
                      style={styles.payoutDescLbl}
                    ></TextInput>
                  )}
                  name="description"
                />
                {errors.description && <Text>This is required.</Text>}
              </View>

              {/* 
              TODO Add images
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
                    <TouchableOpacity onPress={() => removeSelectImage(item)}>
                      <ImageComponent
                        source={{ uri: item?.imageUrl }}
                        style={styles.selectImage}
                      ></ImageComponent>
                    </TouchableOpacity>
                  );
                })}
              </View> */}

              <View style={styles.submitButton}>
                <TouchableOpacity activeOpacity={0.8} onPress={handleSave}>
                  <ImageComponent
                    source={saveIcon}
                    style={styles.saveIcon}
                  ></ImageComponent>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteClick}>
                  <ImageComponent
                    source={redDeleteIcon}
                    style={styles.deleteIcon}
                  ></ImageComponent>
                </TouchableOpacity>
              </View>
              {/* </ScrollView> */}
            </KeyboardAwareScrollView>
          </View>
        </View>
      </View>
    </>
  );
};
