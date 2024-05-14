import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { forwardRef, useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-simple-toast";
import GestureRecognizer from "react-native-swipe-gestures";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import {
  activeRadio,
  addCard,
  addGreen,
  buttonArrowBlue,
  inactiveRadio,
  minus,
  plus,
} from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { EventList } from "~/components/events/EventList";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { ModalComponent } from "~/components/modal-component";
import { LocalEventData } from "~/types/local-event-data";
import { createStyleSheet } from "./style";

interface TicketCheckoutModalCompProps {
  onPurchase: (
    price: string,
    ticketId: string,
    ticketName: string,
    cardData: string,
    quantityticket: number
  ) => void;
  eventData: LocalEventData;
  loader: boolean;
}

const TicketCheckoutModalComp = (
  props: TicketCheckoutModalCompProps,
  ref: React.Ref<unknown> | undefined
) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const { onPurchase, eventData, loader } = props || {};
  const [selectedRadioIndex, setSelectedRadioIndex] = useState(0);
  const [SelectCardIndex, setSelectedCardRadioIndex] = useState(0);
  var [quantityticket, totalTicketQuantity]: any = useState(1);
  var [setValue, totalPriceCalc]: any = useState();
  var [setPrice, totalPriceValue]: any = useState();
  var [ticketId, PurchaseTicketId]: any = useState();
  var [setLoader, isLoading] = useState(false);

  const [cardnumber, cardNumberData] = useState("");
  const [cardExpmonth, cardExpMonth] = useState("");
  const [cardExpyear, cardExpYears] = useState("");
  const [cardCvv, cardCVVData] = useState("");
  const [date, setDate] = useState("");
  const [addcard, addCardModal] = useState(false);
  const [addNewcard, addNewCardModal] = useState(false);
  const [setCard, setCardData]: any = useState([]);

  const [newCardName, addNewCardName] = useState("");
  const [newCardNumber, addNewCardNumber] = useState("");
  const [newCardMonth, addNewCardMonth] = useState("");
  const [newCardYear, addNewCardYear] = useState("");
  const [newCardCvv, addNewCardCvv] = useState("");
  const [newCardCountry, addNewCardCountry] = useState("");
  const [newCardAddress, addNewCardAddress] = useState("");
  const [newCardAddressTwo, addNewCardAddressTwo] = useState("");
  const [newCardCity, addNewCardCity] = useState("");
  const [newCardState, addNewCardSate] = useState("");
  const [newCardZip, addNewCardZip] = useState("");

  var [buttonDisable, buttonDisableCheck] = useState(Boolean);

  useEffect(() => {
    getCardDetailAPI();
    const index = eventData?.ticket.findIndex(
      (ele) => !ele.is_ticket_purchased
    );
    setSelectedRadioIndex(index);
    if (eventData?.tickets.length !== 0) {
      if (eventData?.tickets[0].available_quantity === 0) {
        buttonDisableCheck(true);
      }
      if (eventData?.tickets[0].available_quantity !== 0) {
        buttonDisableCheck(false);
      }
      totalPriceCalculation(eventData?.tickets?.[0]?.id, 1);
      PurchaseTicketId(eventData?.tickets?.[0]?.id);
    }
  }, [eventData]);

  async function totalPriceCalculation(ticketId: any, quantityticket: any) {
    const token = await AsyncStorage.getItem("token");
    console.log(
      process.env.API_URL + "/v1/tickets/" + ticketId + "/" + quantityticket
    );
    try {
      console.log(
        process.env.API_URL + "/v1/tickets/" + ticketId + "/" + quantityticket
      );
      const response = await fetch(
        process.env.API_URL + "/v1/tickets/" + ticketId + "/" + quantityticket,
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
        }
      );
      const dataItem = await response.json();
      isLoading(false);
      console.log(dataItem);
      totalPriceCalc(dataItem?.data);
      totalPriceValue(dataItem?.data?.total);
    } catch (error) {
      isLoading(false);
      console.error(error);
    }
  }

  const onSelectTicket = (index: number, item: any) => {
    PurchaseTicketId(item?.id);
    setSelectedRadioIndex(index);
    if (index !== selectedRadioIndex) {
      totalTicketQuantity(1);
      totalPriceCalculation(item?.id, 1);
    }
    if (item?.available_quantity === 0) {
      buttonDisableCheck(true);
    } else {
      buttonDisableCheck(false);
    }
  };

  const onSelectCard = (index: any, item: any) => {
    setSelectedCardRadioIndex(index);
  };

  const OnMinusClick = (index: any, maxQuantity: any) => {
    if (index === selectedRadioIndex) {
      if (quantityticket > 1) {
        isLoading(true);
        PurchaseTicketId(maxQuantity?.id);
        quantityticket = quantityticket - 1;
        totalTicketQuantity(quantityticket);
        totalPriceCalculation(maxQuantity?.id, quantityticket);
      }
    }
  };

  const onOpenModal = () => {
    isLoading(true);
    if (setPrice === 0) {
      onPurchase(
        setCard[SelectCardIndex],
        eventData?.tickets?.[selectedRadioIndex]?.id ?? "",
        eventData?.tickets?.[selectedRadioIndex]?.name,
        setPrice,
        quantityticket
      );
    } else {
      addCardModal(true);
      getCardDetailAPI();
    }
  };

  const addCardModalHide = () => {
    addCardModal(false);
    cardNumberData("");
    cardExpMonth("");
    cardExpYears("");
    cardCVVData("");
  };

  const addNewCardDetial = () => {
    addNewCardModal(false);
    cardNumberData("");
    // cardExpMonth('');
    // cardExpYears('');
    // cardCVVData('');
  };

  const getCardDetailAPI = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/subscriptions/cards",
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        }
      );
      const dataItem = await response.json();
      isLoading(false);

      setCardData(dataItem?.data?.cards);
    } catch (error) {
      isLoading(false);
      console.error(error);
    }
  };

  // ======================Config API=========================
  const ConfigListAPI = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(process.env.API_URL + "/v1/config/list", {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
      });
      const dataItem = await response.json();
      const keyId = dataItem?.data?.stripe?.stripePublicKey;
      setTimeout(() => {
        cardStripeAPI(keyId);
      }, 2000);
      setTimeout(() => {
        isLoading(false);
      }, 7000);
    } catch (error) {
      console.error(error);
    }
  };

  // ======================Stripe API=========================

  async function cardStripeAPI(stripeId: any) {
    const genCard: any = {
      "card[number]": newCardNumber,
      "card[exp_month]": newCardMonth,
      "card[exp_year]": newCardYear,
      "card[cvc]": newCardCvv,
    };

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
        createNewCardAPI(card_tok);
      }
    }, 3000);
    if (results.error) {
      Toast.show(results.error.message, Toast.LONG, {
        backgroundColor: "black",
      });
    }

    return;
  }

  const createNewCardAPI = async (cardId: any) => {
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
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(cardtokenData),
        }
      );
      const dataItem = await response.json();
      isLoading(false);
      if (dataItem?.success === true) {
        addNewCardModal(false);
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
        getCardDetailAPI();
      } else {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }
    } catch (error) {
      isLoading(false);
      console.error(error);
    }
  };

  const OnPlusClick = (index: any, maxQuantity: any) => {
    if (index === selectedRadioIndex) {
      if (quantityticket < maxQuantity?.max_quantity_to_show) {
        isLoading(true);
        PurchaseTicketId(maxQuantity?.id);
        quantityticket = quantityticket + 1;
        totalTicketQuantity(quantityticket);
        totalPriceCalculation(maxQuantity?.id, quantityticket);
      }
    }
  };

  const addNewCardDetailModal = () => {
    addNewCardModal(true);
    addNewCardName("");
    addNewCardNumber("");
    addNewCardMonth("");
    addNewCardCountry("");
    addNewCardYear("");
    addNewCardCvv("");
    addNewCardAddress("");
    addNewCardAddressTwo("");
    addNewCardCity("");
    addNewCardSate("");
    addNewCardZip("");
    setDate("");
  };

  async function onCheckValidation() {
    // addNewCardModal(true)
    isLoading(true);
    if (newCardName.length === 0) {
      isLoading(false);
      Toast.show("Enter Card Holder Name", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (newCardNumber.length != 16) {
      isLoading(false);
      Toast.show("Enter Your Valid Card Number", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (date.length < 3) {
      isLoading(false);
      Toast.show("Enter Valide Date", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (newCardCvv.length != 3) {
      isLoading(false);
      Toast.show("Invalide CVV Number", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (newCardCountry.length === 0) {
      isLoading(false);
      Toast.show("Enter Country Name", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (newCardAddress.length === 0) {
      isLoading(false);
      Toast.show("Enter your Address", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (newCardCity.length === 0) {
      isLoading(false);
      Toast.show("Enter City Name", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (newCardState.length === 0) {
      isLoading(false);
      Toast.show("Enter State Name", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (newCardZip.length === 0) {
      isLoading(false);
      Toast.show("Enter Zip Code", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      ConfigListAPI();
    }
  }

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const OnCardValidation = () => {
    if (setCard.length !== 0) {
      onPurchase(
        setCard[SelectCardIndex],
        eventData?.tickets?.[selectedRadioIndex]?.id ?? "",
        eventData?.tickets?.[selectedRadioIndex]?.name,
        setPrice,
        quantityticket
      );
    } else {
      Toast.show("First Add Card", Toast.LONG, {
        backgroundColor: "black",
      });
    }
  };

  return (
    <>
      <ModalComponent ref={ref} title={strings.ticketCheckout}>
        <Loader showOverlay visible={setLoader || loader}></Loader>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <EventList data={eventData} />
            <Text style={styles.amount}>
              {eventData?.tickets?.[selectedRadioIndex]?.price}
            </Text>
            {eventData?.tickets.map((ele, index) => {
              if (ele?.is_ticket_purchased) {
                return <></>;
              }
              return (
                <TouchableOpacity
                  key={ele?.name.toString()}
                  activeOpacity={0.8}
                  onPress={() => onSelectTicket(index, ele)}
                  style={[styles.row, styles.marginTop]}
                >
                  <ImageComponent
                    source={
                      index === selectedRadioIndex ? activeRadio : inactiveRadio
                    }
                    style={styles.radio}
                  />
                  <Text
                    style={styles.text}
                  >{`$${ele?.price} - ${ele?.name}`}</Text>
                  {ele?.available_quantity !== 0 ? (
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() => OnMinusClick(index, ele)}
                      >
                        <ImageComponent
                          style={styles.quantityIcon}
                          source={minus}
                        ></ImageComponent>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>
                        {index === selectedRadioIndex ? quantityticket : 1}
                      </Text>
                      <TouchableOpacity onPress={() => OnPlusClick(index, ele)}>
                        <ImageComponent
                          style={styles.quantityIcon}
                          source={plus}
                        ></ImageComponent>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View></View>
                  )}
                </TouchableOpacity>
              );
            })}

            <View style={styles.line} />
            {!buttonDisable ? (
              <View style={{ marginVertical: 4 }}>
                <View style={styles.subTotalContainer}>
                  <Text style={styles.subTotalLbl}>{strings.subTotal}</Text>
                  <Text style={styles.subTotalLbl}>${setValue?.sub_total}</Text>
                </View>
                <View style={styles.subTotalContainer}>
                  <Text style={styles.subTotalLbl}>{strings.platformFee}</Text>
                  <Text style={styles.subTotalLbl}>
                    ${setValue?.platformFee}
                  </Text>
                </View>
                <View style={styles.subTotalContainer}>
                  <Text style={styles.subTotalLbl}>{strings.salesTax}</Text>
                  <Text style={styles.subTotalLbl}>{setValue?.salesTax}</Text>
                </View>
                <View style={styles.subTotalContainer}>
                  <Text style={styles.subTotalLbl}>{strings.paymentFee}</Text>
                  <Text style={styles.subTotalLbl}>
                    ${setValue?.paymentFee}
                  </Text>
                </View>
                <View style={styles.subTotalContainer}>
                  <Text style={styles.subTotalLbl}>{strings.total}</Text>
                  <Text style={styles.subTotalLbl}>${setValue?.total}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.soldOutClass}>Ticket Sold out</Text>
            )}
            <View></View>
            <View style={styles.lineSpace} />
            {/* <View style={styles.lineTwo} /> */}
            <ButtonComponent
              disabled={buttonDisable}
              onPress={() => onOpenModal()}
              // onPress={() =>
              //   onPurchase(
              //     setPrice,
              //     eventData?.tickets?.[selectedRadioIndex]?.id ?? '',
              //     eventData?.tickets?.[selectedRadioIndex]?.name,
              //     quantityticket,
              //   )
              // }
              title={strings.purchase}
            />
          </ScrollView>
        </View>
        <Modal transparent onDismiss={addCardModalHide} visible={addcard}>
          <Loader showOverlay visible={loader}></Loader>
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
          <Loader visible={setLoader} showOverlay />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "position" : "height"}
            style={styles.keyboardViewTwo}
          >
            <View style={styles.addCardBorderContainer}>
              <View>
                <Text style={styles.addCardTitle}>{strings.purchase}</Text>
                <View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => addNewCardDetailModal()}
                    style={styles.cardContainer}
                  >
                    <ImageComponent
                      style={styles.greenBtn}
                      source={addGreen}
                    ></ImageComponent>
                  </TouchableOpacity>

                  <ScrollView showsHorizontalScrollIndicator={false}>
                    <View style={{ height: "auto", maxHeight: 150 }}>
                      <FlatList
                        data={setCard}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            onPress={() => onSelectCard(index, item)}
                          >
                            <View style={styles.cardListContainer}>
                              <View style={{ flexDirection: "row" }}>
                                <ImageComponent
                                  source={
                                    index === SelectCardIndex
                                      ? activeRadio
                                      : inactiveRadio
                                  }
                                  style={styles.radio}
                                />

                                <View style={styles.cardList}>
                                  <Text style={styles.cardNum}>
                                    {item?.brand}
                                  </Text>
                                  <Text style={styles.cardNum}>
                                    {item?.last4}
                                  </Text>
                                </View>
                              </View>
                              <View style={styles.cardList}>
                                <Text style={styles.CardexpDate}>
                                  {strings.exp}
                                </Text>
                                <Text style={styles.CardexpDate}>
                                  {item?.exp_month}/{item?.exp_year}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        )}
                      ></FlatList>
                    </View>
                  </ScrollView>
                </View>

                <View>
                  <TouchableOpacity
                    onPress={() => OnCardValidation()}
                    activeOpacity={0.8}
                    style={styles.addCardContainer}
                  >
                    <View />
                    <Text style={styles.titleTwo}>
                      {strings.pay} ${setPrice}
                    </Text>
                    <ImageComponent
                      source={buttonArrowBlue}
                      style={styles.buttonArrow}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>

          {/* Add Card Detail Modal */}

          <Modal transparent onDismiss={addNewCardDetial} visible={addNewcard}>
            <GestureRecognizer
              onSwipeDown={addNewCardDetial}
              style={styles.gesture}
            >
              <TouchableOpacity
                style={styles.containerGallery}
                activeOpacity={1}
                onPress={addNewCardDetial}
              />
            </GestureRecognizer>
            <Loader visible={setLoader} showOverlay />
            <TouchableOpacity activeOpacity={1} onPress={keyboardDismiss}>
              <View style={styles.addCardNewBorderContainer}>
                <KeyboardAwareScrollView
                  showsVerticalScrollIndicator={false}
                  horizontal={false}
                >
                  <View>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      horizontal={false}
                    >
                      <Text style={styles.addCardTitle}>
                        {strings.purchase}
                      </Text>
                      <Text style={styles.addCardInfo}>{strings.cardinfo}</Text>
                      <View>
                        <TextInput
                          placeholderTextColor="darkgray"
                          value={newCardName}
                          maxLength={16}
                          style={styles.addCardNameInput}
                          placeholder="name on card"
                          onChangeText={(value) => {
                            addNewCardName(value);
                          }}
                        />

                        <View>
                          <ImageComponent
                            source={addCard}
                            style={styles.addCardLogo}
                          />

                          <TextInput
                            placeholderTextColor="darkgray"
                            value={newCardNumber}
                            maxLength={16}
                            keyboardType="numeric"
                            style={styles.addCardInput}
                            placeholder="card number"
                            onChangeText={(value) => {
                              addNewCardNumber(value);
                            }}
                          />
                        </View>
                        <View style={styles.cardView}>
                          <TextInput
                            placeholderTextColor="darkgray"
                            onChangeText={(text) => {
                              setDate(
                                text.length === 3 && !text.includes("/")
                                  ? `${text.substring(0, 2)}/${text.substring(
                                      2
                                    )}`
                                  : text
                              );
                              const [month, year] = text.split("/");
                              addNewCardMonth(month);
                              addNewCardYear(year);
                            }}
                            placeholder="mm/yy"
                            keyboardType="number-pad"
                            maxLength={5}
                            style={styles.addCardDateInput}
                            value={date}
                          />

                          <TextInput
                            placeholderTextColor="darkgray"
                            value={newCardCvv}
                            maxLength={3}
                            keyboardType="numeric"
                            style={styles.addCardCVCInput}
                            placeholder="cvc"
                            onChangeText={(value) => {
                              addNewCardCvv(value);
                            }}
                          />
                        </View>
                        <Text style={styles.addCardInfo}>
                          {strings.billingAdd}
                        </Text>
                        <View>
                          <TextInput
                            placeholderTextColor="darkgray"
                            value={newCardCountry}
                            maxLength={16}
                            style={styles.addCardNameInput}
                            placeholder="Country or Region"
                            onChangeText={(value) => {
                              addNewCardCountry(value);
                            }}
                          />
                          <TextInput
                            placeholderTextColor="darkgray"
                            value={newCardAddress}
                            maxLength={16}
                            style={styles.addCardNameInput}
                            placeholder="Address line 1"
                            onChangeText={(value) => {
                              addNewCardAddress(value);
                            }}
                          />
                          <TextInput
                            placeholderTextColor="darkgray"
                            value={newCardAddressTwo}
                            maxLength={16}
                            style={styles.addCardNameInput}
                            placeholder="Address line 2 (optional)"
                            onChangeText={(value) => {
                              addNewCardAddressTwo(value);
                            }}
                          />
                          <TextInput
                            placeholderTextColor="darkgray"
                            value={newCardCity}
                            maxLength={16}
                            style={styles.addCardNameInput}
                            placeholder="City"
                            onChangeText={(value) => {
                              addNewCardCity(value);
                            }}
                          />
                          <TextInput
                            placeholderTextColor="darkgray"
                            value={newCardState}
                            maxLength={16}
                            style={styles.addCardNameInput}
                            placeholder="State"
                            onChangeText={(value) => {
                              addNewCardSate(value);
                            }}
                          />
                          <TextInput
                            placeholderTextColor="darkgray"
                            value={newCardZip}
                            maxLength={16}
                            keyboardType="numeric"
                            style={styles.addCardNameInput}
                            placeholder="ZIP"
                            onChangeText={(value) => {
                              addNewCardZip(value);
                            }}
                          />
                        </View>
                      </View>

                      <View>
                        <ButtonComponent
                          onPress={onCheckValidation}
                          title={strings.addCard}
                          buttonStyle={styles.addCardContainer}
                          icon={buttonArrowBlue}
                        />
                      </View>
                    </ScrollView>
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </TouchableOpacity>
          </Modal>
        </Modal>
      </ModalComponent>
    </>
  );
};

export const TicketCheckoutModal = forwardRef(TicketCheckoutModalComp);
