import _ from "lodash/fp";
import { MapPin } from "lucide-react-native";
import { DateTime } from "luxon";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { event as eventIcon } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { LocalEvent } from "~/types/local-event";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Image } from "../ui/image";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { createStyleSheet } from "./style";

interface EventCardProps {
  event: LocalEvent;
  disabled?: boolean;
  style?: any;
}

export const EventCard = ({
  event,
  disabled = false,
  style,
}: EventCardProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { gotoEventDetails } = useNavigations();

  return (
    <TouchableOpacity
      style={style ?? styles.listContainer}
      onPress={gotoEventDetails(event)}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <VStack>
        {event.group && (
          <HStack className="mb-2">
            {event.group.images?.length > 0 && (
              <Avatar size="sm" className="mr-2">
                <AvatarFallbackText>{event.group.name}</AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: _.head(event.group.images)?.url,
                  }}
                />
              </Avatar>
            )}
            <Text>{event.group.name}</Text>
          </HStack>
        )}
        <HStack>
          <Image
            className="rounded-lg"
            size="md"
            source={{
              uri: _.head(event.images)?.url,
            }}
            alt={event.name}
          />
          <VStack className="mx-2 shrink">
            <Text size="md" className="pb-0">
              {event.startDate.toLocaleString(DateTime.DATE_MED)}
              {" • "}
              {event.startDate.toLocaleString(DateTime.TIME_SIMPLE)}
            </Text>
            <Text bold={true} size="lg" className="py-1">
              {event.name}
            </Text>
            <HStack>
              <Icon as={MapPin} />
              <Text size="xs" isTruncated={true}>
                {event.venue || event.address?.split(",")[0]}
              </Text>
            </HStack>
          </VStack>
          <VStack>
            <ImageComponent source={eventIcon} />
            {event.cancelDate ? (
              <Text style={styles.cancelText}>CANCELED</Text>
            ) : null}
          </VStack>
        </HStack>
      </VStack>
    </TouchableOpacity>
  );
};
