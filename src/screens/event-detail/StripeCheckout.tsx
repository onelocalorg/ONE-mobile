import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { Alert } from "react-native";
import { Button, ButtonIcon, ButtonText } from "~/components/ui/button";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "~/components/ui/drawer";
import { CloseIcon } from "~/components/ui/icon";
import { StripePaymentInfo } from "~/types/stripe-payment-info";

interface StripeCheckoutProps {
  paymentInfo: StripePaymentInfo;
  isOpen: boolean;
  onCancel?: () => void;
  onCheckoutComplete?: () => void;
  children: ReactNode;
}

export const StripeCheckout = ({
  paymentInfo,
  isOpen,
  onCancel,
  onCheckoutComplete,
  children,
}: StripeCheckoutProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializePaymentSheet = async () => {
      const { error } = await initPaymentSheet({
        merchantDisplayName: "ONE Local",
        customerId: paymentInfo.stripe.customer,
        customerEphemeralKeySecret: paymentInfo.stripe.ephemeralKey,
        paymentIntentClientSecret: paymentInfo.paymentIntent,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: false,
        // FIXME Properly implement this
        returnURL: "onelocal://stripe-redirect",
      });
      if (!error) {
        setLoading(true);
      }
    };

    void initializePaymentSheet();
  }, [initPaymentSheet, paymentInfo]);

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!", [
        {
          text: "OK",
          onPress: () => onCheckoutComplete?.(),
        },
      ]);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onCheckoutComplete}
      size="md"
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader>
          <Button variant="link" onPress={onCancel} size="xl">
            <ButtonIcon as={CloseIcon} />
          </Button>
        </DrawerHeader>
        <DrawerBody>
          <StripeProvider publishableKey={paymentInfo.stripe.publishableKey}>
            <>
              {children}
              <Button disabled={!loading} onPress={openPaymentSheet}>
                <ButtonText>Checkout</ButtonText>
              </Button>
            </>
          </StripeProvider>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
