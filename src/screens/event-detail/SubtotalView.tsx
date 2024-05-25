import _ from "lodash/fp";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { LOG } from "~/config";
import { getTicketPriceBreakdown } from "~/network/api/services/event-service";
import { PriceBreakdown } from "~/types/price-breakdown";
import { TicketSelection } from "~/types/ticket-selection";
import { TicketType } from "~/types/ticket-type";
import { createStyleSheet } from "./style";

interface SubtotalViewProps {
  eventId: string;
  ticketTypes: TicketType[];
  tickets: TicketSelection[];
}

export const SubtotalView = ({
  eventId,
  ticketTypes,
  tickets,
}: SubtotalViewProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>();

  useEffect(() => {
    if (!_.isEmpty(tickets)) {
      calculatePrices();
    }
  }, [eventId, tickets]);

  async function calculatePrices() {
    const resp = await getTicketPriceBreakdown(eventId, tickets);
    if (resp.success) {
      setPriceBreakdown(resp.data);
    } else {
      LOG.error(resp.message);
    }
  }

  return (
    <>
      <View style={{ marginVertical: 4 }}>
        <View style={styles.subTotalContainer}>
          <Text style={styles.subTotalLbl}>{strings.subTotal}</Text>
          <Text style={styles.subTotalLbl}>
            ${priceBreakdown?.subtotal ?? "0.00"}
          </Text>
        </View>
        <View style={styles.subTotalContainer}>
          <Text style={styles.subTotalLbl}>{strings.platformFee}</Text>
          <Text style={styles.subTotalLbl}>
            ${priceBreakdown?.platformFee ?? "0.00"}
          </Text>
        </View>
        <View style={styles.subTotalContainer}>
          <Text style={styles.subTotalLbl}>{strings.paymentFee}</Text>
          <Text style={styles.subTotalLbl}>
            ${priceBreakdown?.paymentFee ?? "0.00"}
          </Text>
        </View>
        <View style={styles.subTotalContainer}>
          <Text style={styles.subTotalLbl}>{strings.salesTax}</Text>
          <Text style={styles.subTotalLbl}>
            ${priceBreakdown?.salesTax ?? "0.00"}
          </Text>
        </View>
        <View style={styles.subTotalContainer}>
          <Text style={styles.subTotalLbl}>{strings.total}</Text>
          <Text style={styles.subTotalLbl}>
            ${priceBreakdown?.total ?? "0.00"}
          </Text>
        </View>
      </View>
    </>
  );
};
