import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Loader } from "~/components/loader";
import { ShortModal } from "~/components/ShortModal";
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

  return (
    <ShortModal height={isPending && !!paymentId ? 100 : 400}>
      {(!paymentId || payout) && (
        <AddEditPayout
          eventId={eventId}
          payout={payout}
          onClose={navigation.goBack}
        />
      )}
      <Loader showOverlay={true} visible={isPending && !!paymentId} />
    </ShortModal>
  );
};
