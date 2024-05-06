import React from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { dummy } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Pill } from "~/components/pill";
import { SizedBox } from "~/components/sized-box";
import { Result } from "~/network/hooks/home-service-hooks/use-ticket-holder-checkin-list";
import { verticalScale } from "~/theme/device/normalize";
import { createStyleSheet } from "./style";

interface CheckInListProps {
  data: Result;
  onCheckInUser: (id: string) => void;
}

export const CheckInList = (props: CheckInListProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const { data, onCheckInUser } = props || {};
  const {
    ticket_name,
    isCheckedIn,
    event,
    user,
    ticket_total_price,
    _id,
    is_app_user,
  } = data || {};

  return (
    <View style={styles.listContainer}>
      <View style={styles.rowOnly}>
        <View style={styles.imageView}>
          <ImageComponent
            resizeMode="cover"
            isUrl={!!user?.pic}
            source={dummy}
            uri={user?.pic}
            style={styles.dummy}
          />
        </View>
        <View style={styles.row}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.name}>
              {is_app_user
                ? `${user?.first_name} ${user?.last_name}`
                : user?.name}
            </Text>
            <Text style={styles.name}>{`$${ticket_total_price}`}</Text>
          </View>
          <View>
            <Text numberOfLines={2} style={styles.eventName}>
              {event?.name}
            </Text>
            <Text style={styles.name}>{ticket_name}</Text>
          </View>
        </View>
      </View>
      <SizedBox height={verticalScale(2)} />
      <Pill
        disabled={isCheckedIn}
        onPressPill={() => onCheckInUser(_id)}
        backgroundColor={
          isCheckedIn ? theme.colors.darkGreen : theme.colors.lightRed
        }
        foreGroundColor={theme.colors.black}
        pillStyle={styles.pillStyle}
        label={isCheckedIn ? strings.checkedIn : strings.checkIn}
      />
    </View>
  );
};
