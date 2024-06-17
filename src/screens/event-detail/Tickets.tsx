import { useFocusEffect } from "@react-navigation/native";
import _ from "lodash/fp";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ButtonComponent } from "~/components/button-component";
import { OneModal } from "~/components/modal-component/OneModal";
import { LocalEvent } from "~/types/local-event";
import { toCurrency } from "~/utils/common";
import { ChooseTickets } from "./ChooseTickets";
import { createStyleSheet as createBaseStyleSheet } from "./style";

interface TicketsProps {
  event: LocalEvent;
  onTicketPurchased?: () => void;
}

export const Tickets = ({ event, onTicketPurchased }: TicketsProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createBaseStyleSheet(theme);
  const [isTicketAvailable, setIsTicketAvailable] = useState(false);
  const [isChooseTicketsModalVisible, setChooseTicketsModalVisible] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsTicketAvailable(
        !_.isEmpty(event?.ticketTypes.filter((t) => t.isAvailable))
      );
    }, [event])
  );

  const ticketQuantityToString = (quantity?: number) =>
    !quantity || quantity === 0 ? "Unlimited" : quantity.toString();

  return (
    <View style={styles.container}>
      {event.ticketTypes?.length ? (
        <Text style={styles.event}>{strings.tickets}</Text>
      ) : (
        <></>
      )}
      <View>
        {event.ticketTypes?.map((tt) => (
          <View key={tt.id} style={styles.rowOnly}>
            <Text style={styles.ticket}>{`${ticketQuantityToString(
              tt.quantity
            )} ${tt.name} - ${toCurrency(tt.price)}`}</Text>
          </View>
        ))}
      </View>

      {!event.isMyEvent && event.ticketTypes?.length ? (
        <ButtonComponent
          disabled={event.isCanceled}
          title={strings.chooseTickets}
          onPress={() => setChooseTicketsModalVisible(true)}
        />
      ) : null}
      {event ? (
        <OneModal
          title={strings.chooseTickets}
          isVisible={isChooseTicketsModalVisible}
          onDismiss={() => setChooseTicketsModalVisible(false)}
        >
          <ChooseTickets
            event={event}
            onCheckoutComplete={() => {
              setChooseTicketsModalVisible(false);
              onTicketPurchased?.();
            }}
          />
        </OneModal>
      ) : null}
    </View>
  );
};
