/* eslint-disable react-hooks/exhaustive-deps */
import {useAppTheme} from '@app-hooks/use-app-theme';
import React, {useCallback, useRef, useState} from 'react';
import {createStyleSheet} from './style';
import {Alert, LogBox, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Header} from '@components/header';
import {ImageComponent} from '@components/image-component';
import {Search, arrowLeft, calendarTime, copy, dummy, onelogo, pinWhite} from '@assets/images';
import {SizedBox} from '@components/sized-box';
import {verticalScale} from '@theme/device/normalize';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {ButtonComponent} from '@components/button-component';
import {ModalRefProps} from '@components/modal-component';
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {TicketCheckoutModal} from './ticket-checkout-modal';
import {navigations} from '@config/app-navigation/constant';
import {Result} from '@network/hooks/home-service-hooks/use-event-lists';
import moment from 'moment';
import {useEventDetails} from '@network/hooks/home-service-hooks/use-event-details';
import {Loader} from '@components/loader';
import {useCreatePayoutIntent} from '@network/hooks/payment-service-hooks/use-create-payout-intent';
import {useSelector} from 'react-redux';
import {StoreType} from '@network/reducers/store';
import {UserProfileState} from '@network/reducers/user-profile-reducer';
import {usePurchaseTicket} from '@network/hooks/home-service-hooks/use-purchase-ticket';
import {PurchaseProps} from '@network/api/services/home-service';
import {formatPrice} from '@utils/common';
import Clipboard from '@react-native-clipboard/clipboard';
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EventDetailScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>; 
  route?: {
    params: {
      id: string;
    };
  };
}

export const EventDetailScreen = (props: EventDetailScreenProps) => {
  const {theme} = useAppTheme();
  const {strings} = useStringsAndLabels();
  const {navigation, route} = props || {};
  const {id} = route?.params ?? {};
  const styles = createStyleSheet(theme);
  const modalRef: React.Ref<ModalRefProps> = useRef(null);
  const [isTicketAvailable, setIsTicketAvailable] = useState(false);
  const {user} = useSelector<StoreType, UserProfileState>(
    state => state.userProfileReducer,
  ) as {user: {stripeCustomerId: string; user_type: string}};
  const {refetch, isLoading, isRefetching, data} = useEventDetails({
    eventId: id ?? '',
  });
  const {
    about,
    address,
    start_date,
    is_event_owner,
    full_address,
    name,
    eventProducer,
    event_image,
    tickets,
  } = data || {};

  const {mutateAsync: createPayoutIntent} = useCreatePayoutIntent();
  const {mutateAsync: purchaseTicket, isLoading: purchaseTicketLoading} =
    usePurchaseTicket();
    const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      const ticketLength = tickets?.filter(
        ele => !ele?.is_ticket_purchased,
      )?.length;
      LogBox.ignoreAllLogs();
      if (ticketLength > 0) {
        setIsTicketAvailable(true);
      } else {
        setIsTicketAvailable(false);
      }
    }, [data]),
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const onBuyTicket = () => {
    if (is_event_owner) {
      navigation?.navigate(navigations.ADMIN_TOOLS, {eventData: data});
    } else if (isTicketAvailable) {
      modalRef.current?.onOpenModal();
    } else {
      Alert.alert('', strings.noTicketsAvailable);
    }
  };

  const onBackPress = () => {
    navigation?.goBack();
  };

  const onPaymentSuccess = async (
    paymentData: PurchaseProps,
    ticketId: string,
    ticketName: string,
    ticketPrice: string,
  ) => {
    const request = {
      bodyParams: {
        stripeResponse: paymentData,
        eventId: id ?? '',
        ticketId,
        ticketName,
        ticketPrice,
      },
    };

    await purchaseTicket(request);
    navigation?.goBack();
  };

  const onPurchaseTicket = async (
    price: any,
    ticketId: string,
    ticketName: string, 
    quantityticket:string
  ) => {
    const unique_Id = await AsyncStorage.getItem('uniqueId');
     var Payment: any = {
      ticketId: ticketId,
      purchase_user_unique_id: unique_Id,
      purchased_ticket_qunatity: quantityticket,
    };
    const request = {
      amount: price * 100,
      currency: 'usd',
      'automatic_payment_methods[enabled]': true,
      customer: user?.stripeCustomerId,
      description: 'Payment-Mobile', 
      metadata:Payment 
    }; 
    console.log('------------onPurchaseTicket-----------------')
    let clientSecret = '';
    const res = await createPayoutIntent({bodyParams: request});
    if (res?.statusCode === 200) {
      clientSecret = res?.data?.client_secret;
    }
    console.log('-------------------clientSecret---------------',res)
    modalRef.current?.onCloseModal();
    navigation?.navigate(navigations.PAYMENT, {
      clientSecret,
      paymentData: res?.data,
      onSuccess: () =>
        onPaymentSuccess(
          res?.data,
          ticketId,
          ticketName,
          `${parseFloat(price?.replace('USD', ''))}`,
        ),
    });
  };

  const getDate = (date = new Date().toString()) => {
    return `${moment(date).format('ddd, MMM DD • hh:mm A')}`;
  };

  const copyPaymentLink = (link: string) => {
    Clipboard.setString(link);
    Alert.alert('Message', strings.linkCopied);
  };

  return (
    <View>
      <Loader
        visible={isLoading || isRefetching || purchaseTicketLoading}
        showOverlay
      />

      <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
        <TouchableOpacity onPress={onBackPress} style={{zIndex:11111222222}}>
          <View style={styles.row2}>
            <ImageComponent source={arrowLeft} style={styles.arrowLeft} />
          </View>
        </TouchableOpacity>
        {/* <View style={styles.searchContainer}>
          <ImageComponent style={styles.searchIcon} source={Search}></ImageComponent>
          <TextInput value={searchQuery} placeholderTextColor="#FFFF" placeholder='Search' style={styles.searchInput} onChangeText={value => {
            console.log(value)
            setSearchQuery(value)
          }}></TextInput>
        </View> */}

        <View style={styles.oneContainer}>
          <ImageComponent style={styles.oneContainerImage} source={onelogo}></ImageComponent>
          <Text style={styles.oneContainerText}>NE</Text>
        </View>
       
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>{name}</Text>
          <View style={styles.row}>
            <View style={styles.circularView}>
              <ImageComponent
                source={calendarTime}
                style={styles.calendarTime}
              />
            </View>
            <View style={styles.margin}>
              <Text style={styles.date}>
                {moment(start_date).format('DD MMM YYYY')}
              </Text>
              <Text style={styles.time}>
                {moment(start_date).format('dddd, hh:mm A')}
              </Text>
            </View>
          </View>
          <View style={[styles.row, styles.marginTop]}>
            <View style={[styles.circularView, styles.yellow]}>
              <ImageComponent source={pinWhite} style={styles.pinWhite} />
            </View>
            <View style={styles.margin}>
              <Text style={styles.date}>{address}</Text>
              <Text style={styles.time}>{full_address}</Text>
            </View>
          </View>
          <View style={[styles.row, styles.marginTop]}>
            <ImageComponent
              resizeMode="cover"
              source={{uri:eventProducer?.pic}}
              style={styles.dummy}
            />
            <View style={styles.margin}>
              <Text
                style={
                  styles.date
                }>{`${eventProducer?.first_name} ${eventProducer?.last_name}`}</Text>
              <Text style={styles.time}>
                {user?.user_type === 'player'
                  ? strings.player
                  : strings.producer}
              </Text>
            </View>
          </View>
        </View>
        <SizedBox height={verticalScale(16)} />
        <ImageComponent
          resizeMode="cover"
          uri={event_image}
          isUrl
          style={styles.eventImage}
        />
        <SizedBox height={verticalScale(16)} />
        <View style={styles.container}>
          <Text style={styles.event}>{strings.tickets}</Text>
          <View>
            {tickets?.map(ele => (
              <View key={ele?.price.toString()} style={styles.rowOnly}>
                <Text style={styles.ticket}>{`${ele?.name} - ${
                  ele?.price} ${getDate(ele?.end_date)})`}</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyPaymentLink(ele?.ticket_purchase_link ?? '')
                  }
                  activeOpacity={0.8}>
                  <ImageComponent source={copy} style={styles.copy} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <SizedBox height={verticalScale(20)} />
          <Text style={styles.event}>{strings.aboutEvent}</Text>
          <Text style={styles.desc}>{about}</Text>
          <ButtonComponent
            title={!is_event_owner ? strings.buyTicket : strings.adminTools}
            onPress={onBuyTicket}
          />
        </View>
      </ScrollView>
      <TicketCheckoutModal
        eventData={data as Result}
        onPurchase={onPurchaseTicket}
        ref={modalRef}
      />
    </View>
  );
};
