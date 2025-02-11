import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import _ from "lodash/fp";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "~/components/ui/actionsheet";
import { Box } from "~/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { HStack } from "~/components/ui/hstack";
import { Text } from "~/components/ui/text";
import { VStack } from "~/components/ui/vstack";
import {
  SubscriptionMutations,
  useSubscriptionService,
} from "~/network/api/services/useSubscriptionService";
import { StripePaymentInfo } from "~/types/stripe-payment-info";
import { StripeCheckout } from "../event-detail/StripeCheckout";
import { createStyleSheet } from "./style";

interface SubscriptionPlansProps {
  onClose: () => void;
}
export const SubscriptionPlans = ({ onClose }: SubscriptionPlansProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const [isMonthlySelected, setMonthlySelected] = useState(false);
  const [isYearlySelected, setYearlySelected] = useState(false);
  const [isCheckoutVisible, setCheckoutVisible] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<StripePaymentInfo>();
  const queryClient = useQueryClient();

  const {
    queries,
    queries: { plans: listPlans, subscriptions: listSubscriptions },
  } = useSubscriptionService();
  const { plans, subscriptions } = useQueries({
    queries: [listPlans(), listSubscriptions()],
    combine: (results) => ({
      plans: results[0].data,
      subscriptions: results[1].data,
    }),
  });

  const hostPlan = plans?.find((p) => p.metadata.type === "host");

  const monthlyPlan = hostPlan?.prices.find(
    (p) => p.recurring.interval === "month"
  );
  const yearlyPlan = hostPlan?.prices.find(
    (p) => p.recurring.interval === "year"
  );
  const selectedPlan = isMonthlySelected
    ? monthlyPlan
    : isYearlySelected
    ? yearlyPlan
    : undefined;

  const { mutate: subscribe, isPending: isSubscribePending } = useMutation<
    StripePaymentInfo,
    Error,
    string
  >({
    mutationKey: [SubscriptionMutations.subscribe],
  });

  const toggleMonthlyPlan = () => {
    const isSelected = isMonthlySelected;
    setMonthlySelected(!isSelected);
    if (!isSelected) {
      setYearlySelected(false);
    }
  };

  const toggleYearlyPlan = () => {
    const isSelected = isYearlySelected;
    setYearlySelected(!isSelected);
    if (!isSelected) {
      setMonthlySelected(false);
    }
  };

  const createSubscription = () => {
    void subscribe(selectedPlan!.id, {
      onSuccess(data) {
        setPaymentInfo(data);
        setCheckoutVisible(true);
      },
    });
  };

  const closeCheckout = () => setCheckoutVisible(false);

  const handleCheckoutComplete = () => {
    closeCheckout();
    onClose();
    void queryClient.invalidateQueries({ queryKey: queries.subscriptions });
  };

  const isPurchasable = () =>
    _.isEmpty(subscriptions) && (isMonthlySelected || isYearlySelected);

  return (
    <>
      <Actionsheet defaultIsOpen={true} onClose={onClose} snapPoints={[45]}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {hostPlan && (
            <>
              <Heading className="mt-4 text-center" size="2xl">
                {`${hostPlan.name} ${strings.membership}`}
              </Heading>

              <VStack>
                <HStack className="my-4 gap-4">
                  {monthlyPlan && (
                    <Card variant={isMonthlySelected ? "filled" : "outline"}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        //   style={[
                        //     styles.selectView,
                        //     me?.billingInterval === "monthly" &&
                        //       styles.selectedSelectView,
                        //   ]}
                        onPress={toggleMonthlyPlan}
                      >
                        <Heading size="4xl">
                          ${Math.round(monthlyPlan.unit_amount / 100)}
                        </Heading>

                        <Text className="text-center">{`per ${monthlyPlan.recurring.interval}`}</Text>
                      </TouchableOpacity>
                    </Card>
                  )}

                  {yearlyPlan && (
                    <Card variant={isYearlySelected ? "filled" : "outline"}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        //   style={[
                        //     styles.selectView,
                        //     me?.billingInterval === "yearly" &&
                        //       styles.selectedSelectView,
                        //   ]}
                        onPress={toggleYearlyPlan}
                      >
                        <Heading size="4xl">
                          ${Math.round(yearlyPlan.unit_amount / 100)}
                        </Heading>

                        <Text className="text-center">{`per ${yearlyPlan.recurring.interval}`}</Text>
                      </TouchableOpacity>
                    </Card>
                  )}
                </HStack>

                <Button
                  isDisabled={!isPurchasable()}
                  onPress={createSubscription}
                >
                  {isSubscribePending && <ButtonSpinner />}
                  <ButtonText>{strings.purchase}</ButtonText>
                </Button>
              </VStack>
            </>
          )}
        </ActionsheetContent>
      </Actionsheet>
      {paymentInfo && (
        <StripeCheckout
          paymentInfo={paymentInfo}
          isOpen={isCheckoutVisible}
          onCancel={closeCheckout}
          onCheckoutComplete={handleCheckoutComplete}
        >
          <Box className="m-6">
            <Text>{`You will be charged $${
              selectedPlan!.unit_amount / 100
            } per ${selectedPlan?.recurring.interval}.`}</Text>
          </Box>
        </StripeCheckout>
      )}
    </>
  );
};
