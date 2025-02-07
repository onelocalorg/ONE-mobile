import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Loader } from "~/components/loader";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "~/components/ui/actionsheet";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { useEventService } from "~/network/api/services/useEventService";
import { AddEditPayout } from "./AddEditPayout";

export const AddEditPayoutScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.ADD_EDIT_PAYOUT>) => {
  const { eventId, paymentId } = route.params;

  const {
    queries: { payoutDetail },
  } = useEventService();

  const { data: payout, isPending } = useQuery({
    ...payoutDetail({ eventId, id: paymentId! }),
    enabled: !!paymentId,
  });

  const handleOnClose = () => {
    navigation.goBack();
  };

  return (
    <Actionsheet defaultIsOpen={true} onClose={handleOnClose} snapPoints={[50]}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        {(!paymentId || payout) && (
          <AddEditPayout
            eventId={eventId}
            payout={payout}
            onClose={navigation.goBack}
          />
        )}
        <Loader showOverlay={true} visible={isPending && !!paymentId} />
      </ActionsheetContent>
    </Actionsheet>
  );
};
