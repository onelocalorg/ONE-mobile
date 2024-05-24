import _ from "lodash/fp";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { minus, plus } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { LOG } from "~/config";
import { TicketType } from "~/types/ticket-type";
import { createStyleSheet } from "./style";

interface TicketSelectorProps {
  ticketTypes: TicketType[];
  onSelectedChanged?: (selected: Map<TicketType, number>) => void;
}

export const TicketSelector = ({
  ticketTypes,
  onSelectedChanged,
}: TicketSelectorProps) => {
  LOG.debug("TicketSelector", ticketTypes);
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [ticketSelection, setTicketSelection] = useState<
    Map<TicketType, number>
  >(new Map(ticketTypes.map((tt) => [tt, 0])));

  const handleMinusClick = (ticket: TicketType) => {
    setTicketSelection((curTicketSelection) => {
      const curQuantity = curTicketSelection.get(ticket);
      if (curQuantity && curQuantity > 0) {
        const updatedSelection = new Map([
          ...curTicketSelection,
          [ticket, curQuantity - 1],
        ]);
        onSelectedChanged?.(updatedSelection);
        return updatedSelection;
      } else {
        return curTicketSelection;
      }
    });
  };

  const handlePlusClick = (ticket: TicketType) => {
    LOG.debug("handlePlus", ticket);
    setTicketSelection((curTicketSelection) => {
      const curQuantity = curTicketSelection.get(ticket);
      if (
        curQuantity &&
        (_.isNil(ticket.quantity) || ticket.quantity > curQuantity)
      ) {
        const updatedSelection = new Map([
          ...curTicketSelection,
          [ticket, curQuantity + 1],
        ]);
        onSelectedChanged?.(updatedSelection);
        return updatedSelection;
      } else {
        return curTicketSelection;
      }
    });
  };

  return (
    <>
      {_.map(
        (ticket) => (
          <View key={ticket.name} style={[styles.row, styles.marginTop]}>
            {/* <ImageComponent
              source={
                index === selectedRadioIndex ? activeRadio : inactiveRadio
              }
              style={styles.radio}
            /> */}
            <Text
              style={styles.text}
            >{`$${ticket.type.price} - ${ticket.type.name}`}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleMinusClick(ticket)}>
                <ImageComponent
                  style={styles.quantityIcon}
                  source={minus}
                ></ImageComponent>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{ticket.quantity}</Text>
              <TouchableOpacity onPress={() => handlePlusClick(ticket)}>
                <ImageComponent
                  style={styles.quantityIcon}
                  source={plus}
                ></ImageComponent>
              </TouchableOpacity>
            </View>
          </View>
        ),
        ticketSelection
      )}
    </>
  );
};
