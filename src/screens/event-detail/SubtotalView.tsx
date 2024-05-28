import React from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { Order } from "~/types/order";
import { toCurrency } from "~/utils/common";
import { createStyleSheet } from "./style";

interface SubtotalViewProps {
  order: Order;
}

export const SubtotalView = ({ order }: SubtotalViewProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  // const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>();

  // useEffect(() => {
  //   if (!_.isEmpty(order.lineItems)) {
  //     calculatePrices();
  //   }
  // }, [order]);

  // async function calculatePrices() {
  //   const resp = await getTicketPriceBreakdown(eventId, tickets);
  //   if (resp.success) {
  //     setPriceBreakdown(resp.data);
  //     onTotalCalculated?.(resp.data.total);
  //   } else {
  //     LOG.error(resp.message);
  //   }
  // }

  return (
    <>
      <View style={{ marginVertical: 4 }}>
        <View style={styles.subTotalContainer}>
          <Text style={styles.subTotalLbl}>{strings.subTotal}</Text>
          <Text style={styles.subTotalLbl}>
            {toCurrency(order.costs.subtotal)}
          </Text>
        </View>
        <View style={styles.subTotalContainer}>
          <Text style={styles.subTotalLbl}>{strings.platformFee}</Text>
          <Text style={styles.subTotalLbl}>
            {toCurrency(order.costs.platformFee)}
          </Text>
        </View>
        <View style={styles.subTotalContainer}>
          <Text style={styles.subTotalLbl}>{strings.paymentFee}</Text>
          <Text style={styles.subTotalLbl}>
            {toCurrency(order.costs.paymentFee)}
          </Text>
        </View>
        <View style={styles.subTotalContainer}>
          <Text style={styles.subTotalLbl}>{strings.salesTax}</Text>
          <Text style={styles.subTotalLbl}>
            {toCurrency(order.costs.salesTax)}
          </Text>
        </View>
        <View style={styles.subTotalContainer}>
          <Text style={styles.subTotalLbl}>{strings.total}</Text>
          <Text style={styles.subTotalLbl}>
            {toCurrency(order.costs.total)}
          </Text>
        </View>
      </View>
    </>
  );
};
