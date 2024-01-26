/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback} from 'react';
import {PaymentSheet, useStripe} from '@stripe/stripe-react-native';
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';

interface PaymentScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      clientSecret: string;
      onSuccess?: () => void;
    };
  };
}

export const PaymentScreen = (props: PaymentScreenProps) => {
  const {route, navigation} = props || {};
  const {clientSecret, onSuccess} = route?.params ?? {};
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const initializePaymentSheet = async () => {
    console.log('-------------------------initializePaymentSheet---------------------',initPaymentSheet)
    try {
      await initPaymentSheet({
        paymentIntentClientSecret: clientSecret ?? '',
        merchantDisplayName: 'Bold Boulder',
        style: 'automatic',
        billingDetailsCollectionConfiguration: {
          address: PaymentSheet.AddressCollectionMode.FULL,
          name: PaymentSheet.CollectionMode.ALWAYS,
        },
      });

      setTimeout(() => {
        openPaymentSheet();
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const openPaymentSheet = async () => {
    try {
      const res = await presentPaymentSheet();
      console.log('-------------------------openPaymentSheet---------------------',res)
      if (res?.error?.code === 'Canceled') {
        navigation?.goBack();
      } else {
        console.log('-----------------onSuccess call-----------------',onSuccess)
        onSuccess?.();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (clientSecret) {
        initializePaymentSheet();
      }
    }, [clientSecret]),
  );

  return <></>;
};
