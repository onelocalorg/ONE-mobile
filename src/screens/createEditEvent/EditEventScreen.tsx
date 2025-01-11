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
import { LocalEvent, LocalEventUpdateData } from "~/types/local-event";
import { EventEditor } from "./EventEditor";
import { createStyleSheet } from "./style";

export const EditEventScreen = ({
  route,
}: RootStackScreenProps<Screens.EDIT_EVENT>) => {
  const eventId = route.params.id;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const {
    queries: { detail: getEvent },
  } = useEventService();

  const { data: event, isPending, isLoading } = useQuery(getEvent(eventId));

  const { mutate: editEvent } = useMutation<
    LocalEvent,
    Error,
    LocalEventUpdateData
  >({
    mutationKey: [EventMutations.editEvent],
  });

  return (
    <>
      <Loader visible={!!eventId && isPending} />
      <View style={styles.eventClass}>
        {!eventId || event ? (
          <EventEditor
            event={event}
            onSubmitUpdate={editEvent}
            isLoading={isLoading}
          />
        ) : null}
      </View>
    </>
  );
};
