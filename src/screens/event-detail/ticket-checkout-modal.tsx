import {useAppTheme} from '@app-hooks/use-app-theme';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import React, {forwardRef, useEffect, useState} from 'react';
import {createStyleSheet} from './style';
import {ModalComponent} from '@components/modal-component';
import {Text, TouchableOpacity, View} from 'react-native';
import {EventList} from '@components/event-list';
import {ImageComponent} from '@components/image-component';
import {ButtonComponent} from '@components/button-component';
import {activeRadio, inactiveRadio} from '@assets/images';
import {Result} from '@network/hooks/home-service-hooks/use-event-lists';
import {formatPrice} from '@utils/common';

interface TicketCheckoutModalCompProps {
  onPurchase: (price: string, ticketId: string, ticketName: string) => void;
  eventData: Result;
}

const TicketCheckoutModalComp = (
  props: TicketCheckoutModalCompProps,
  ref: React.Ref<unknown> | undefined,
) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {strings} = useStringsAndLabels();
  const {onPurchase, eventData} = props || {};
  const [selectedRadioIndex, setSelectedRadioIndex] = useState(0);

  useEffect(() => {
    const index = eventData?.tickets.findIndex(ele => !ele.is_ticket_purchased);
    setSelectedRadioIndex(index);
  }, [eventData]);

  const onSelectTicket = (index: number) => {
    setSelectedRadioIndex(index);
  };

  return (
    <ModalComponent ref={ref} title={strings.ticketCheckout}>
      <View style={styles.modalContainer}>
        <EventList data={eventData} />
        <Text style={styles.amount}>
          {formatPrice(eventData?.tickets?.[selectedRadioIndex]?.price)}
        </Text>
        {eventData?.tickets.map((ele, index) => {
          if (ele?.is_ticket_purchased) {
            return <></>;
          }

          return (
            <TouchableOpacity
              key={ele?.name.toString()}
              activeOpacity={0.8}
              onPress={() => onSelectTicket(index)}
              style={[styles.row, styles.marginTop]}>
              <ImageComponent
                source={
                  index === selectedRadioIndex ? activeRadio : inactiveRadio
                }
                style={styles.radio}
              />
              <Text style={styles.text}>{`${ele?.name} - ${formatPrice(
                ele?.price,
              )}`}</Text>
            </TouchableOpacity>
          );
        })}
        <View style={styles.line} />
        <ButtonComponent
          onPress={() =>
            onPurchase(
              eventData?.tickets?.[selectedRadioIndex]?.price,
              eventData?.tickets?.[selectedRadioIndex]?.id ?? '',
              eventData?.tickets?.[selectedRadioIndex]?.name,
            )
          }
          title={strings.purchase}
        />
      </View>
    </ModalComponent>
  );
};

export const TicketCheckoutModal = forwardRef(TicketCheckoutModalComp);
