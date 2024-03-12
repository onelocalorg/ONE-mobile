import { useAppTheme } from "@app-hooks/use-app-theme";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ListRenderItem,
  Modal,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ScrollView,
  LogBox,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createStyleSheet } from "./style";
import { useStringsAndLabels } from "@app-hooks/use-strings-and-labels";
import { Pill } from "@components/pill";
import {
  eventWhite,
  gratitude,
  save,
  explorer,
  operator,
  serviceProvider,
  postImage,
  bucket,
  loginLogo,
  arrowLeft,
  pin,
  arrowDown,
  buttonArrow,
  addCard,
  buttonArrowBlue,
  downImg,
  closeCard,
  addGreen,
} from "@assets/images";
import { ModalRefProps } from "@components/modal-component";
import { ImageComponent } from "@components/image-component";
import { Input } from "@components/input";
import { FlatListComponent } from "@components/flatlist-component";
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { usePackagePlans } from "@network/hooks/home-service-hooks/use-package-plans";
import { Subscription } from "@components/subcription";
import GestureRecognizer from "react-native-swipe-gestures";
import { useToken } from "@app-hooks/use-token";
import { normalScale, verticalScale } from "@theme/device/normalize";
import { useSelector } from "react-redux";
import { StoreType } from "@network/reducers/store";
import { UserProfileState } from "@network/reducers/user-profile-reducer";
import { navigations } from "@config/app-navigation/constant";
import { Loader } from "@components/loader";
import { ButtonComponent } from "@components/button-component";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, getData, persistKeys } from "@network/constant";
import { height, width } from "@theme/device/device";
import { useEditProfile } from "@network/hooks/user-service-hooks/use-edit-profile";
import { ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface AboutDataProps {
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

export const About = (props: AboutDataProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const {
    about,
    skills,
    profileAnswers,
    idUser,
    onEditProfile,
    navigation,
    route,
  } = props || {};
  const [updatedAbout, setAbout] = useState(about);
  const [allSkills, setSkills] = useState(skills);
  const [skillValue, setSkillValue]: any = useState("");
  // var { data } = usePackagePlans();
  const [packageItem, PackageListData]: any = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [postData, setDataEntries]: any = useState({});

  const [isBilledMonthly, setIsBilledMonthly] = useState(true);
  const [isLoading, LodingData] = useState(false);
  const { token } = useToken();
  const { id } = route?.params ?? {};
  const [dataItem, memberShipData] = useState();
  const [monthlyPlan, monthlyPlanData]: any = useState<any[]>([]);
  const [yearlyPlan, yearlyPlanData]: any = useState<any[]>([]);
  // const [, ] = useState();
  const [cardData, addCardList]: any = useState<any[]>([]);
  const [description, descriptionData] = useState();
  const [idPackage, packageIdData] = useState();
  const [monthPrice, monthlyPrice] = useState();
  const [YerlyPrice, yearlyPrices] = useState();
  const [membershipId, MembershipCheckOutID] = useState();
  const handleBillingSubscription = (value: boolean) => {
    setIsBilledMonthly(value);
  };
  const [tokens, setToken] = useState("");
  const [cardnumber, cardNumberData] = useState("");
  const [cardExpmonth, cardExpMonth] = useState("");
  const [cardExpyear, cardExpYears] = useState("");
  const [cardCvv, cardCVVData] = useState("");
  const [date, setDate] = useState("");
  const [addcard, addCardModal] = useState(false);
  const [openQues, quesAnsModal] = useState(false);
  const [planId, cancleSubscription] = useState();
  // var [usersId, userIdData] = useState(idUser);
  console.log("==============usersId==========", idUser);
  var [ansQueData, submitAnsState] = useState(profileAnswers);
  var [ansQueDataTwo, submitAnsStateTwo] = useState(profileAnswers);
  const isShowPaymentCheck = getData("isShowPaymentFlow");

  console.log("==============ansQueData==========", ansQueData);
  console.log("allSkills==============", allSkills);

  console.log("============s=dada", token);
  const {} = props || {};
  useEffect(() => {
    packageListAPI();
    setAbout(about);
    setSkills(skills);
    submitAnsState(profileAnswers);
    submitAnsStateTwo(profileAnswers);
  }, [about, skills, profileAnswers]);

  // =================Update Answer API====================

  async function updateAnswerAPI() {
    var queAns: any = {
      profile_answers: ansQueData,
    };
    console.log(
      "============https://true-guinea-heartily.ngrok-free.app/v1/users/profile/que-answers=============="
    );
    console.log("============Request==============", queAns);
    try {
      const response = await fetch(API_URL + "/v1/users/profile/que-answers", {
        method: "PATCH",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json; charset=UTF-8",
        }),
        body: JSON.stringify({
          profile_answers: ansQueData,
        }),
      });
      const QuestioAnswer = await response.json();

      console.log("===========Response==============");
      LodingData(false);
      console.log(QuestioAnswer);
      userProfileUpdate();
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  // =================Package List API====================

  async function packageListAPI() {
    const token = await AsyncStorage.getItem("token");
    console.log(token);
    try {
      const response = await fetch(API_URL + "/v1/subscriptions/packages", {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
      });
      const data = await response.json();
      PackageListData(data?.data);
      console.log("===========Player List ==============");
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function userProfileUpdate() {
    console.log(token);
    console.log(idUser);
    try {
      const response = await fetch(API_URL + "/v1/users/" + idUser, {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
      });
      const dataItem = await response.json();
      console.log("===========User Profile data Response==============");
      if (dataItem?.data?.isEventActiveSubscription === true) {
        AsyncStorage.setItem("isEventActive", "true");
      } else {
        AsyncStorage.setItem("isEventActive", "false");
      }
      submitAnsState(dataItem?.data?.profile_answers);

      console.log(dataItem?.data?.profile_answers);
    } catch (error) {
      console.error(error);
    }
  }

  // =================Package Detail API====================

  async function packageDetailAPI(dataId: any) {
    console.log(token);
    console.log(dataId);
    try {
      const response = await fetch(
        API_URL + "/v1/subscriptions/packages/" + dataId,
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
        }
      );
      packageIdData(dataId);
      const dataItem = await response.json();
      console.log("===========Player detail ==============");
      console.log(dataItem);
      setDataEntries(dataItem?.data);
      console.log(dataItem, "=============data item===============");
      cancleSubscription(dataItem?.data?.current_plan_id);
    } catch (error) {
      console.error(error);
    }
  }

  // ================= Purchase API ====================

  async function onPurchaseAPI() {
    LodingData(true);
    if (isBilledMonthly) {
      var purchesData: any = {
        plan_id: monthlyPlan.plan_id,
        price_id: monthlyPlan.price_id,
        totalUnitsMonthly: monthPrice,
      };
    } else if (!isBilledMonthly) {
      var purchesData: any = {
        plan_id: yearlyPlan.plan_id,
        price_id: yearlyPlan.price_id,
        totalUnitsMonthly: YerlyPrice,
      };
    }

    console.log(purchesData);

    console.log(idPackage);

    try {
      const response = await fetch(
        API_URL + "/v1/subscriptions/" + idPackage + "/purchase",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          body: Object.keys(purchesData)
            .map((key) => key + "=" + purchesData[key])
            .join("&"),
        }
      );
      const dataItem = await response.json();
      LodingData(false);
      console.log("=========== Purchase API ==============");
      console.log(dataItem);
      if (dataItem.success == true) {
        packageListAPI();
        userProfileUpdate();
        setModalVisible(false);
        setMemberModal(false);
        Toast.show(dataItem.message, Toast.LONG, {
          backgroundColor: "black",
        });
      } else {
        Toast.show(dataItem.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  // ================= Cancle Subscription API ====================

  async function cancleSubscriptionAPI() {
    LodingData(true);
    var data: any = {
      plan_id: planId,
    };
    console.log(data);
    console.log(idPackage);
    try {
      const response = await fetch(
        API_URL + "/v1/subscriptions/" + idPackage + "/cancel",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          body: Object.keys(data)
            .map((key) => key + "=" + data[key])
            .join("&"),
        }
      );
      const dataItem = await response.json();
      console.log("=========== Cancle Subscription API ==============");
      console.log(dataItem);
      if (dataItem.success == true) {
        Toast.show(dataItem.message, Toast.LONG, {
          backgroundColor: "black",
        });
        packageListAPI();
        setModalVisible(false);
      } else {
        Toast.show(dataItem.message, Toast.LONG, {
          backgroundColor: "black",
        });
        packageListAPI();
        setModalVisible(false);
      }
      LodingData(false);
    } catch (error) {
      LodingData(false);

      console.error(error);
    }
  }

  const quesAnsModalHide = () => {
    LodingData(true);
    updateAnswerAPI();
    quesAnsModal(false);
  };

  const updateAnsBack = () => {
    quesAnsModal(false);
  };

  const quesAnsModalOpen = () => {
    updateAnswerAPI();
    quesAnsModal(true);
  };

  const onPlayerClick = async (id: any) => {
    console.log("====id===", id);
    setTimeout(() => {
      setModalVisible(true);
      setMemberModal(false);
    }, 1000);
    packageDetailAPI(id);
  };

  const openSettingsModal = () => {
    setModalVisible(false);
  };

  const memberShipClick = async (id: any) => {
    console.log("====id===", id);
    setTimeout(() => {
      setMemberModal(true);
    }, 1000);
    memberShipCheckoutAPI(id);
  };

  const memberShipHide = () => {
    setMemberModal(false);
  };

  const addCardModalHide = () => {
    addCardModal(false);
    cardNumberData("");
    cardExpMonth("");
    cardExpYears("");
    cardCVVData("");
  };

  const handleRemove = (id: any) => {
    const newPeople = allSkills.filter((person) => person !== id);
    console.log("--------newPeople---------", newPeople);

    setSkills(newPeople);
  };

  const onAddSkill = (text: any) => {
    const foundSkill = allSkills.find((data: any) => data == text);
    if (!foundSkill) {
      if (text !== "" && text !== undefined) {
        setSkills([...allSkills, text]);
        console.log("onSubmitEditing onSubmitEditing", allSkills, text);
        setSkillValue("");
      }
    } else {
      Toast.show("Already Added", Toast.LONG, {
        backgroundColor: "black",
      });
    }
  };

  const onSaveProfile = () => {
    console.log("===========onSaveProfile===========");

    let request = {};

    if (about !== updatedAbout) {
      request = { ...request, about: updatedAbout };
    }
    if (allSkills.length) {
      request = { ...request, skills: allSkills };
    }
    onEditProfile?.(request);
  };

  const renderItem: ListRenderItem<string> = ({ item }) => (
    <Pill
      onPressPill={() => handleRemove(item)}
      pillStyle={styles.marginBottom}
      key={item}
      label={item}
    />
  );

  const getTextStyle: any = (itemCss: any) => {
    if (itemCss.status) {
      return {
        borderRadius: theme.borderRadius.radius20,
        paddingVertical: verticalScale(6),
        paddingHorizontal: normalScale(6),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginRight: normalScale(8),
        shadowColor: theme.colors.black,
        shadowOpacity: theme.opacity.opacity15,
        shadowRadius: theme.borderRadius.radius8,
        backgroundColor: itemCss.color,
        borderWidth: theme.borderWidth.borderWidth1,
        borderColor: theme.colors.black,
        shadowOffset: {
          width: 0,
          height: verticalScale(0),
        },
        elevation: 5,
      };
    } else {
      return {
        borderRadius: theme.borderRadius.radius20,
        paddingVertical: verticalScale(8),
        paddingHorizontal: normalScale(8),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginRight: normalScale(8),
        shadowColor: theme.colors.black,
        shadowOpacity: theme.opacity.opacity15,
        shadowRadius: theme.borderRadius.radius8,
        backgroundColor: itemCss.color,
        // borderWidth:theme.borderWidth.borderWidth1,
        // borderColor:theme.colors.black,
        shadowOffset: {
          width: 0,
          height: verticalScale(0),
        },
        elevation: 5,
      };
    }
  };

  const getTextStyleDetail: any = (itemCss: any) => {
    return {
      borderRadius: theme.borderRadius.radius20,
      paddingVertical: verticalScale(8),
      paddingHorizontal: normalScale(8),
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: itemCss.color,
      // marginRight: normalScale(8),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      marginLeft: 20,
      marginRight: 20,
      fontSize: theme.fontSize.font24,
      fontFamily: theme.fontType.medium,
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.white,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
    };
  };

  const onOpenModal = () => {
    // addcardRef.current?.onOpenModal();
    addCardModal(true);
  };

  // =================MemberShip Checkout API====================

  async function memberShipCheckoutAPI(dataId: any) {
    MembershipCheckOutID(dataId);
    console.log(dataId, "dataId dataId------------------------------------");
    try {
      const response = await fetch(
        API_URL + "/v1/subscriptions/packages/" + dataId + "/checkout",
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
        }
      );
      const dataItems = await response.json();
      memberShipData(dataItems);
      console.log("===========MemberShip checkout==============");
      console.log(dataItems);
      // setDatacheckout(dataItem);
      monthlyPlanData(dataItems?.data?.plans[0]);
      yearlyPlanData(dataItems?.data?.plans[1]);
      monthlyPrice(
        dataItems?.data?.customerBill?.billSummaryMonthly?.totalUnitsMonthly
      );
      yearlyPrices(
        dataItems?.data?.customerBill?.billSummaryYearly?.totalUnitsYearly
      );
      descriptionData(dataItems.data.description);
      addCardList(dataItems?.data?.card);
      console.log("=======================dsd==ds=d==========");
      console.log(monthlyPlan);
      console.log(yearlyPlan);
      console.log(description);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    LogBox.ignoreAllLogs();
    const checkToken = async () => {
      const tok = (await AsyncStorage.getItem(persistKeys.token)) ?? "";
      setToken(tok);
      console.log(tokens);
    };
    setTimeout(() => {}, 3000);

    checkToken();
  }, []);

  // ======================Config API=========================
  const ConfigListAPI = async () => {
    try {
      const response = await fetch(API_URL + "/v1/config/list", {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + tokens,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
      });
      const dataItem = await response.json();
      console.log("-----------------add card config list------------");
      const keyId = dataItem?.data?.stripe?.stripePublicKey;
      console.log(dataItem);
      setTimeout(() => {
        cardStripeAPI(keyId);
      }, 2000);
      setTimeout(() => {
        LodingData(false);
      }, 7000);
    } catch (error) {
      console.error(error);
    }
  };

  // ======================Stripe API=========================

  async function cardStripeAPI(stripeId: any) {
    const genCard: any = {
      "card[number]": cardnumber,
      "card[exp_month]": cardExpmonth,
      "card[exp_year]": cardExpyear,
      "card[cvc]": cardCvv,
    };

    console.log(genCard);

    const results = await fetch("https://api.stripe.com/v1/tokens", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + stripeId,
      },
      body: Object.keys(genCard)
        .map((key) => key + "=" + genCard[key])
        .join("&"),
    }).then((response) => response.json());

    const card_tok = results.id;

    setTimeout(() => {
      if (results.id) {
        CreateCardAPI(card_tok);
        console.log("============CreateCardAPI============");
      }
    }, 3000);

    console.log("================card stripe api==================");
    console.log(results);

    if (results.error) {
      Toast.show(results.error.message, Toast.LONG, {
        backgroundColor: "black",
      });
    }

    return;
  }

  // ======================Create Card API=========================
  async function CreateCardAPI(cardId: any) {
    var cardtokenData: any = {
      token: cardId,
    };
    try {
      const response = await fetch(API_URL + "/v1/subscriptions/cards/create", {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + tokens,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
        body: Object.keys(cardtokenData)
          .map((key) => key + "=" + cardtokenData[key])
          .join("&"),
      });
      console.log(cardId);
      const dataItem = await response.json();
      console.log("-----------------create card------------");
      console.log(dataItem);
      cardNumberData("");
      cardExpMonth("");
      cardExpYears("");
      cardCVVData("");
      setDate("");
      memberShipCheckoutAPI(membershipId);
      if (dataItem.success == true) {
        addCardModal(false);
      }
      Toast.show(dataItem.message, Toast.LONG, {
        backgroundColor: "black",
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function onCheckValidation() {
    LodingData(true);
    if (cardnumber.length != 16) {
      LodingData(false);
      Toast.show("Invalide Card Number", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (date.length != 5) {
      LodingData(false);
      Toast.show("Invalide Date", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (cardCvv.length != 3) {
      LodingData(false);
      Toast.show("Invalide CVV Number", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      ConfigListAPI();
    }
  }

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
    console.log("===========ansQueData 22==========", ansQueData);
  }

  async function deleteUserAccountAPI() {
    const token = await AsyncStorage.getItem("token");
    console.log(token);
    try {
      const response = await fetch(API_URL + "/v1/users/delete/" + idUser, {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
      });
      const dataItem = await response.json();
      console.log("===========Delete Account data Response==============");
      console.log(API_URL + "/v1/users/delete/" + idUser);
      LodingData(false);
      console.log(dataItem);
      if (dataItem.success === true) {
        navigation?.navigate(navigations?.LOGIN);
      }
      Toast.show(dataItem.message, Toast.LONG, {
        backgroundColor: "black",
      });
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  const deleteAccount = () => {
    Alert.alert(
      strings.deleteAccount,
      strings.areYouDeleteAccount,
      [
        { text: strings.no, onPress: () => null, style: "cancel" },
        {
          text: strings.yes,
          onPress: () => {
            deleteUserAccountAPI();
            LodingData(true);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <View style={styles.innerConatiner}>
        <Loader visible={false} showOverlay />

        {isShowPaymentCheck ? (
          <>
            <View style={styles.rowOnly}>
              <Text style={styles.membership}>{strings.membership}</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={onSaveProfile}>
                <ImageComponent source={save} style={styles.save} />
              </TouchableOpacity>
            </View>
            <GestureRecognizer>
              <TouchableOpacity
                // style={{ flex: 1 }}
                onPressOut={() => {
                  setModalVisible(false);
                }}
              >
                <Modal
                  transparent
                  onDismiss={() => setModalVisible(false)}
                  visible={modalVisible}
                >
                  <GestureRecognizer
                    onSwipeDown={() => setModalVisible(false)}
                    style={styles.gesture}
                  >
                    <TouchableOpacity
                      style={styles.containerGallery}
                      activeOpacity={1}
                      onPress={() => setModalVisible(false)}
                    />
                  </GestureRecognizer>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardViewTwo}
                  >
                    <Loader visible={false} showOverlay />
                    <View style={styles.packageDetailModal}>
                      <ScrollView
                        showsVerticalScrollIndicator={false}
                        horizontal={false}
                      >
                        <TouchableOpacity
                          activeOpacity={0}
                          onPress={() => {
                            openSettingsModal();
                          }}
                        >
                          <TouchableOpacity
                            style={getTextStyleDetail(postData)}
                            activeOpacity={0.8}
                          >
                            <ImageComponent
                              source={{ uri: postData.role_image }}
                              style={[styles.icon]}
                            />
                            <Text style={styles.label}>{postData.title}</Text>
                          </TouchableOpacity>

                          <Text style={styles.playerDescription}>
                            {postData.description}
                          </Text>
                          {/* <ImageComponent source={{ uri: val.background_image }} style={styles.postImageStyle}></ImageComponent> */}
                          {postData.status == false ? (
                            <Subscription
                              label={strings.signUp}
                              pillStyle={styles.signUpStyle}
                              backgroundColor={postData.color}
                              onPressPill={() => memberShipClick(postData.id)}
                              // onPressPill={onOpenMemberShip}
                            />
                          ) : (
                            <View></View>
                          )}
                          <Text style={styles.playerText}>
                            {postData.defaultSignupText}
                          </Text>
                          {postData.status == true ? (
                            <TouchableOpacity onPress={cancleSubscriptionAPI}>
                              <Text style={styles.cancleSubStyle}>
                                {strings.cancleSubscription}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <View></View>
                          )}
                        </TouchableOpacity>
                      </ScrollView>
                    </View>
                    {/* </>
                    );
                  })} */}
                  </KeyboardAvoidingView>
                  <Modal
                    transparent
                    onDismiss={memberShipHide}
                    visible={memberModal}
                  >
                    <GestureRecognizer
                      onSwipeDown={memberShipHide}
                      style={styles.gesture}
                    >
                      <TouchableOpacity
                        style={styles.containerGallery}
                        activeOpacity={1}
                        onPress={memberShipHide}
                      />
                    </GestureRecognizer>
                    <Loader visible={isLoading} showOverlay />

                    {Platform.OS === "android" ? (
                      <View>
                        <View style={styles.packageModalMembership}>
                          <ScrollView
                            overScrollMode="always"
                            showsVerticalScrollIndicator={false}
                            horizontal={false}
                          >
                            <TouchableOpacity
                              disabled
                              activeOpacity={0}
                              onPress={() => {
                                memberShipHide();
                              }}
                            >
                              <Text style={styles.memberTitle}>
                                {strings.membershipCheckout}
                              </Text>

                              <View style={styles.modalContainer}>
                                <TouchableOpacity
                                  style={[
                                    styles.memberShipCheckputContainer,
                                    { backgroundColor: postData.color },
                                  ]}
                                  activeOpacity={0.8}
                                >
                                  <ImageComponent
                                    source={{ uri: postData.role_image }}
                                    style={[styles.icon1]}
                                  />
                                  <Text style={styles.label1}>
                                    {postData.title}
                                  </Text>
                                </TouchableOpacity>
                                <View style={styles.selectContainer}>
                                  <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[
                                      styles.selectView,
                                      isBilledMonthly &&
                                        styles.selectedSelectView,
                                    ]}
                                    onPress={() =>
                                      handleBillingSubscription(true)
                                    }
                                  >
                                    {monthlyPlan?.price?.$numberDecimal ? (
                                      <Text style={styles.amount}>
                                        {`$${parseInt(
                                          monthlyPlan?.price?.$numberDecimal,
                                          10
                                        )}`}
                                      </Text>
                                    ) : (
                                      <Text style={styles.amount}>$00</Text>
                                    )}

                                    <Text style={styles.bill}>
                                      {monthlyPlan?.name}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[
                                      styles.selectView,
                                      !isBilledMonthly &&
                                        styles.selectedSelectView,
                                    ]}
                                    onPress={() =>
                                      handleBillingSubscription(false)
                                    }
                                  >
                                    {yearlyPlan?.price?.$numberDecimal ? (
                                      <Text style={styles.amount}>{`$${parseInt(
                                        yearlyPlan?.price?.$numberDecimal,
                                        10
                                      )}`}</Text>
                                    ) : (
                                      <Text style={styles.amount}>$00</Text>
                                    )}
                                    <Text style={styles.bill}>
                                      {yearlyPlan?.name}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                <Text style={styles.playerDescription}>
                                  {description}
                                </Text>

                                <View>
                                  <Text style={styles.paymentInfo}>
                                    {strings.paymentinfo}
                                  </Text>
                                </View>
                                {cardData?.brand ? (
                                  <View>
                                    <View style={styles.cardList}>
                                      <Text style={styles.cardNum}>
                                        {cardData?.brand}
                                      </Text>
                                      <Text style={styles.dotclass}>
                                        {strings.dot}
                                      </Text>
                                      <Text style={styles.cardNum}>
                                        {cardData?.last4}
                                      </Text>
                                    </View>
                                    <View style={styles.cardList}>
                                      <Text style={styles.CardexpDate}>
                                        {strings.exp}
                                      </Text>
                                      <Text style={styles.CardexpDate}>
                                        {cardData?.exp_month}
                                        {strings.slash}
                                        {cardData?.exp_year}
                                      </Text>
                                    </View>
                                  </View>
                                ) : (
                                  <View></View>
                                )}

                                <TouchableOpacity
                                  activeOpacity={0.8}
                                  onPress={onOpenModal}
                                  style={styles.addViewcard}
                                >
                                  <Text style={styles.addCard}>
                                    {strings.addCard}
                                  </Text>
                                </TouchableOpacity>
                                <View style={styles.purchesButton}>
                                  <TouchableOpacity
                                    onPress={onPurchaseAPI}
                                    activeOpacity={0.8}
                                    style={styles.purchaseContainer}
                                  >
                                    <View />
                                    <Text style={styles.title}>
                                      {strings.purchase}
                                    </Text>
                                    <ImageComponent
                                      source={buttonArrow}
                                      style={styles.buttonArrow}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </ScrollView>
                        </View>

                        <Modal
                          transparent
                          onDismiss={addCardModalHide}
                          visible={addcard}
                        >
                          <GestureRecognizer
                            onSwipeDown={addCardModalHide}
                            style={styles.gesture}
                          >
                            <TouchableOpacity
                              style={styles.containerGallery}
                              activeOpacity={1}
                              onPress={addCardModalHide}
                            />
                          </GestureRecognizer>
                          <Loader visible={isLoading} showOverlay />
                          <KeyboardAvoidingView style={styles.keyboardViewTwo}>
                            <View style={styles.addCardBorderContainer}>
                              <View>
                                <TouchableOpacity
                                  onPress={() => {
                                    addCardModalHide();
                                  }}
                                >
                                  <ImageComponent
                                    style={styles.closeCardCont}
                                    source={closeCard}
                                  ></ImageComponent>
                                </TouchableOpacity>

                                <Text style={styles.addCardTitle}>
                                  {strings.addCardOne}
                                </Text>
                                <Text style={styles.addCardInfo}>
                                  {strings.cardinfo}
                                </Text>
                                <View>
                                  <ImageComponent
                                    source={addCard}
                                    style={styles.addCardLogo}
                                  />
                                  <TextInput
                                    placeholderTextColor="darkgray"
                                    value={cardnumber}
                                    maxLength={16}
                                    keyboardType="numeric"
                                    style={styles.addCardInput}
                                    placeholder="card number"
                                    onChangeText={(value) => {
                                      console.log(value);
                                      cardNumberData(value);
                                    }}
                                  />
                                  <View style={styles.cardView}>
                                    <TextInput
                                      placeholderTextColor="darkgray"
                                      onChangeText={(text) => {
                                        setDate(
                                          text.length === 3 &&
                                            !text.includes("/")
                                            ? `${text.substring(
                                                0,
                                                2
                                              )}/${text.substring(2)}`
                                            : text
                                        );
                                        const [month, year] = text.split("/");
                                        console.log(month);
                                        console.log(year);

                                        cardExpMonth(month);
                                        cardExpYears(year);
                                      }}
                                      placeholder="mm/yy"
                                      keyboardType="number-pad"
                                      maxLength={5}
                                      style={styles.addCardDateInput}
                                      value={date}
                                    />

                                    <TextInput
                                      placeholderTextColor="darkgray"
                                      value={cardCvv}
                                      maxLength={3}
                                      keyboardType="numeric"
                                      style={styles.addCardCVCInput}
                                      placeholder="cvc"
                                      onChangeText={(value) => {
                                        console.log(value);
                                        cardCVVData(value);
                                      }}
                                    />
                                  </View>
                                </View>

                                <View>
                                  <ButtonComponent
                                    onPress={onCheckValidation}
                                    title={strings.addCardTwo}
                                    buttonStyle={styles.addCardContainer}
                                    icon={buttonArrowBlue}
                                  />
                                </View>
                              </View>
                            </View>
                          </KeyboardAvoidingView>
                        </Modal>
                      </View>
                    ) : (
                      <View></View>
                    )}

                    {Platform.OS === "ios" ? (
                      <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.keyboardViewTwo}
                      >
                        <View>
                          <View style={styles.packageModalMembership}>
                            <ScrollView
                              overScrollMode="always"
                              showsVerticalScrollIndicator={false}
                              horizontal={false}
                            >
                              <TouchableOpacity
                                disabled
                                activeOpacity={0}
                                onPress={() => {
                                  memberShipHide();
                                }}
                              >
                                <Text style={styles.memberTitle}>
                                  {strings.membershipCheckout}
                                </Text>

                                <View style={styles.modalContainer}>
                                  <TouchableOpacity
                                    style={[
                                      styles.memberShipCheckputContainer,
                                      { backgroundColor: postData.color },
                                    ]}
                                    activeOpacity={0.8}
                                  >
                                    <ImageComponent
                                      source={{ uri: postData.role_image }}
                                      style={[styles.icon1]}
                                    />
                                    <Text style={styles.label1}>
                                      {postData.title}
                                    </Text>
                                  </TouchableOpacity>
                                  <View style={styles.selectContainer}>
                                    <TouchableOpacity
                                      activeOpacity={0.8}
                                      style={[
                                        styles.selectView,
                                        isBilledMonthly &&
                                          styles.selectedSelectView,
                                      ]}
                                      onPress={() =>
                                        handleBillingSubscription(true)
                                      }
                                    >
                                      {monthlyPlan?.price?.$numberDecimal ? (
                                        <Text style={styles.amount}>
                                          {`$${parseInt(
                                            monthlyPlan?.price?.$numberDecimal,
                                            10
                                          )}`}
                                        </Text>
                                      ) : (
                                        <Text style={styles.amount}>$00</Text>
                                      )}

                                      <Text style={styles.bill}>
                                        {monthlyPlan?.name}
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      activeOpacity={0.8}
                                      style={[
                                        styles.selectView,
                                        !isBilledMonthly &&
                                          styles.selectedSelectView,
                                      ]}
                                      onPress={() =>
                                        handleBillingSubscription(false)
                                      }
                                    >
                                      {yearlyPlan?.price?.$numberDecimal ? (
                                        <Text
                                          style={styles.amount}
                                        >{`$${parseInt(
                                          yearlyPlan?.price?.$numberDecimal,
                                          10
                                        )}`}</Text>
                                      ) : (
                                        <Text style={styles.amount}>$00</Text>
                                      )}
                                      <Text style={styles.bill}>
                                        {yearlyPlan?.name}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <Text style={styles.playerDescription}>
                                    {description}
                                  </Text>

                                  <View>
                                    <Text style={styles.paymentInfo}>
                                      {strings.paymentinfo}
                                    </Text>
                                  </View>
                                  {cardData?.brand ? (
                                    <View>
                                      <View style={styles.cardList}>
                                        <Text style={styles.cardNum}>
                                          {cardData?.brand}
                                        </Text>
                                        <Text style={styles.dotclass}>
                                          {strings.dot}
                                        </Text>
                                        <Text style={styles.cardNum}>
                                          {cardData?.last4}
                                        </Text>
                                      </View>
                                      <View style={styles.cardList}>
                                        <Text style={styles.CardexpDate}>
                                          {strings.exp}
                                        </Text>
                                        <Text style={styles.CardexpDate}>
                                          {cardData?.exp_month}
                                          {strings.slash}
                                          {cardData?.exp_year}
                                        </Text>
                                      </View>
                                    </View>
                                  ) : (
                                    <View></View>
                                  )}

                                  <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={onOpenModal}
                                    style={styles.addViewcard}
                                  >
                                    <Text style={styles.addCard}>
                                      {strings.addCard}
                                    </Text>
                                  </TouchableOpacity>
                                  <View style={styles.purchesButton}>
                                    <TouchableOpacity
                                      onPress={onPurchaseAPI}
                                      activeOpacity={0.8}
                                      style={styles.purchaseContainer}
                                    >
                                      <View />
                                      <Text style={styles.title}>
                                        {strings.purchase}
                                      </Text>
                                      <ImageComponent
                                        source={buttonArrow}
                                        style={styles.buttonArrow}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </ScrollView>
                          </View>

                          <Modal
                            transparent
                            onDismiss={addCardModalHide}
                            visible={addcard}
                          >
                            <GestureRecognizer
                              onSwipeDown={addCardModalHide}
                              style={styles.gesture}
                            >
                              <TouchableOpacity
                                style={styles.containerGallery}
                                activeOpacity={1}
                                onPress={addCardModalHide}
                              />
                            </GestureRecognizer>
                            <Loader visible={isLoading} showOverlay />
                            <KeyboardAvoidingView
                              behavior={
                                Platform.OS === "ios" ? "position" : "height"
                              }
                              style={styles.keyboardViewTwo}
                            >
                              <View style={styles.addCardBorderContainer}>
                                <View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      addCardModalHide();
                                    }}
                                  >
                                    <ImageComponent
                                      style={styles.closeCardCont}
                                      source={closeCard}
                                    ></ImageComponent>
                                  </TouchableOpacity>

                                  <Text style={styles.addCardTitle}>
                                    {strings.addCardOne}
                                  </Text>
                                  <Text style={styles.addCardInfo}>
                                    {strings.cardinfo}
                                  </Text>
                                  <View>
                                    <ImageComponent
                                      source={addCard}
                                      style={styles.addCardLogo}
                                    />
                                    <TextInput
                                      placeholderTextColor="darkgray"
                                      value={cardnumber}
                                      maxLength={16}
                                      keyboardType="numeric"
                                      style={styles.addCardInput}
                                      placeholder="card number"
                                      onChangeText={(value) => {
                                        console.log(value);
                                        cardNumberData(value);
                                      }}
                                    />
                                    <View style={styles.cardView}>
                                      <TextInput
                                        placeholderTextColor="darkgray"
                                        onChangeText={(text) => {
                                          setDate(
                                            text.length === 3 &&
                                              !text.includes("/")
                                              ? `${text.substring(
                                                  0,
                                                  2
                                                )}/${text.substring(2)}`
                                              : text
                                          );
                                          const [month, year] = text.split("/");
                                          console.log(month);
                                          console.log(year);

                                          cardExpMonth(month);
                                          cardExpYears(year);
                                        }}
                                        placeholder="mm/yy"
                                        keyboardType="number-pad"
                                        maxLength={5}
                                        style={styles.addCardDateInput}
                                        value={date}
                                      />

                                      <TextInput
                                        placeholderTextColor="darkgray"
                                        value={cardCvv}
                                        maxLength={3}
                                        keyboardType="numeric"
                                        style={styles.addCardCVCInput}
                                        placeholder="cvc"
                                        onChangeText={(value) => {
                                          console.log(value);
                                          cardCVVData(value);
                                        }}
                                      />
                                    </View>
                                  </View>

                                  <View>
                                    <ButtonComponent
                                      onPress={onCheckValidation}
                                      title={strings.addCardTwo}
                                      buttonStyle={styles.addCardContainer}
                                      icon={buttonArrowBlue}
                                    />
                                  </View>
                                </View>
                              </View>
                            </KeyboardAvoidingView>
                          </Modal>
                        </View>
                      </KeyboardAvoidingView>
                    ) : (
                      <View></View>
                    )}
                  </Modal>
                </Modal>
              </TouchableOpacity>
            </GestureRecognizer>
            <View style={{ flex: 1 }}>
              {packageItem ? (
                <FlatList
                  keyExtractor={(item) => item.id}
                  data={packageItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    alignSelf: "center",
                    alignItems: "center",
                  }}
                  columnWrapperStyle={{ flexWrap: "wrap" }}
                  numColumns={packageItem.length}
                  key={packageItem.length}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={styles.containers}>
                        <TouchableOpacity
                          style={getTextStyle(item)}
                          // style={styles.container2}
                          activeOpacity={0.8}
                          onPress={() => {
                            onPlayerClick(item.id);
                          }}
                        >
                          <ImageComponent
                            source={{ uri: item.role_image }}
                            style={[styles.icon1]}
                          />
                          <Text style={styles.label1}>{item.title}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                ></FlatList>
              ) : (
                <View></View>
              )}
            </View>
          </>
        ) : (
          <></>
        )}

        <Text style={styles.membership}>{strings.aboutMe}</Text>
        <Input
          inputStyle={styles.input}
          value={updatedAbout}
          placeholder="tell us about yourself!"
          placeholderTextColor="#818181"
          onChangeText={setAbout}
          multiline
        />

        <Text style={styles.membership}>{strings.skills}</Text>
        {skillValue !== "" ? (
          <TouchableOpacity
            style={{ zIndex: 1111111 }}
            onPress={() => {
              onAddSkill(skillValue);
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

        <View style={styles.skillCont}>
          <Input
            inputStyle={styles.input}
            // onSubmitEditing={onAddSkill}
            placeholder={strings.addSkill}
            value={skillValue}
            onChangeText={setSkillValue}
            placeholderTextColor="#818181"
            children
          />
        </View>

        <View style={styles.row}>
          <FlatListComponent
            data={allSkills}
            keyExtractor={(item) => item.toString()}
            renderItem={renderItem}
            numColumns={100}
            showsHorizontalScrollIndicator={false}
            columnWrapperStyle={styles.flexWrap}
          />
        </View>

        {/* ==========================Question Answer========================  */}

        <View>
          <Modal transparent={false} animationType="slide" visible={openQues}>
            <View style={{ height: "auto" }}>
              <View style={styles.HeaderContainer}>
                <TouchableOpacity
                  onPress={() => {
                    updateAnsBack();
                  }}
                >
                  <View style={styles.dropDownView}>
                    <ImageComponent
                      source={downImg}
                      style={styles.downIcon}
                    ></ImageComponent>
                  </View>
                </TouchableOpacity>
                <Text style={styles.MainContainer}>
                  {strings.updateQuestion}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    quesAnsModalHide();
                  }}
                >
                  <Text style={styles.saveContainer}>{strings.save}</Text>
                </TouchableOpacity>
              </View>
              <ScrollView automaticallyAdjustKeyboardInsets={true}>
                <View style={styles.listContainer}>
                  {ansQueDataTwo ? (
                    <FlatList
                      data={ansQueDataTwo}
                      renderItem={({ item, index }) => (
                        <View
                          style={{
                            borderBottomWidth: 1,
                            marginBottom: 12,
                            borderBottomColor: "gray",
                          }}
                        >
                          <Text style={styles.questionsLbl}>
                            {item.question}
                          </Text>
                          {/* {item.answer ?

                          <Text style={styles.answerLbl}>{item.answer}</Text>
                          : */}
                          <View style={{ height: 110 }}>
                            <TextInput
                              editable={true}
                              value={item.answer}
                              placeholder="Add your answer here..."
                              placeholderTextColor="#8B8888"
                              multiline={true}
                              style={styles.inputCont}
                              // onChangeText={value => { myFunction() }}
                              onChangeText={(text) =>
                                handleToggleYourList(text, index)
                              }
                            ></TextInput>
                          </View>

                          {/* } */}
                        </View>
                      )}
                    ></FlatList>
                  ) : (
                    <View></View>
                  )}
                  <View style={{ height: 50 }}></View>
                </View>
              </ScrollView>
            </View>
          </Modal>

          <View>
            <TouchableOpacity
              onPress={() => {
                quesAnsModalOpen();
              }}
            >
              <Text style={styles.ProfileUpdateCont}>
                {strings.queAnsTitle}
              </Text>
            </TouchableOpacity>
            <View style={{ marginBottom: 30 }}>
              <FlatList
                data={ansQueData}
                renderItem={({ item }) => (
                  <View>
                    {item.answer != "" ? (
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

        <TouchableOpacity onPress={deleteAccount}>
          <Text style={styles.deleteAccount}>{strings.deleteAccount}</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }}></View>
      </View>
    </>
  );
};
