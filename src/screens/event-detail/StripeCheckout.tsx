import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { Alert, Button } from "react-native";
import { StripeData } from "~/types/order";
import { handleApiError } from "~/utils/common";

interface StripeCheckoutProps {
  stripe: StripeData;
  paymentIntent: string;
  onCheckoutComplete?: () => void;
  children?: ReactNode;
}

export const StripeCheckout = ({
  stripe,
  paymentIntent,
  onCheckoutComplete,
  children,
}: StripeCheckoutProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePaymentSheet = async () => {
      console.log("STRIPE", stripe);
      console.log("PI", paymentIntent);
      const { error } = await initPaymentSheet({
        merchantDisplayName: "ONE Local",
        customerId: stripe.customer,
        customerEphemeralKeySecret: stripe.ephemeralKey,
        returnURL: "onelocal://stripe-redirect",
        paymentIntentClientSecret: paymentIntent,
      });
      if (error) {
        handleApiError("Failed to create payment sheet");
      }
      setLoading(false);
    };

    initializePaymentSheet()
      .then(() => {
        console.log("init");
      })
      .catch(handleApiError("Stripe payment"));
  }, [initPaymentSheet, stripe, paymentIntent]);

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert(
        "Success",
        "Your order has been placed! You should receive your tickets by email shortly.",
        [
          {
            text: "OK",
            onPress: () => onCheckoutComplete?.(),
          },
        ]
      );
    }
  };

  return (
    <StripeProvider publishableKey={stripe.publishableKey}>
      <>
        {children}
        <Button
          disabled={loading}
          title="Checkout"
          onPress={openPaymentSheet}
        />
      </>
    </StripeProvider>
  );
};
