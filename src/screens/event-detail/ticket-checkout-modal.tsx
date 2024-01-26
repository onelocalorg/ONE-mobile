import {useAppTheme} from '@app-hooks/use-app-theme';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import React, {forwardRef, useEffect, useState} from 'react';
import {createStyleSheet} from './style';
import {ModalComponent} from '@components/modal-component';
import {Text, TouchableOpacity, View} from 'react-native';
import {EventList} from '@components/event-list';
import {ImageComponent} from '@components/image-component';
import {ButtonComponent} from '@components/button-component';
import {
  activeRadio,
  addCard,
  addGreen,
  inactiveRadio,
  minus,
  plus,
} from '@assets/images';
import {Result} from '@network/hooks/home-service-hooks/use-event-lists';
import {formatPrice} from '@utils/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SizedBox} from '@components/sized-box';
import {Loader} from '@components/loader';

interface TicketCheckoutModalCompProps {
  onPurchase: (
    price: string,
    ticketId: string,
    ticketName: string,
    quantityticket: string,
  ) => void;
  eventData: Result;
}

const TicketCheckoutModalComp = (
  props: TicketCheckoutModalCompProps,
  ref: React.Ref<unknown> | undefined,
) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {strings} = useStringsAndLabels();
  const {onPurchase, eventData} = props || {};
  const [selectedRadioIndex, setSelectedRadioIndex] = useState(0);
  var [quantityticket, totalTicketQuantity]: any = useState(1);
  var [totalPrice, totalPriceCalc]: any = useState();
  var [ticketId, PurchaseTicketId]: any = useState();
  var [setLoader, isLoading] = useState(false);
  var [buttonDisable, buttonDisableCheck] = useState(Boolean);
  console.log(
    eventData,
    '----------------ticket check out--------------------',
  );
  useEffect(() => {
    const index = eventData?.tickets.findIndex(ele => !ele.is_ticket_purchased);
    setSelectedRadioIndex(index);
    if (eventData?.tickets.length !== 0) {
      if (eventData?.tickets[0].available_quantity === 0) {
        buttonDisableCheck(true);
      }
      if (eventData?.tickets[0].available_quantity !== 0) {
        buttonDisableCheck(false);
      }
      console.log(eventData?.tickets[0].available_quantity, '--==-0-=');
      totalPriceCalculation(eventData?.tickets?.[0]?.id, 1);
      PurchaseTicketId(eventData?.tickets?.[0]?.id);
    }
  }, [eventData]);

  async function totalPriceCalculation(ticketId: any, quantityticket: any) {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    console.log(
      'https://app.onelocal.one/api/v1/tickets/' +
        ticketId +
        '/' +
        quantityticket,
    );
    console.log(eventData?.id);
    try {
      console.log(
        'https://app.onelocal.one/api/v1/tickets/' +
          ticketId +
          '/' +
          quantityticket,
      );
      const response = await fetch(
        'https://app.onelocal.one/api/v1/tickets/' +
          ticketId +
          '/' +
          quantityticket,
        {
          method: 'get',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        },
      );
      const dataItem = await response.json();
      console.log(
        '===========totalPriceCalculation data Response==============',
      );
      isLoading(false);
      console.log(dataItem);
      totalPriceCalc(dataItem?.data?.total);
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
    console.log(item);
    console.log(ticketId);
    console.log(item?.available_quantity, 'item?.available_quantity');
    if (item?.available_quantity === 0) {
      buttonDisableCheck(true);
    } else {
      buttonDisableCheck(false);
    }
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

  return (
    <ModalComponent ref={ref} title={strings.ticketCheckout}>
      <Loader showOverlay visible={setLoader}></Loader>
      <View style={styles.modalContainer}>
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
              style={[styles.row, styles.marginTop]}>
              <ImageComponent
                source={
                  index === selectedRadioIndex ? activeRadio : inactiveRadio
                }
                style={styles.radio}
              />
              <Text style={styles.text}>{`${ele?.name} - ${ele?.price}`}</Text>
              {ele?.available_quantity !== 0 ? (
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => OnMinusClick(index, ele)}>
                    <ImageComponent
                      style={styles.quantityIcon}
                      source={minus}></ImageComponent>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>
                    {index === selectedRadioIndex ? quantityticket : 1}
                  </Text>
                  <TouchableOpacity onPress={() => OnPlusClick(index, ele)}>
                    <ImageComponent
                      style={styles.quantityIcon}
                      source={plus}></ImageComponent>
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
          <View style={styles.priceTaxcontainer}>
            <Text style={styles.priceTitle}>{strings.pricetax}</Text>
            <Text style={styles.totalPrice}>
              {strings.totalAmount}
              <Text style={{fontWeight: '600'}}>${totalPrice}</Text>
            </Text>
          </View>
        ) : (
          <Text style={styles.soldOutClass}>Ticket Sold out</Text>
        )}
        <View></View>

        <View style={styles.lineTwo} />
        <ButtonComponent
          disabled={buttonDisable}
          onPress={() =>
            onPurchase(
              totalPrice,
              eventData?.tickets?.[selectedRadioIndex]?.id ?? '',
              eventData?.tickets?.[selectedRadioIndex]?.name,
              quantityticket,
            )
          }
          title={strings.purchase}
        />
      </View>
    </ModalComponent>
  );
};

export const TicketCheckoutModal = forwardRef(TicketCheckoutModalComp);
