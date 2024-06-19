import { useFocusEffect, useNavigation } from "@react-navigation/native";
import _ from "lodash/fp";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ButtonComponent } from "~/components/button-component";
import { useMyUserId } from "~/navigation/AuthContext";
import { Screens } from "~/navigation/types";
import { LocalEvent } from "~/types/local-event";
import { toCurrency } from "~/utils/common";
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
  const navigation = useNavigation();
  const myUserId = useMyUserId();
  const isMyEvent = myUserId === event.id;

  useFocusEffect(
    useCallback(() => {
      setIsTicketAvailable(
        !_.isEmpty(event?.ticketTypes.filter((t) => t.isAvailable))
      );
    }, [event])
  );

  const ticketQuantityToString = (quantity?: number) =>
    !quantity || quantity === 0 ? "Unlimited" : quantity.toString();

  const showTicketsModal = () => {
    navigation.navigate(Screens.CHOOSE_TICKETS, { eventId: event.id });
  };

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

      {!isMyEvent && event.ticketTypes?.length ? (
        <ButtonComponent
          disabled={event.isCanceled}
          title={strings.chooseTickets}
          onPress={showTicketsModal}
        />
      ) : null}
    </View>
  );
};
