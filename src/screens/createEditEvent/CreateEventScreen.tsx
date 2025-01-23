import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  EventMutations,
  useEventService,
} from "~/network/api/services/useEventService";
import { LocalEvent, LocalEventData } from "~/types/local-event";
import { EventEditor } from "./EventEditor";
import { createStyleSheet } from "./style";

export const CreateEventScreen = ({
  route,
}: RootStackScreenProps<Screens.CREATE_EVENT>) => {
  const groupId = route.params?.groupId;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { queries: eventQueries } = useEventService();

  const { mutate: createEvent } = useMutation<
    LocalEvent,
    Error,
    LocalEventData
  >({
    mutationKey: [EventMutations.createEvent],
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: eventQueries.lists(),
        })
        .then(() => navigation.goBack());
    },
  });

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.eventClass}>
        <EventEditor
          onSubmitCreate={(eventData) => createEvent({ ...eventData, groupId })}
          isLoading={false}
        />
      </View>
    </ScrollView>
  );
};
