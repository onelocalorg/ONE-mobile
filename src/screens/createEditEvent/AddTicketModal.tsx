import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { save } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { Input } from "~/components/input";
import { OneModal } from "~/components/modal-component/OneModal";
import { SizedBox } from "~/components/sized-box";
import { LOG } from "~/config";
import { verticalScale } from "~/theme/device/normalize";
import { TicketTypeData } from "~/types/ticket-type-data";
import { createStyleSheet } from "./style";

interface AddTicketModalProps {
  // eventDetails: EventData;
  // eventId: string;
  value?: TicketTypeData;
  isVisible: boolean;
  // isEdit?: boolean;

  onSuccess: (ticketDetails: TicketTypeData) => void;
  onDismiss?: () => void;
}

export const AddTicketModal = ({
  value,
  // isEdit,
  isVisible,
  onSuccess,
  onDismiss,
}: AddTicketModalProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  // const datePickerRef: React.Ref<DatePickerRefProps> = useRef(null);
  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());
  const [name, setName] = useState(value ? value.name : "");
  const [price, setPrice] = useState(value?.price ?? 0);
  const [quantity, setQuantity] = useState(value?.quantity || undefined);

  useEffect(() => {
    LOG.debug("AddTicketModal", value);

    if (value) {
      setName(value.name);
      setPrice(value.price);
      setQuantity(value.quantity);
    }
  }, [value]);

  // const { mutateAsync, isLoading } = useCreateTicket();
  // const { mutateAsync: editTicket, isLoading: editTicketLoading } =
  //   useEditTicket();

  // useFocusEffect(
  //   useCallback(() => {
  //     if (ticketData && isEdit) {
  //       // setEndDate(new Date(ticketData?.end_date));
  //       // setStartDate(new Date(ticketData?.start_date));
  //       setPrice(ticketData.price);
  //       setTicketName(ticketData.name);
  //       totalTicketQuantity(ticketData.quantity);
  //     }
  //   }, [ticketData, isEdit])
  // );

  // const onSetPrice = (text: string) => {
  //   setPrice(Big(text));
  // };

  // const onCreateTicket = async () => {
  //   const request = {
  //     name: ticketName,
  //     // start_date: new Date(startDate).toISOString(),
  //     // end_date: new Date(endDate).toISOString(),
  //     price: price ? price.toString() : undefined,
  //     // event: eventId,
  //     quantity: ticketQuantity,
  //   };
  //   let res;
  //   if (isEdit) {
  //     res = await editTicket({ bodyParams: request, ticketId: ticketData?.id });
  //   } else {
  //     res = await mutateAsync({ bodyParams: request });
  //   }

  //   if (res?.success) {
  //     resetState();
  //     onSuccessfulTicketCreation?.(res?.data);
  //   }
  // };

  const isValid = () => {
    return name;
  };

  const resetState = () => {
    // setStartDate(new Date());
    // setEndDate(new Date());
    setPrice(0);
    setName("");
    setQuantity(undefined);
  };

  // const keyboardDismiss = () => {
  //   Keyboard.dismiss();
  // };

  const createTicketType = (): TicketTypeData => ({
    name,
    price,
    quantity: quantity ? quantity : undefined,
  });

  return (
    <View>
      <OneModal
        isVisible={isVisible}
        onDismiss={() => {
          resetState();
          onDismiss?.();
        }}
      >
        {/* {isEdit === false ? (
          <Text style={styles.ticketTitle}>{strings.ticketAdd}</Text>
        ) : (
          <Text style={styles.ticketTitle}>{strings.ticketEdit}</Text>
        )} */}

        {/* <TouchableOpacity activeOpacity={1} onPress={keyboardDismiss}> */}
        <View style={styles.modalContainer}>
          {/* <EventList data={eventDetails} /> */}
          <Text style={styles.label}>{strings.ticketName}</Text>
          <Input value={name} onChangeText={setName} />
          {/* <Text style={styles.label}>{strings.ticketTimeframe}</Text>
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
            </View> */}
          <Text style={styles.label}>{strings.ticketPrice}</Text>
          <TextInput
            value={price ? price.toString() : "Free"}
            onChangeText={(v) => setPrice(Number.parseFloat(v))}
            placeholder={strings.ticketPriceFree}
            editable={false}
            onPressIn={() => {
              Alert.alert("Only free tickets allowed in this release");
            }}
          />
          <Text style={styles.label}>{strings.ticketQuantity}</Text>
          <Input
            keyboardType="numeric"
            value={quantity?.toString()}
            onChangeText={(v) => setQuantity(parseInt(v))}
            placeholder={strings.ticketsUnlimited}
          />
          <SizedBox height={verticalScale(25)} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <ButtonComponent
              onPress={() => {
                resetState();
                onDismiss?.();
              }}
              title={strings.cancle}
            />
            <ButtonComponent
              onPress={() => {
                resetState();
                onSuccess(createTicketType());
              }}
              icon={save}
              title={strings.ok}
              disabled={!isValid()}
            />
          </View>
        </View>
        {/* </TouchableOpacity> */}
        {/* <DateRangePicker
          selectStartDate={setStartDate}
          selectEndDate={setEndDate}
          ref={datePickerRef}
        /> */}
      </OneModal>
    </View>
  );
};

// export const AddTicketModal = forwardRef(AddTicketModalRef);
