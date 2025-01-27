import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { Button, ButtonIcon, ButtonText } from "~/components/ui/button";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "~/components/ui/drawer";
import { CloseIcon } from "~/components/ui/icon";
import { PayableOrder } from "~/types/order";
import { toCurrency } from "~/utils/common";
import { SubtotalView } from "./SubtotalView";
import { createStyleSheet } from "./style";

interface StripeCheckoutProps {
  order: PayableOrder;
  isOpen: boolean;
  onCancel?: () => void;
  onCheckoutComplete?: () => void;
}

export const StripeCheckout = ({
  order,
  isOpen,
  onCancel,
  onCheckoutComplete,
}: StripeCheckoutProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "ONE Local",
      customerId: order.stripe.customer,
      customerEphemeralKeySecret: order.stripe.ephemeralKey,
      paymentIntentClientSecret: order.paymentIntent,
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
          <StripeProvider publishableKey={order.stripe.publishableKey}>
            <>
              {order.lineItems.map((li) => (
                <View key={li.ticketType.id} style={styles.rowOnly}>
                  <Text style={styles.ticket}>{`${toCurrency(
                    li.ticketType.price
                  )} - ${li.ticketType.name}`}</Text>
                  <Text>
                    x {li.quantity} ={" "}
                    {toCurrency(li.ticketType.price * li.quantity)}
                  </Text>
                </View>
              ))}
            </>
            <SubtotalView order={order} />
            <Button disabled={!loading} onPress={openPaymentSheet}>
              <ButtonText>Checkout</ButtonText>
            </Button>
          </StripeProvider>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
