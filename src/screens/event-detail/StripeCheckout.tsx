import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Button } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { Order } from "~/types/order";
import { SubtotalView } from "./SubtotalView";
import { createStyleSheet } from "./style";

interface StripeCheckoutProps {
  order: Order;
  onCheckoutComplete?: () => void;
}

export const StripeCheckout = ({
  order,
  onCheckoutComplete,
}: StripeCheckoutProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "ONE|Local",
      customerId: order.stripe.customer,
      customerEphemeralKeySecret: order.stripe.ephemeralKey,
      paymentIntentClientSecret: order.paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: false,
      //   defaultBillingDetails: {
      //     name: "Jane Doe",
      //   },
    });
    if (!error) {
      setLoading(true);
    }
  };

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
    <StripeProvider publishableKey={order.stripe.publishableKey}>
      <SubtotalView order={order} />
      <Button disabled={!loading} title="Checkout" onPress={openPaymentSheet} />
    </StripeProvider>
  );
};
