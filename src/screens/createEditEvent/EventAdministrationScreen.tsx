import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import { BanknoteIcon } from "lucide-react-native";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { buttonArrowGreen, edit2, payoutClose } from "~/assets/images";
import { OneAvatar } from "~/components/avatar/OneAvatar";
import { ImageComponent } from "~/components/image-component";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { Box } from "~/components/ui/box";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "~/components/ui/button";
import { HStack } from "~/components/ui/hstack";
import {
  CheckIcon,
  ClockIcon,
  CloseCircleIcon,
  Icon,
} from "~/components/ui/icon";
import { Text as GsText } from "~/components/ui/text";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  EventMutations,
  PaymentId,
  useEventService,
} from "~/network/api/services/useEventService";
import { useUserService } from "~/network/api/services/useUserService";
import { Expense } from "~/types/expense";
import { Payout, PayoutSplit } from "~/types/payout";
import { toCurrency } from "~/utils/common";
import { createStyleSheet } from "./style";

export const EventAdministrationScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.EVENT_ADMINISTRATION>) => {
  const { eventId } = route.params;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [modalVisible, setModalVisible] = useState(false);
  const [isNeedsConfigVisible, setNeedsConfigVisible] = useState(false);
  const closeNeedsConfigAlert = () => {
    setNeedsConfigVisible(false);
  };
  const { gotoMyProfile } = useNavigations();

  const {
    queries: { me: getMe },
  } = useUserService();
  const { data: myProfile } = useQuery(getMe());

  const {
    queries: {
      detail: getEventDetail,
      financialsForEvent: getFinancials,
      expensesForEvent: getExpenses,
      payoutsForEvent: getPayouts,
    },
  } = useEventService();

  const { event, financials, expenses, payouts } = useQueries({
    queries: [
      getEventDetail(eventId),
      getFinancials(eventId),
      getExpenses(eventId),
      getPayouts(eventId),
    ],
    combine: (results) => {
      return {
        event: results[0].data,
        financials: results[1].data,
        expenses: results[2].data,
        payouts: results[3].data,
        isLoading: results.some((result) => result.isLoading),
        isPending: results.some((result) => result.isPending),
      };
    },
  });

  const { isPending: isExpensePending, mutate: sendExpense } = useMutation<
    Expense,
    Error,
    PaymentId
  >({
    mutationKey: [EventMutations.sendExpense],
  });
  const { isPending: isPayoutPending, mutate: sendPayout } = useMutation<
    Payout,
    Error,
    PaymentId
  >({
    mutationKey: [EventMutations.sendPayout],
  });

  const isPaymentPending = isExpensePending || isPayoutPending;

  const handleAddExpense = () => {
    navigation.push(Screens.ADD_EDIT_EXPENSE, { eventId });
  };

  const handleAddPayout = () => {
    navigation.push(Screens.ADD_EDIT_PAYOUT, { eventId });
  };

  const handleEditExpense = (payment: Expense) => {
    navigation.push(Screens.ADD_EDIT_EXPENSE, {
      eventId,
      paymentId: payment.id,
    });
  };

  const handleEditPayout = (payment: Payout) => {
    navigation.push(Screens.ADD_EDIT_PAYOUT, {
      eventId,
      paymentId: payment.id,
    });
  };

  const sendPayoutModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const sendPayoutsConfirm = () => {
    setModalVisible(false);

    expenses
      ?.filter((p) => p.status === "new")
      .forEach((expense) => {
        sendExpense({ id: expense.id, eventId });
      });

    payouts
      ?.filter((p) => p.status === "new")
      .forEach((payout) => {
        sendPayout({ id: payout.id, eventId });
      });
  };

  const isNewPaymentsRemaining = () =>
    _.some((p) => p.status === "new", payouts) ||
    _.some((e) => e.status === "new", expenses);

  const paymentIcon = (payment: Payout | Expense) => {
    let icon;
    switch (payment.status) {
      case "complete":
        icon = CheckIcon;
        break;
      case "pending":
      case "waiting":
        icon = ClockIcon;
        break;
      case "failed":
        icon = CloseCircleIcon;
        break;
    }
    return icon;
  };

  return (
    <>
      <ScrollView>
        {financials && (
          <View style={styles.eventContainerTwo}>
            <View style={styles.eventListCont}>
              <Text style={styles.financialCont}>Financials</Text>

              <View style={styles.revenueCont}>
                <Text style={styles.revenueLbl}>Revenue</Text>
                <Text style={styles.revenueRuppes}>
                  {toCurrency(financials.revenueTotal)}
                </Text>
              </View>
              <View style={styles.revenueCont}>
                <Text style={styles.revenueLbl}>Expenses</Text>
                <Text style={styles.revenueRuppes}>
                  {toCurrency(financials.expensesTotal)}
                </Text>
              </View>
              <View style={styles.revenueCont}>
                <Text style={styles.revenueLbl}>Profit</Text>
                <Text style={styles.revenueRuppes}>
                  {toCurrency(
                    financials.revenueTotal - financials.expensesTotal
                  )}
                </Text>
              </View>
              <View style={styles.payoutCont}>
                <Text style={styles.revenueLbl}>Payouts</Text>
                {financials.payoutsTotal !== undefined ? (
                  <Text style={styles.revenueRuppes}>
                    {toCurrency(financials.payoutsTotal)}
                  </Text>
                ) : (
                  <Text>$0</Text>
                )}
              </View>
              <View style={styles.revenueCont}>
                <Text style={styles.revenueLbl}>Remaining</Text>
                {financials.remainingTotal !== undefined ? (
                  <Text style={styles.revenueRuppes}>
                    {toCurrency(
                      financials.revenueTotal -
                        (financials.expensesTotal + financials.payoutsTotal)
                    )}
                  </Text>
                ) : (
                  <Text>$0</Text>
                )}
              </View>

              <Button
                onPress={sendPayoutModal}
                isDisabled={
                  !event ||
                  event.startDate.plus({ days: 3 }) > DateTime.now() ||
                  !isNewPaymentsRemaining() ||
                  isPaymentPending
                }
              >
                {isPaymentPending && <ButtonSpinner />}
                <ButtonIcon as={BanknoteIcon}></ButtonIcon>
                <ButtonText>Send payouts</ButtonText>
              </Button>

              <View style={styles.payOutDetailsCont}>
                <Text style={styles.payoutDetailsLbl}>
                  Payout can be sent 3 days after the event. All refunds must
                  happen within this time before a payout can be sent.
                </Text>
              </View>

              {/* {/ { <\-------------------Expenses----------------------> /} */}
              <View>
                <View style={styles.userPayoutsStatementCont}>
                  <View style={styles.subStatementcont}>
                    <Text style={styles.expenensLbl}>Expenses</Text>
                  </View>
                </View>
                {expenses && expenses.length > 0 ? (
                  expenses.map((item) => (
                    <HStack
                      key={item.id}
                      className="mx-4 items-center justify-between gap-2"
                    >
                      {item.status !== "new" ? (
                        <Icon
                          className="justify-self-end"
                          as={paymentIcon(item)}
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleEditExpense(item)}
                        >
                          <ImageComponent
                            source={edit2}
                            style={styles.editIcon}
                          />
                        </TouchableOpacity>
                      )}
                      <OneAvatar user={item.payee} size="xs" />
                      <View style={styles.userNameCont} className="grow">
                        <Text style={styles.usernameLbl}>
                          {item.payee.firstName} {item.payee.lastName}
                        </Text>
                        <Text style={styles.payoutForLbl}>
                          Expense for: {item?.description}
                        </Text>
                      </View>
                      <GsText className="justify-self-end">
                        {toCurrency(item.amount)}
                      </GsText>
                    </HStack>
                  ))
                ) : (
                  <Text>No expenses yet</Text>
                )}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={handleAddExpense}
                  style={styles.addItemCont}
                >
                  <View style={styles.subAddItemCont}>
                    <Text style={styles.plusIcon}>+</Text>
                    <Text style={styles.addItemLbl}>add item</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.borderBottom}></View>
                <View style={styles.rupeesCont}>
                  <GsText style={styles.rupeesLbl}>
                    {toCurrency(financials.expensesTotal)}
                  </GsText>
                </View>
              </View>

              {/* {/ <\-------------------Payouts----------------------> /} */}
              <View>
                <View style={styles.userPayoutsStatementCont}>
                  <View style={styles.subStatementcont}>
                    <Text style={styles.expenensLbl}>Payouts</Text>
                  </View>
                </View>
                {payouts && payouts.length > 0 ? (
                  payouts.map((item) => (
                    <HStack
                      key={item.id}
                      className="flex mx-4 items-center gap-2"
                    >
                      {item.status !== "new" ? (
                        <Icon
                          className="justify-self-end"
                          as={paymentIcon(item)}
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleEditPayout(item)}
                        >
                          <ImageComponent
                            source={edit2}
                            style={styles.editIcon}
                          />
                        </TouchableOpacity>
                      )}
                      <OneAvatar user={item.payee} size="xs" />
                      <Box className="grow">
                        <Text style={styles.usernameLbl}>
                          {item.payee.firstName} {item.payee.lastName}
                        </Text>
                        <Text style={styles.payoutForLbl}>
                          Payout for: {item?.description}
                        </Text>
                      </Box>
                      <GsText className="justify-self-end">
                        {item.split === PayoutSplit.Fixed
                          ? toCurrency(item.amount)
                          : `${item.amount}%`}
                      </GsText>
                    </HStack>
                  ))
                ) : (
                  <Text>No payouts yet</Text>
                )}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={handleAddPayout}
                  style={styles.addItemCont}
                >
                  <View style={styles.subAddItemCont}>
                    <Text style={styles.plusIcon}>+</Text>
                    <Text style={styles.addItemLbl}>add item</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.borderBottom}></View>
                <View style={styles.rupeesCont}>
                  <Text style={styles.rupeesLbl}>
                    {toCurrency(financials.payoutsTotal)}
                  </Text>
                </View>
              </View>
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.modalContainerTwo}>
                <View style={styles.modalView}>
                  <Text style={styles.sendPayoutLblTwo}>
                    Are you sure you want to send payouts?
                  </Text>
                  <Text style={styles.sendingTextLbl}>
                    (you won't be able to make changes after sending)
                  </Text>
                  <TouchableOpacity
                    onPress={sendPayoutsConfirm}
                    style={styles.payoutButtonCont}
                  >
                    <Text style={styles.sendPayoutButton}>Send Payouts</Text>
                    <ImageComponent
                      style={styles.sendIcon}
                      source={buttonArrowGreen}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.cancelButtonCont}
                  >
                    <Text style={styles.sendPayoutButton}>Cancel</Text>
                    <ImageComponent
                      style={styles.sendIcon}
                      source={payoutClose}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </ScrollView>
      <AlertDialog
        isOpen={isNeedsConfigVisible}
        onClose={closeNeedsConfigAlert}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogCloseButton />
          </AlertDialogHeader>
          <Box className="my-2">
            <Text>
              You need to configure your profile for payments before sending
              payments to others.
            </Text>
          </Box>
          <AlertDialogFooter>
            <Button size="sm" onPress={gotoMyProfile}>
              <ButtonText>OK</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
