import { useAppTheme } from "@app-hooks/use-app-theme";
import { useStringsAndLabels } from "@app-hooks/use-strings-and-labels";
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
import GestureRecognizer from "react-native-swipe-gestures";
import { createStyleSheet } from "./style";
import { Loader } from "@components/loader";
import { ImageComponent } from "@components/image-component";
import { persistKeys } from "@network/constant";
import { useToken } from "@app-hooks/use-token";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import {
  addCard,
  buttonArrow,
  buttonArrowBlue,
  closeCard,
} from "@assets/images";
import { ButtonComponent } from "@components/button-component";
import { useFocusEffect } from "@react-navigation/native";

interface membershipModalProps {
  memberModal: boolean;
  onCancel?: () => void;
  dataId: number | string;
  successData?: () => void;
}

export const MembershipCheckoutModal = (props: membershipModalProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const { memberModal, onCancel, dataId, successData } = props || {};
  const [modalVisible, setModalVisible] = useState(false);
  // const [memberModal, setMemberModal] = useState(false);
  // const [postData, setDataEntries]: any = useState({});
  const [monthlyPlan, monthlyPlanData]: any = useState<any[]>([]);
  const [isLoading, LodingData] = useState(false);
  const [isBilledMonthly, setIsBilledMonthly] = useState(true);
  const handleBillingSubscription = (value: boolean) => {
    setIsBilledMonthly(value);
  };
  const [idPackage, packageIdData] = useState();
  const [monthPrice, monthlyPrice] = useState();
  const [YerlyPrice, yearlyPrices] = useState();
  const [yearlyPlan, yearlyPlanData]: any = useState<any[]>([]);
  const { token } = useToken();
  const [packageItem, PackageListData]: any = useState();
  const [cardData, addCardList]: any = useState<any[]>([]);
  const [description, descriptionData] = useState();
  const [addcard, addCardModal] = useState(false);
  const [membershipId, MembershipCheckOutID] = useState();
  const [dataItem, memberShipData] = useState();
  const [cardnumber, cardNumberData] = useState("");
  const [cardCvv, cardCVVData] = useState("");
  const [date, setDate] = useState("");
  // const [tokens, setToken] = useState("");
  const [cardExpmonth, cardExpMonth] = useState("");
  const [cardExpyear, cardExpYears] = useState("");
  const [MemberShipTitle, setMemberShipTitle]: any = useState();

  useEffect(() => {
    console.log(memberModal, "--------------memberModal12345---------------");
    LogBox.ignoreAllLogs();
    memberShipCheckoutAPI();
  }, []);

  // =================MemberShip Checkout API====================

  async function memberShipCheckoutAPI() {
    const token = await AsyncStorage.getItem("token");
    console.log(token, "--------------------------");
    try {
      console.log(
        dataId,
        "---------------dataId dataId------------------------------------"
      );
      const response = await fetch(
        process.env.API_URL +
          "/v1/subscriptions/packages/" +
          dataId +
          "/checkout",
        // process.env.API_URL + "/v1/subscriptions/packages/" + '655f484562030949923d50c3' + "/checkout",

        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        }
      );
      const dataItems = await response.json();
      memberShipData(dataItems);
      LodingData(false);
      console.log("===========MemberShip checkout==============");
      console.log(dataItems);
      // setDatacheckout(dataItem);
      setMemberShipTitle(dataItems?.data);
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
      console.log(monthlyPlan, "-------------monthlyPlan-----------------");
      console.log(yearlyPlan, "-------------yearlyPlan-------------");
      console.log(description);
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
        process.env.API_URL + "/v1/subscriptions/" + dataId + "/purchase",
        // process.env.API_URL + "/v1/subscriptions/" + idPackage + "/purchase",
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
        // packageListAPI();
        // userProfileUpdate();

        successData?.();
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

  // ======================Config API=========================
  const ConfigListAPI = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(process.env.API_URL + "/v1/config/list", {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + token,
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
    const token = await AsyncStorage.getItem("token");
    var cardtokenData: any = {
      token: cardId,
    };
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/subscriptions/cards/create",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          body: Object.keys(cardtokenData)
            .map((key) => key + "=" + cardtokenData[key])
            .join("&"),
        }
      );
      console.log(cardId);
      const dataItem = await response.json();
      console.log("-----------------create card------------");
      console.log(dataItem);
      cardNumberData("");
      cardExpMonth("");
      cardExpYears("");
      cardCVVData("");
      setDate("");
      memberShipCheckoutAPI();
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

  const addCardModalHide = () => {
    addCardModal(false);
    cardNumberData("");
    cardExpMonth("");
    cardExpYears("");
    cardCVVData("");
    setDate("");
  };

  const onOpenModal = () => {
    // addcardRef.current?.onOpenModal();
    addCardModal(true);
  };

  const memberShipHide = () => {
    onCancel?.();
    // setMemberModal(false);
  };

  return (
    <Modal transparent onDismiss={memberShipHide} visible={memberModal}>
      <GestureRecognizer onSwipeDown={memberShipHide} style={styles.gesture}>
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
                      { backgroundColor: MemberShipTitle?.color },
                    ]}
                    activeOpacity={0.8}
                  >
                    <ImageComponent
                      source={{ uri: MemberShipTitle?.role_image }}
                      style={[styles.icon1]}
                    />
                    <Text style={styles.label1}>{MemberShipTitle?.title}</Text>
                  </TouchableOpacity>
                  <View style={styles.selectContainer}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.selectView,
                        isBilledMonthly && styles.selectedSelectView,
                      ]}
                      onPress={() => handleBillingSubscription(true)}
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

                      <Text style={styles.bill}>{monthlyPlan?.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.selectView,
                        !isBilledMonthly && styles.selectedSelectView,
                      ]}
                      onPress={() => handleBillingSubscription(false)}
                    >
                      {yearlyPlan?.price?.$numberDecimal ? (
                        <Text style={styles.amount}>{`$${parseInt(
                          yearlyPlan?.price?.$numberDecimal,
                          10
                        )}`}</Text>
                      ) : (
                        <Text style={styles.amount}>$00</Text>
                      )}
                      <Text style={styles.bill}>{yearlyPlan?.name}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.playerDescription}>{description}</Text>

                  <View>
                    <Text style={styles.paymentInfo}>
                      {strings.paymentinfo}
                    </Text>
                  </View>
                  {cardData?.brand ? (
                    <View>
                      <View style={styles.cardList}>
                        <Text style={styles.cardNum}>{cardData?.brand}</Text>
                        <Text style={styles.dotclass}>{strings.dot}</Text>
                        <Text style={styles.cardNum}>{cardData?.last4}</Text>
                      </View>
                      <View style={styles.cardList}>
                        <Text style={styles.CardexpDate}>{strings.exp}</Text>
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
                    <Text style={styles.addCard}>{strings.addCard}</Text>
                  </TouchableOpacity>
                  <View style={styles.purchesButton}>
                    <TouchableOpacity
                      onPress={onPurchaseAPI}
                      activeOpacity={0.8}
                      style={styles.purchaseContainer}
                    >
                      <View />
                      <Text style={styles.title}>{strings.purchase}</Text>
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

          <Modal transparent onDismiss={addCardModalHide} visible={addcard}>
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

                  <Text style={styles.addCardTitle}>{strings.addCardOne}</Text>
                  <Text style={styles.addCardInfo}>{strings.cardinfo}</Text>
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
                            text.length === 3 && !text.includes("/")
                              ? `${text.substring(0, 2)}/${text.substring(2)}`
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
                        { backgroundColor: MemberShipTitle?.color },
                      ]}
                      activeOpacity={0.8}
                    >
                      <ImageComponent
                        source={{ uri: MemberShipTitle?.role_image }}
                        style={[styles.icon1]}
                      />
                      <Text style={styles.label1}>
                        {MemberShipTitle?.title}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.selectContainer}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                          styles.selectView,
                          isBilledMonthly && styles.selectedSelectView,
                        ]}
                        onPress={() => handleBillingSubscription(true)}
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

                        <Text style={styles.bill}>{monthlyPlan?.name}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                          styles.selectView,
                          !isBilledMonthly && styles.selectedSelectView,
                        ]}
                        onPress={() => handleBillingSubscription(false)}
                      >
                        {yearlyPlan?.price?.$numberDecimal ? (
                          <Text style={styles.amount}>{`$${parseInt(
                            yearlyPlan?.price?.$numberDecimal,
                            10
                          )}`}</Text>
                        ) : (
                          <Text style={styles.amount}>$00</Text>
                        )}
                        <Text style={styles.bill}>{yearlyPlan?.name}</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.playerDescription}>{description}</Text>

                    <View>
                      <Text style={styles.paymentInfo}>
                        {strings.paymentinfo}
                      </Text>
                    </View>
                    {cardData?.brand ? (
                      <View>
                        <View style={styles.cardList}>
                          <Text style={styles.cardNum}>{cardData?.brand}</Text>
                          <Text style={styles.dotclass}>{strings.dot}</Text>
                          <Text style={styles.cardNum}>{cardData?.last4}</Text>
                        </View>
                        <View style={styles.cardList}>
                          <Text style={styles.CardexpDate}>{strings.exp}</Text>
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
                      <Text style={styles.addCard}>{strings.addCard}</Text>
                    </TouchableOpacity>
                    <View style={styles.purchesButton}>
                      <TouchableOpacity
                        onPress={onPurchaseAPI}
                        activeOpacity={0.8}
                        style={styles.purchaseContainer}
                      >
                        <View />
                        <Text style={styles.title}>{strings.purchase}</Text>
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

            <Modal transparent onDismiss={addCardModalHide} visible={addcard}>
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
                behavior={Platform.OS === "ios" ? "position" : "height"}
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
                    <Text style={styles.addCardInfo}>{strings.cardinfo}</Text>
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
                              text.length === 3 && !text.includes("/")
                                ? `${text.substring(0, 2)}/${text.substring(2)}`
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
  );
};
