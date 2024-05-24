import Big from "big.js";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ButtonComponent } from "~/components/button-component";
import { EventCard } from "~/components/events/EventCard";
import { LocalEvent } from "~/types/local-event";
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
  const [selectedTickets, setSelectedTickets] = useState<Map<string, number>>(
    new Map()
  );

  const selectedTicketPrice = () =>
    event.ticketTypes.reduce(
      (total, ticketType) =>
        (total = total.plus(
          ticketType.price.times(selectedTickets.get(ticketType.id) ?? 0)
        )),
      Big(0)
    );

  return (
    <View style={styles.modalContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <EventCard data={event} />
        <Text style={styles.amount}>${selectedTicketPrice().toFixed(0)}</Text>
        <TicketSelector
          ticketTypes={event.ticketTypes}
          onSelectedChanged={setSelectedTickets}
        />
        <View style={styles.lineSpace} />

        <SubtotalView
          eventId={event.id}
          ticketTypes={event.ticketTypes}
          tickets={selectedTickets}
        />
        <ButtonComponent
          // disabled={buttonDisable}
          // onPress={onSubmit}
          // onPress={() =>
          //   onPurchase(
          //     setPrice,
          //     eventData?.tickets?.[selectedRadioIndex]?.id ?? '',
          //     eventData?.tickets?.[selectedRadioIndex]?.name,
          //     quantityticket,
          //   )
          // }
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
      </ScrollView>
    </View>
  );
};
