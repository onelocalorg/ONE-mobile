import { useFocusEffect } from "@react-navigation/native";
import Big from "big.js";
import _ from "lodash/fp";
import React, { useCallback, useRef, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ButtonComponent } from "~/components/button-component";
import { EventList } from "~/components/events/EventList";
import { ModalRefProps } from "~/components/modal-component";
import { OneModal } from "~/components/modal-component/OneModal";
import { PurchaseProps } from "~/network/api/services/event-service";
import { usePurchaseTicket } from "~/network/hooks/home-service-hooks/use-purchase-ticket";
import { LocalEvent } from "~/types/local-event";
import { SubtotalView } from "./SubtotalView";
import { TicketSelector } from "./TicketSelector";
import { createStyleSheet as createBaseStyleSheet } from "./style";

interface TicketsProps {
  event: LocalEvent;
  onLoading?: (isLoading: boolean) => void;
}

export const Tickets = ({ event, onLoading }: TicketsProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createBaseStyleSheet(theme);
  const { mutateAsync: purchaseTicket, isLoading: purchaseTicketLoading } =
    usePurchaseTicket();
  const [isTicketAvailable, setIsTicketAvailable] = useState(false);
  const modalRef: React.Ref<ModalRefProps> = useRef(null);
  const [isBuyTicketVisible, setBuyTicketVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState<Map<string, number>>(
    new Map()
  );

  useFocusEffect(
    useCallback(() => {
      setIsTicketAvailable(
        !_.isEmpty(event?.ticketTypes.filter((t) => t.isAvailable))
      );
    }, [event])
  );

  const onBuyTicket = () => {
    if (isTicketAvailable) {
      modalRef.current?.onOpenModal();
    } else {
      Alert.alert("", strings.noTicketsAvailable);
    }
  };

  const onPaymentSuccess = async (
    paymentData: PurchaseProps,
    ticketId: string,
    ticketName: string,
    ticketPrice: string,
    quantityticket: number
  ) => {
    const request = {
      bodyParams: {
        stripeResponse: paymentData,
        eventId: event.id,
        ticketId: ticketId,
        ticketName: ticketName,
        ticketPrice: ticketPrice,
        ticket_quantity: quantityticket,
      },
    };
    const res = await purchaseTicket(request);
    if (res?.success === true) {
      Toast.show(res.message, Toast.LONG, {
        backgroundColor: "black",
      });

      //   LoadingData(false);
      //   navigation?.goBack();
    } else {
      //   LoadingData(false);
    }
  };

  // const onPurchaseTicket = async (
  //   price: any,
  //   ticketId: string,
  //   ticketName: string,
  //   quantityticket: number
  // ) => {
  //   const unique_Id = await AsyncStorage.getItem("uniqueId");
  //   var Payment: any = {
  //     ticketId: ticketId,
  //     purchase_user_unique_id: unique_Id,
  //     purchased_ticket_qunatity: quantityticket,
  //   };
  //   const request = {
  //     amount: price * 100,
  //     currency: "usd",
  //     "automatic_payment_methods[enabled]": true,
  //     customer: user?.stripeCustomerId,
  //     description: "Payment-Mobile",
  //     metadata: Payment,
  //   };
  //   console.log("------------onPurchaseTicket-----------------");
  //   let clientSecret = "";
  //   const res = await createPayoutIntent({ bodyParams: request });
  //   if (res?.statusCode === 200) {
  //     clientSecret = res?.data?.client_secret;
  //   }
  //   console.log("-------------------clientSecret---------------", res);
  //   modalRef.current?.onCloseModal();
  //   navigation?.navigate(navigations.PAYMENT, {
  //     clientSecret,
  //     paymentData: res?.data,
  //     onSuccess: () =>
  //       onPaymentSuccess(
  //         res?.data,
  //         ticketId,
  //         ticketName,
  //         `${parseFloat(price?.replace("USD", ""))}`,
  //         quantityticket
  //       ),
  //   });
  // };

  const selectedTicketPrice = () =>
    event.ticketTypes.reduce(
      (total, ticketType) =>
        (total = total.plus(
          ticketType.price.times(selectedTickets.get(ticketType.id) ?? 0)
        )),
      Big(0)
    );

  return (
    <View style={styles.container}>
      {event.ticketTypes?.length ? (
        <Text style={styles.event}>{strings.tickets}</Text>
      ) : (
        <></>
      )}
      <View>
        {event.ticketTypes?.map((ele) => (
          <View key={ele?.price.toString()} style={styles.rowOnly}>
            <Text style={styles.ticket}>{`$${ele?.price} - ${ele?.name}`}</Text>
          </View>
        ))}
      </View>

      {!event.is_event_owner && event.ticketTypes?.length ? (
        <ButtonComponent
          disabled={event.isCanceled}
          title={strings.chooseTickets}
          onPress={() => setBuyTicketVisible(true)}
        />
      ) : null}
      <OneModal title={strings.ticketCheckout} isVisible={isBuyTicketVisible}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <EventList data={event} />
            <Text style={styles.amount}>
              ${selectedTicketPrice().toFixed(0)}
            </Text>
            <TicketSelector
              ticketTypes={event.ticketTypes}
              onSelectedChanged={setSelectedTickets}
            />
            <View style={styles.lineSpace} />

            <SubtotalView
              eventId={event.id}
              ticketTypes={event.ticketTypes}
              tickets={selectedTickets}
            />
            <ButtonComponent
              // disabled={buttonDisable}
              // onPress={onSubmit}
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
            {/* <OneModal isVisible={false}>
              <>
                <CardList />
                <View>
                  <TouchableOpacity
                    //   onPress={() => OnCardValidation()}
                    activeOpacity={0.8}
                    style={styles.addCardContainer}
                  >
                    <View />
                    <Text style={styles.titleTwo}>
                      {strings.pay} ${totalPrice}
                    </Text>
                    <ImageComponent
                      source={buttonArrowBlue}
                      style={styles.buttonArrow}
                    />
                  </TouchableOpacity>
                </View>
              </>
            </OneModal> */}
          </ScrollView>
        </View>
      </OneModal>
    </View>
  );
};
