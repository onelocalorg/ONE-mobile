import _ from "lodash/fp";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { minus, plus } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { TicketSelection } from "~/types/ticket-selection";
import { TicketType } from "~/types/ticket-type";
import { toCurrency } from "~/utils/common";
import { createStyleSheet } from "./style";

interface TicketSelectorProps {
  ticketTypes: TicketType[];
  onSelectedChanged?: (selected: TicketSelection[]) => void;
}

export const TicketSelector = ({
  ticketTypes,
  onSelectedChanged,
}: TicketSelectorProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [tickets, setTickets] = useState<TicketSelection[]>(
    _.sortBy(_.get("price"), ticketTypes).map((tt) => ({
      type: tt,
      quantity: 0,
    }))
  );

  const handleMinusClick = (tid: string) => {
    setTickets((curTicketSelection) => {
      const ticketIndex = curTicketSelection.findIndex(
        (ts) => ts.type.id === tid
      );
      if (ticketIndex >= 0) {
        const ticket = curTicketSelection[ticketIndex];
        const curQuantity = ticket.quantity;
        if (curQuantity && curQuantity > 0) {
          const updatedSelection = [
            ...curTicketSelection.slice(0, ticketIndex),
            { ...ticket, quantity: curQuantity - 1 },
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
      const ticketIndex = curTicketSelection.findIndex(
        (ts) => ts.type.id === tid
      );
      if (ticketIndex >= 0) {
        const ticket = curTicketSelection[ticketIndex];
        const ticketType = ticketTypes[ticketIndex];
        const curQuantity = ticket.quantity;
        if (_.isNil(ticketType.quantity) || ticketType.quantity > curQuantity) {
          const updatedSelection = [
            ...curTicketSelection.slice(0, ticketIndex),
            { ...ticket, quantity: curQuantity + 1 },
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
        const ticketType = ticketTypes.find(
          (tt) => tt.id === selection.type.id
        )!;
        return (
          <View key={ticketType.id} style={[styles.row, styles.marginTop]}>
            <Text style={styles.text}>{`${toCurrency(ticketType.price)} - ${
              ticketType.name
            }`}</Text>
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
