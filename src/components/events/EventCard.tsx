import _ from "lodash/fp";
import { MapPin } from "lucide-react-native";
import { DateTime } from "luxon";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { Grid, GridItem } from "~/components/ui/grid";
import { Heading } from "~/components/ui/heading";
import { HStack } from "~/components/ui/hstack";
import { Icon } from "~/components/ui/icon";
import { Image } from "~/components/ui/image";
import { Text } from "~/components/ui/text";
import { VStack } from "~/components/ui/vstack";
import { LocalEvent } from "~/types/local-event";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
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
      <Grid
        _extra={{
          className: "grid-cols-4",
        }}
      >
        <GridItem
          _extra={{
            className: "col-span-4",
          }}
        >
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
              <Heading size="md" isTruncated={true}>
                {event.group.name}
              </Heading>
            </HStack>
          )}
        </GridItem>
        {event.images.length > 0 && (
          <GridItem
            _extra={{
              className: "col-span-1",
            }}
          >
            <Image
              className="rounded-lg"
              size="md"
              source={{
                uri: _.head(event.images)?.url,
              }}
              alt={event.name}
            />
          </GridItem>
        )}
        <GridItem
          _extra={{
            className: event.images.length > 0 ? "col-span-3" : "col-span-4",
          }}
        >
          <VStack className="mx-2 shrink">
            <Text size="md" className="pb-0">
              {event.startDate.toLocaleString(DateTime.DATE_MED)}
              {" • "}
              {event.startDate.toLocaleString(DateTime.TIME_SIMPLE)}
            </Text>
            <Text bold={true} size="lg" className="py-1" isTruncated={true}>
              {event.name}
            </Text>
            <HStack>
              <Icon as={MapPin} />
              <Text className="pl-1" size="xs" isTruncated={true}>
                {event.venue || event.address?.split(",")[0]}
              </Text>
            </HStack>
          </VStack>
        </GridItem>
        {/* <GridItem
          _extra={{
            className: "col-span-1",
          }}
        >
          <VStack>
            <ImageComponent source={eventIcon} />
            {event.cancelDate ? (
              <Text style={styles.cancelText}>CANCELED</Text>
            ) : null}
          </VStack>
        </GridItem> */}
      </Grid>
      {/* </VStack> */}
    </TouchableOpacity>
  );
};
