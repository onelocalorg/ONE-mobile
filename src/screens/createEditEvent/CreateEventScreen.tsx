import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import { EventMutations } from "~/network/api/services/useEventService";
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

  const { mutate: createEvent } = useMutation<
    LocalEvent,
    Error,
    LocalEventData
  >({
    mutationKey: [EventMutations.createEvent],
    onSuccess: () => {
      navigation.goBack();
    },
  });

  return (
    <ScrollView>
      <View style={styles.eventClass}>
        <EventEditor
          onSubmitCreate={(eventData) => createEvent({ ...eventData, groupId })}
          isLoading={false}
        />
      </View>
    </ScrollView>
  );
};
