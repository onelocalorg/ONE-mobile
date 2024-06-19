import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { Loader } from "~/components/loader";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { useEventService } from "~/network/api/services/useEventService";
import { EventEditor } from "./EventEditor";

export const CreateEditEventScreen = ({
  route,
}: RootStackScreenProps<Screens.CREATE_EDIT_EVENT>) => {
  const eventId = route.params?.id;

  const {
    queries: { detail: getEvent },
    mutations: { createEvent, editEvent },
  } = useEventService();

  const { data: event, isPending, isLoading } = useQuery(getEvent(eventId));

  const mutateCreateEvent = useMutation(createEvent);
  const mutateEditEvent = useMutation(editEvent);

  return (
    <>
      <Loader visible={!!eventId && isPending} />
      {!eventId || event ? (
        <EventEditor
          event={event}
          onSubmitCreate={mutateCreateEvent.mutate}
          onSubmitUpdate={mutateEditEvent.mutate}
          isLoading={isLoading}
        />
      ) : null}
    </>
  );
};
