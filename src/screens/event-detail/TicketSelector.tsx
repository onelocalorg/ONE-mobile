import _ from "lodash/fp";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { minus, plus } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { LOG } from "~/config";
import { TicketSelection } from "~/types/ticket-selection";
import { TicketType } from "~/types/ticket-type";
import { createStyleSheet } from "./style";

interface TicketSelectorProps {
  ticketTypes: TicketType[];
  onSelectedChanged?: (selected: TicketSelection[]) => void;
}

export const TicketSelector = ({
  ticketTypes,
  onSelectedChanged,
}: TicketSelectorProps) => {
  LOG.debug("TicketSelector", ticketTypes);
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [tickets, setTickets] = useState<TicketSelection[]>(
    ticketTypes.map((tt) => ({ id: tt.id, quantity: 0 }))
  );

  const handleMinusClick = (tid: string) => {
    setTickets((curTicketSelection) => {
      const ticketIndex = curTicketSelection.findIndex((ts) => ts.id === tid);
      if (ticketIndex >= 0) {
        const ticket = curTicketSelection[ticketIndex];
        const curQuantity = ticket.quantity;
        if (curQuantity && curQuantity > 0) {
          const updatedSelection = [
            ...curTicketSelection.slice(0, ticketIndex),
            { id: tid, quantity: curQuantity - 1 },
            ...curTicketSelection.slice(ticketIndex + 1),
          ];
          onSelectedChanged?.(updatedSelection);
          return updatedSelection;
        }
      }
      return curTicketSelection;
    });
  };

  const handlePlusClick = (tid: string) => {
    setTickets((curTicketSelection) => {
      const ticketIndex = curTicketSelection.findIndex((ts) => ts.id === tid);
      if (ticketIndex >= 0) {
        const ticket = curTicketSelection[ticketIndex];
        const ticketType = ticketTypes[ticketIndex];
        const curQuantity = ticket.quantity;
        if (_.isNil(ticketType.quantity) || ticketType.quantity > curQuantity) {
          const updatedSelection = [
            ...curTicketSelection.slice(0, ticketIndex),
            { id: tid, quantity: curQuantity + 1 },
            ...curTicketSelection.slice(ticketIndex + 1),
          ];
          onSelectedChanged?.(updatedSelection);
          return updatedSelection;
        }
      }
      return curTicketSelection;
    });
  };

  return (
    <>
      {tickets.map((selection) => {
        const ticketType = ticketTypes.find((tt) => tt.id === selection.id)!;
        return (
          <View key={ticketType.id} style={[styles.row, styles.marginTop]}>
            <Text
              style={styles.text}
            >{`$${ticketType.price} - ${ticketType.name}`}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleMinusClick(ticketType.id)}>
                <ImageComponent
                  style={styles.quantityIcon}
                  source={minus}
                ></ImageComponent>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{selection.quantity}</Text>
              <TouchableOpacity onPress={() => handlePlusClick(ticketType.id)}>
                <ImageComponent
                  style={styles.quantityIcon}
                  source={plus}
                ></ImageComponent>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </>
  );
};
