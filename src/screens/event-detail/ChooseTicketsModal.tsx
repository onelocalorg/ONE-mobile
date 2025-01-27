import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Alert } from "react-native";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { Button, ButtonIcon, ButtonText } from "~/components/ui/button";
import { Center } from "~/components/ui/center";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "~/components/ui/drawer";
import { Heading } from "~/components/ui/heading";
import { CloseIcon } from "~/components/ui/icon";
import { Spinner } from "~/components/ui/spinner";
import {
  OrderMutations,
  useOrderService,
} from "~/network/api/services/useOrderService";
import { LineItemTypes } from "~/types/line-item";
import { LocalEvent } from "~/types/local-event";
import { isPayableOrder, Order, OrderData, PayableOrder } from "~/types/order";
import { TicketSelection } from "~/types/ticket-selection";
import { toCurrency } from "~/utils/common";
import { StripeCheckout } from "./StripeCheckout";
import { TicketSelector } from "./TicketSelector";

interface ChooseTicketsModalProps {
  event: LocalEvent;
  isOpen: boolean;
  onClose: () => void;
}
export const ChooseTicketsModal = ({
  event,
  isOpen = false,
  onClose,
}: ChooseTicketsModalProps) => {
  const { strings } = useStringsAndLabels();
  const [tickets, setTickets] = useState<TicketSelection[]>([]);
  const [isCheckoutVisible, setCheckoutVisible] = useState(false);

  // So that mutationFn is set
  useOrderService();

  const {
    isPending,
    mutate: createOrder,
    data: order,
  } = useMutation<Order, Error, OrderData>({
    mutationKey: [OrderMutations.createOrder],
  });

  const selectedTicketPrice = () =>
    tickets.reduce(
      (total, ticket) => total + ticket.type.price * ticket.quantity,
      0
    );

  const numTickets = tickets.reduce(
    (total, ticket) => total + ticket.quantity,
    0
  );

  const cancelOrder = () => {
    setTickets([]);
    onClose();
  };

  const createTicketOrder = () => {
    createOrder(
      {
        lineItems: tickets
          .filter((ts) => ts.quantity > 0)
          .map((ts) => ({
            type: LineItemTypes.TICKET,
            quantity: ts.quantity,
            event,
            ticketType: ts.type,
          })),
      },
      {
        onSuccess(order) {
          if (!isPayableOrder(order)) {
            Alert.alert(
              "Tickets issued",
              "Check your email to find your order confirmation.",
              [{ text: "OK", onPress: onClose }]
            );
          } else {
            setCheckoutVisible(true);
          }
        },
      }
    );
  };

  return (
    <Drawer
      anchor="bottom"
      isOpen={isOpen}
      closeOnOverlayClick={true}
      size="md"
    >
      <DrawerBackdrop />
      <DrawerContent>
        {isPending && <Spinner />}
        {/* <EventCard event={event} /> */}
        <DrawerHeader>
          <Button variant="link" onPress={cancelOrder} size="xl">
            <ButtonIcon as={CloseIcon} />
          </Button>
        </DrawerHeader>
        <DrawerBody>
          <Center>
            <Heading size="5xl">{toCurrency(selectedTicketPrice())}</Heading>
          </Center>
          {event && (
            <TicketSelector
              ticketTypes={event.ticketTypes}
              onSelectedChanged={setTickets}
            />
          )}
          <DrawerFooter className="py-8">
            <Button
              className="flex-1"
              onPress={createTicketOrder}
              isDisabled={numTickets === 0 || isPending}
            >
              <ButtonText>{strings.checkout}</ButtonText>
            </Button>
          </DrawerFooter>
        </DrawerBody>
      </DrawerContent>
      {isPayableOrder(order) && (
        <StripeCheckout
          order={order as PayableOrder}
          isOpen={isCheckoutVisible}
          onCheckoutComplete={() => {
            setCheckoutVisible(false);
            onClose();
          }}
          onCancel={() => setCheckoutVisible(false)}
        />
      )}
    </Drawer>
  );
};
