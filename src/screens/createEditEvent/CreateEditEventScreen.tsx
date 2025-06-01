import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { Loader } from "~/components/loader";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  EventMutations,
  useEventService,
} from "~/network/api/services/useEventService";
import {
  LocalEvent,
  LocalEventData,
  LocalEventUpdateData,
} from "~/types/local-event";
import { EventEditor } from "./EventEditor";
import { createStyleSheet } from "./style";

export const CreateEditEventScreen = ({
  route,
}: RootStackScreenProps<Screens.CREATE_EDIT_EVENT>) => {
  const eventId = route.params?.id;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const {
    queries: { detail: getEvent },
  } = useEventService();

  const { data: event, isPending, isLoading } = useQuery(getEvent(eventId));

  const mutateCreateEvent = useMutation<LocalEvent, Error, LocalEventData>({
    mutationKey: [EventMutations.createEvent],
  });
  const mutateEditEvent = useMutation<LocalEvent, Error, LocalEventUpdateData>({
    mutationKey: [EventMutations.editEvent],
  });

  return (
    <>
      <Loader visible={!!eventId && isPending} />
      <View style={styles.eventClass}>
        {!eventId || event ? (
          <EventEditor
            event={event}
            onSubmitCreate={mutateCreateEvent.mutate}
            onSubmitUpdate={mutateEditEvent.mutate}
            isLoading={isLoading}
          />
        ) : null}
      </View>
    </>
  );
};
