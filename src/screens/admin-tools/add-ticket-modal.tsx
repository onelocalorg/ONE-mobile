import { useAppTheme } from "@app-hooks/use-app-theme";
import { useStringsAndLabels } from "@app-hooks/use-strings-and-labels";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import { createStyleSheet } from "./style";
import { ModalComponent } from "@components/modal-component";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import { EventList } from "@components/event-list";
import { Input } from "@components/input";
import { ImageComponent } from "@components/image-component";
import { activeRadio, arrowDown, calendar, dummy, event, pin, save } from "@assets/images";
import {
  DatePickerRefProps,
  DateRangePicker,
} from "@components/date-range-picker";
import moment from "moment";
import { SizedBox } from "@components/sized-box";
import { normalScale, verticalScale } from "@theme/device/normalize";
import { ButtonComponent } from "@components/button-component";
import {
  Result,
  Ticket,
} from "@network/hooks/home-service-hooks/use-event-lists";
import { useCreateTicket } from "@network/hooks/home-service-hooks/use-create-ticket";
import { Loader } from "@components/loader";
import { TicketBodyParamProps } from "@network/api/services/home-service";
import { useEditTicket } from "@network/hooks/home-service-hooks/use-edit-ticket";
import { useFocusEffect } from "@react-navigation/native";

interface AddTicketModalCompProps {
  eventDetails: Result;
  eventId: string;
  ticketData: Ticket;
  isEdit: boolean;
  onSuccessfulTicketCreation?: (ticketDetails: TicketBodyParamProps) => void;
  onCancel?: () => void;
}

const AddTicketModalComp = (
  props: AddTicketModalCompProps,
  ref: React.Ref<unknown> | undefined
) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const datePickerRef: React.Ref<DatePickerRefProps> = useRef(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [price, setPrice] = useState("");
  const [ticketName, setTicketName] = useState("");
  const [ticketquantity, totalTicketQuantity] = useState("");
  const {
    eventDetails,
    eventId,
    ticketData,
    isEdit,
    onSuccessfulTicketCreation,
    onCancel,
  } = props || {};
  const { mutateAsync, isLoading } = useCreateTicket();
  const { mutateAsync: editTicket, isLoading: editTicketLoading } =
    useEditTicket();

  useFocusEffect(
    useCallback(() => {
      if (ticketData && isEdit) {
        setEndDate(new Date(ticketData?.end_date));
        setStartDate(new Date(ticketData?.start_date));
        setPrice(ticketData?.price);
        setTicketName(ticketData?.name);
        totalTicketQuantity(ticketData?.quantity);
      }
    }, [ticketData, isEdit])
  );

  const onSetPrice = (text: string) => {
    setPrice(text.replace("$ ", "").replace("$", ""));
  };

  const onSetQuantity = (text: string) => {
    totalTicketQuantity(text);
  };

  const onCreateTicket = async () => {
    const request = {
      name: ticketName,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      price: price.toString(),
      // event: eventId,
      quantity: ticketquantity,
    };
    let res;
    if (isEdit) {
      res = await editTicket({ bodyParams: request, ticketId: ticketData?.id });
    } else {
      res = await mutateAsync({ bodyParams: request });
    }

    if (res?.success) {
      resetState();
      onSuccessfulTicketCreation?.(res?.data);
    }
  };

  const checkValidation = () => {
    return !(ticketName && price && ticketquantity);
  };

  const resetState = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setPrice("");
    setTicketName("");
    totalTicketQuantity("");
    onCancel?.();
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  return (
    <View>
      <ModalComponent callBack={resetState} ref={ref}>
        <Loader visible={isLoading || editTicketLoading} showOverlay />
        {isEdit === false ? (
          <Text style={styles.ticketTitle}>{strings.ticketAdd}</Text>
        ) : (
          <Text style={styles.ticketTitle}>{strings.ticketEdit}</Text>
        )}

        <TouchableOpacity activeOpacity={1} onPress={keyboardDismiss}>
          <View style={styles.modalContainer}>
            <EventList data={eventDetails} />
            <Text style={styles.label}>{strings.ticketName}</Text>
            <Input value={ticketName} onChangeText={setTicketName} />
            <Text style={styles.label}>{strings.ticketTimeframe}</Text>
            <View style={styles.dateView}>
              <ImageComponent source={calendar} style={styles.calendar} />
              <TouchableOpacity
                onPress={() => datePickerRef.current?.onOpenModal("start")}
                activeOpacity={0.8}
                style={styles.rowData}
              >
                <Text style={styles.startLabel}>
                  {moment(startDate).format("MMM DD, YYYY, h:mma") ||
                    strings.selectStartDate}
                </Text>
                <ImageComponent source={arrowDown} style={styles.arrowDown} />
              </TouchableOpacity>
              <Text style={styles.startLabel}>{strings.to}</Text>
              <TouchableOpacity
                onPress={() => datePickerRef.current?.onOpenModal("end")}
                activeOpacity={0.8}
                style={styles.rowData}
              >
                <Text style={styles.startLabel}>
                  {moment(endDate).format("MMM DD, YYYY, h:mma") ||
                    strings.selectEndDate}
                </Text>
                <ImageComponent source={arrowDown} style={styles.arrowDown} />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>{strings.ticketPrice}</Text>
            <Input
              keyboardType="numeric"
              value={`$ ${price}`}
              onChangeText={onSetPrice}
            />
            <Text style={styles.label}>{strings.quantity}</Text>
            <Input
              keyboardType="numeric"
              value={`${ticketquantity}`}
              onChangeText={onSetQuantity}
            />
            <SizedBox height={verticalScale(25)} />
            <ButtonComponent
              onPress={onCreateTicket}
              icon={save}
              title={strings.save}
              disabled={checkValidation()}
            />
          </View>
        </TouchableOpacity>
        <DateRangePicker
          selectStartDate={setStartDate}
          selectEndDate={setEndDate}
          ref={datePickerRef}
        />
      </ModalComponent>
    </View>
  );
};

export const AddTicketModal = forwardRef(AddTicketModalComp);
