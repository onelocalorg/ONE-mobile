import { useState } from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ButtonComponent } from "~/components/button-component";
import { EventCard } from "~/components/events/EventCard";
import { OneModal } from "~/components/modal-component/OneModal";
import { createOrder } from "~/network/api/services/order-service";
import { LineItemTypes } from "~/types/line-item";
import { LocalEvent } from "~/types/local-event";
import { Order } from "~/types/order";
import { TicketSelection } from "~/types/ticket-selection";
import { toCurrency } from "~/utils/common";
import { StripeCheckout } from "./StripeCheckout";
import { TicketSelector } from "./TicketSelector";
import { createStyleSheet } from "./style";

interface ChooseTicketsProps {
  event: LocalEvent;
  onCheckoutComplete?: () => void;
}
export const ChooseTickets = ({
  event,
  onCheckoutComplete,
}: ChooseTicketsProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const [tickets, setTickets] = useState<TicketSelection[]>([]);
  const [order, setOrder] = useState<Order>();
  const [isCheckoutVisible, setCheckoutVisible] = useState(false);

  const selectedTicketPrice = () =>
    tickets.reduce(
      (total, ticket) => total + ticket.type.price * ticket.quantity,
      0
    );

  const createTicketOrder = async () => {
    const resp = await createOrder(
      tickets
        .filter((ts) => ts.quantity > 0)
        .map((ts) => ({
          type: LineItemTypes.TICKET,
          quantity: ts.quantity,
          event,
          ticketType: ts.type,
        }))
    );
    if (resp.success) {
      setOrder(resp.data);
      setCheckoutVisible(true);
    }
  };

  return (
    <View style={styles.modalContainer}>
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      <EventCard data={event} />
      <Text style={styles.amount}>{toCurrency(selectedTicketPrice())}</Text>
      <TicketSelector
        ticketTypes={event.ticketTypes}
        onSelectedChanged={setTickets}
      />
      <View style={styles.lineSpace} />
      <ButtonComponent
        // disabled={buttonDisable}
        onPress={createTicketOrder}
        title={strings.checkout}
      />
      {order ? (
        <OneModal
          isVisible={isCheckoutVisible}
          onDismiss={() => setCheckoutVisible(false)}
        >
          <StripeCheckout
            order={order}
            onCheckoutComplete={() => {
              setCheckoutVisible(false);
              onCheckoutComplete?.();
            }}
          />
        </OneModal>
      ) : null}
    </View>
  );
};
