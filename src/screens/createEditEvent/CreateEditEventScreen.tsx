import { useQuery } from "@tanstack/react-query";
import React from "react";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { useEventService } from "~/network/api/services/useEventService";
import { handleApiError } from "~/utils/common";
import { CreateEditEvent } from "./CreateEditEvent";

export const CreateEditEventScreen = ({
  route,
}: RootStackScreenProps<Screens.CREATE_EDIT_EVENT>) => {
  const eventId = route.params.id;

  const { getEvent } = useEventService();

  const {
    isError,
    data: event,
    error,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId),
    enabled: !!eventId,
  });
  if (isError) handleApiError("Event", error);

  return <CreateEditEvent event={event} />;
};
