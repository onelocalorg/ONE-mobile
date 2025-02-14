import { useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import React, { useEffect, useState } from "react";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import CurrencyInput from "react-native-currency-input";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { save } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { Input } from "~/components/input";
import { SizedBox } from "~/components/sized-box";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "~/components/ui/actionsheet";
import { Button, ButtonSpinner, ButtonText } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { CloseIcon, Icon } from "~/components/ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "~/components/ui/modal";
import { useSubscriptionService } from "~/network/api/services/useSubscriptionService";
import { verticalScale } from "~/theme/device/normalize";
import { TicketTypeData } from "~/types/ticket-type-data";
import { SubscriptionPlans } from "../myprofile/SubscriptionPlans";
import { createStyleSheet } from "./style";

interface AddTicketModalProps {
  value?: TicketTypeData;
  isVisible: boolean;

  onSuccess: (ticketDetails: TicketTypeData) => void;
  onDismiss?: () => void;
}

export const AddTicketModal = ({
  value,
  isVisible,
  onSuccess,
  onDismiss,
}: AddTicketModalProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);

  const [showSubscriptions, setShowSubscriptions] = React.useState(false);
  const handleClose = () => setShowSubscriptions(false);

  const {
    queries: { subscriptions: getSubscriptions },
  } = useSubscriptionService();
  const { data: subscriptions, isPending: isSubscriptionsLoading } = useQuery(
    getSubscriptions()
  );

  const [name, setName] = useState(value ? value.name : "");
  const [price, setPrice] = useState(value?.price ?? 0);
  const [quantity, setQuantity] = useState(value?.quantity || undefined);

  useEffect(() => {
    if (value) {
      setName(value.name);
      setPrice(value.price);
      setQuantity(value.quantity);
    }
  }, [value]);

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

  const createTicketType = (): TicketTypeData => ({
    name,
    price: price ?? 0,
    quantity: quantity ?? undefined,
  });

  return (
    <>
      <Modal
        isOpen={isVisible}
        onClose={() => {
          resetState();
          onDismiss?.();
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Create ticket offers</Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <Text style={styles.label}>{strings.ticketName}</Text>
              <Input value={name} onChangeText={setName} />
              <Text style={styles.label}>{strings.ticketPrice}</Text>
              {!_.isEmpty(subscriptions) ? (
                <CurrencyInput
                  style={styles.inputStyle}
                  value={(price ?? 0) / 100}
                  onChangeValue={(v) => setPrice((v ?? 0) * 100)}
                  placeholder={strings.ticketPriceFree}
                  prefix="$"
                  separator="."
                  delimiter=","
                />
              ) : (
                <Button
                  variant="solid"
                  action="primary"
                  onPress={() => setShowSubscriptions(true)}
                >
                  {isSubscriptionsLoading && <ButtonSpinner />}
                  <ButtonText>Free or tap to upgrade</ButtonText>
                </Button>
              )}
              <Text style={styles.label}>{strings.ticketQuantity}</Text>
              <Input
                keyboardType="numeric"
                value={quantity?.toString()}
                onChangeText={(v) => setQuantity(parseInt(v || "0"))}
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
                  title={strings.cancel}
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
          </TouchableWithoutFeedback>
          {/* </TouchableOpacity> */}
          {/* <DateRangePicker
          selectStartDate={setStartDate}
          selectEndDate={setEndDate}
          ref={datePickerRef}
        /> */}
        </ModalContent>
      </Modal>
      <Actionsheet isOpen={showSubscriptions} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <SubscriptionPlans onClose={handleClose} />
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

// export const AddTicketModal = forwardRef(AddTicketModalRef);
