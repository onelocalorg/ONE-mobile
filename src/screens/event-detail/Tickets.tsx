import _ from "lodash/fp";
import React from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ButtonComponent } from "~/components/button-component";
import { useMyUserId } from "~/navigation/AuthContext";
import { LocalEvent } from "~/types/local-event";
import { toCurrency } from "~/utils/common";
import { ChooseTicketsModal } from "./ChooseTicketsModal";
import { createStyleSheet as createBaseStyleSheet } from "./style";

interface TicketsProps {
  event: LocalEvent;
}

export const Tickets = ({ event }: TicketsProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createBaseStyleSheet(theme);
  const myUserId = useMyUserId();
  const isMyEvent = myUserId === event.id;
  const [isCheckoutVisible, setCheckoutVisible] = React.useState(false);

  const ticketQuantityToString = (quantity?: number) =>
    !quantity || quantity === 0 ? "Unlimited" : quantity.toString();

  return (
    <View style={styles.container}>
      {event.ticketTypes?.length && (
        <Text style={styles.event}>{strings.tickets}</Text>
      )}
      <View>
        {_.sortBy(_.get("price"), event.ticketTypes).map((tt) => (
          <View key={tt.id} style={styles.rowOnly}>
            <Text style={styles.ticket}>{`${ticketQuantityToString(
              tt.quantity
            )} ${tt.name} - ${toCurrency(tt.price)}`}</Text>
          </View>
        ))}
      </View>

      {!isMyEvent && event.ticketTypes?.length && (
        <ButtonComponent
          disabled={!!event.cancelDate}
          title={strings.chooseTickets}
          onPress={() => setCheckoutVisible(true)}
        />
      )}
      <ChooseTicketsModal
        event={event}
        isOpen={isCheckoutVisible}
        onClose={() => setCheckoutVisible(false)}
      />
    </View>
  );
};
