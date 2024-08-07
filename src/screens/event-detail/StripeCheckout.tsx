import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { Order } from "~/types/order";
import { handleApiError, toCurrency } from "~/utils/common";
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

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializePaymentSheet = async () => {
      if (order.stripe && order.paymentIntent) {
        const { error } = await initPaymentSheet({
          merchantDisplayName: "ONE Local",
          customerId: order.stripe.customer,
          customerEphemeralKeySecret: order.stripe.ephemeralKey,
          returnURL: "onelocal://stripe-redirect",
          paymentIntentClientSecret: order.paymentIntent,
        });
        if (!error) {
          setLoading(true);
        }
      }
    };

    initializePaymentSheet().catch(handleApiError("Stripe payment"));
  }, [initPaymentSheet, order]);

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
    <>
      {order.stripe && (
        <StripeProvider publishableKey={order.stripe.publishableKey}>
          <>
            {order.lineItems.map((li) => (
              <View key={li.ticketType.id} style={styles.rowOnly}>
                <Text style={styles.ticket}>{`${toCurrency(
                  li.ticketType.price
                )} - ${li.ticketType.name}`}</Text>
                <Text>
                  × {li.quantity} ={" "}
                  {toCurrency(li.ticketType.price * li.quantity)}
                </Text>
              </View>
            ))}
          </>
          <SubtotalView order={order} />
          <Button
            disabled={!loading}
            title="Checkout"
            onPress={openPaymentSheet}
          />
        </StripeProvider>
      )}
    </>
  );
};
