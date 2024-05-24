import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { activeRadio, addGreen, inactiveRadio } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { createStyleSheet } from "./style";

interface CardListProps {}

export const CardList = (
  {}: CardListProps,
  ref: React.Ref<unknown> | undefined
) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
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

  var [buttonDisable, buttonDisableCheck] = useState(false);

  const onSelectCard = (index: any, item: any) => {
    setSelectedCardRadioIndex(index);
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

  return (
    <>
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
                    <TouchableOpacity onPress={() => onSelectCard(index, item)}>
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
                            <Text style={styles.cardNum}>{item?.brand}</Text>
                            <Text style={styles.cardNum}>{item?.last4}</Text>
                          </View>
                        </View>
                        <View style={styles.cardList}>
                          <Text style={styles.CardexpDate}>{strings.exp}</Text>
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
        </View>
      </View>
    </>
  );
};
