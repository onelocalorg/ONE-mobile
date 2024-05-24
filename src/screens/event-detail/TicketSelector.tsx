import _ from "lodash/fp";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { minus, plus } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { LOG } from "~/config";
import { TicketType } from "~/types/ticket-type";
import { createStyleSheet } from "./style";

interface TicketSelectorProps {
  ticketTypes: TicketType[];
  onSelectedChanged?: (selected: Map<string, number>) => void;
}

export const TicketSelector = ({
  ticketTypes,
  onSelectedChanged,
}: TicketSelectorProps) => {
  LOG.debug("TicketSelector", ticketTypes);
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [ticketSelection, setTicketSelection] = useState<Map<string, number>>(
    new Map(ticketTypes.map((tt) => [tt.id, 0]))
  );

  const handleMinusClick = (tid: string) => {
    setTicketSelection((curTicketSelection) => {
      const typeIndex = ticketTypes.findIndex((tt) => tt.id === tid);
      if (typeIndex >= 0) {
        const curQuantity = curTicketSelection.get(tid)!;
        if (curQuantity > 0) {
          const updatedSelection = new Map([
            ...curTicketSelection,
            [tid, curQuantity - 1],
          ]);
          onSelectedChanged?.(updatedSelection);
          return updatedSelection;
        }
      }
      return curTicketSelection;
    });
  };

  const handlePlusClick = (tid: string) => {
    setTicketSelection((curTicketSelection) => {
      const typeIndex = ticketTypes.findIndex((tt) => tt.id === tid);
      if (typeIndex >= 0) {
        const ticketType = ticketTypes[typeIndex];
        const curQuantity = curTicketSelection.get(tid)!;
        if (_.isNil(ticketType.quantity) || ticketType.quantity > curQuantity) {
          const updatedSelection = new Map([
            ...curTicketSelection,
            [tid, curQuantity + 1],
          ]);
          onSelectedChanged?.(updatedSelection);
          return updatedSelection;
        }
      }
      return curTicketSelection;
    });
  };

  return (
    <>
      {ticketTypes.map((ticketType) => {
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
              <Text style={styles.quantityText}>
                {ticketSelection.get(ticketType.id)}
              </Text>
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
