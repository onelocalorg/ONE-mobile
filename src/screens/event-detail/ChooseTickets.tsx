import Big from "big.js";
import { useState } from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ButtonComponent } from "~/components/button-component";
import { EventCard } from "~/components/events/EventCard";
import { createOrder } from "~/network/api/services/order-service";
import { LocalEvent } from "~/types/local-event";
import { TicketSelection } from "~/types/ticket-selection";
import { SubtotalView } from "./SubtotalView";
import { TicketSelector } from "./TicketSelector";
import { createStyleSheet } from "./style";

interface ChooseTicketsProps {
  event: LocalEvent;
}
export const ChooseTickets = ({ event }: ChooseTicketsProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const [tickets, setTickets] = useState<TicketSelection[]>([]);

  const ticketTypeById = (id: string) =>
    event.ticketTypes.find((tt) => tt.id === id);

  const selectedTicketPrice = () =>
    tickets
      .filter((t) => t.quantity > 0)
      .reduce(
        (total, ticket) =>
          total.plus(
            ticketTypeById(ticket.id)?.price.times(ticket.quantity) ?? 0
          ),
        Big(0)
      );

  const purchaseTickets = async () => {
    const resp = await createOrder(event.id, tickets);
  };

  return (
    <View style={styles.modalContainer}>
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      <EventCard data={event} />
      <Text style={styles.amount}>${selectedTicketPrice().toFixed(0)}</Text>
      <TicketSelector
        ticketTypes={event.ticketTypes}
        onSelectedChanged={setTickets}
      />
      <View style={styles.lineSpace} />

      <SubtotalView
        eventId={event.id}
        ticketTypes={event.ticketTypes}
        tickets={tickets}
      />
      <ButtonComponent
        // disabled={buttonDisable}
        onPress={purchaseTickets}
        title={strings.purchase}
      />
      {/* <OneModal isVisible={false}>
      <>
        <CardList />
        <View>
          <TouchableOpacity
            //   onPress={() => OnCardValidation()}
            activeOpacity={0.8}
            style={styles.addCardContainer}
          >
            <View />
            <Text style={styles.titleTwo}>
              {strings.pay} ${totalPrice}
            </Text>
            <ImageComponent
              source={buttonArrowBlue}
              style={styles.buttonArrow}
            />
          </TouchableOpacity>
        </View>
      </>
    </OneModal> */}
      {/* </ScrollView> */}
    </View>
  );
};
