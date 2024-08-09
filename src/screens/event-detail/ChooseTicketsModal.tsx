import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ShortModal } from "~/components/ShortModal";
import { ButtonComponent } from "~/components/button-component";
import { Loader } from "~/components/loader";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  EventMutations,
  useEventService,
} from "~/network/api/services/useEventService";
import {
  OrderMutations,
  useOrderService,
} from "~/network/api/services/useOrderService";
import { LineItemTypes } from "~/types/line-item";
import { Order, OrderData } from "~/types/order";
import { Rsvp, RsvpData } from "~/types/rsvp";
import { TicketSelection } from "~/types/ticket-selection";
import { toCurrency } from "~/utils/common";
import { StripeCheckout } from "./StripeCheckout";
import { SubtotalView } from "./SubtotalView";
import { TicketSelector } from "./TicketSelector";
import { createStyleSheet } from "./style";

export const ChooseTicketsModal = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.CHOOSE_TICKETS>) => {
  const eventId = route.params.eventId;
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const [tickets, setTickets] = useState<TicketSelection[]>([]);

  useOrderService();

  const {
    queries: { detail: getEvent },
  } = useEventService();

  const { mutate: createRsvp } = useMutation<Rsvp, Error, RsvpData>({
    mutationKey: [EventMutations.createRsvp],
  });

  const { data: event, isLoading } = useQuery(getEvent(eventId));

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

  const numTickets = () =>
    tickets.reduce((total, ticket) => total + ticket.quantity, 0);

  const createTicketOrder = () => {
    if (event) {
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
            console.log("success createOrder");

            if (!order.paymentIntent) {
              // TODO Create RSVP here
              console.log("creating rsvp ...");

              Alert.alert(
                "Tickets issued",
                "Check your email to find your order confirmation.",
                [{ text: "OK", onPress: navigation.goBack }]
              );
            }
            // else modal below will pop up
          },
        }
      );
    }
  };

  return (
    <ShortModal height={500}>
      <View style={styles.modalContainer}>
        <Loader visible={isLoading || isPending} />
        {event && (
          <View>
            <Text style={styles.amount}>
              {toCurrency(selectedTicketPrice())}
            </Text>
            <TicketSelector
              ticketTypes={event.ticketTypes}
              onSelectedChanged={setTickets}
            />
            <View style={styles.lineSpace} />
            <ButtonComponent
              onPress={createTicketOrder}
              title={strings.addToCart}
              disabled={numTickets() < 1}
            />
            {order?.paymentIntent && order?.stripe ? (
              <>
                <View style={styles.lineSpace} />
                <StripeCheckout
                  stripe={order.stripe}
                  paymentIntent={order.paymentIntent}
                  onCheckoutComplete={() => {
                    navigation.popToTop();
                  }}
                >
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
                    <SubtotalView order={order} />
                  </>
                </StripeCheckout>
              </>
            ) : (
              <View style={{ marginBottom: 200 }} />
            )}
          </View>
        )}
      </View>
    </ShortModal>
  );
};
