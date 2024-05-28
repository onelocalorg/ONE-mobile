import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-simple-toast";
import { useSelector } from "react-redux";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { startImg } from "~/assets/images";
import Going from "~/assets/images/going.png";
import { updateRsvp } from "~/network/api/services/event-service";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { LocalEvent } from "~/types/local-event";
import { RsvpList, RsvpType } from "~/types/rsvp";
import { createStyleSheet as createRsvpStyleSheet } from "./rsvp-style";
import { createStyleSheet as createBaseStyleSheet } from "./style";
``;
interface RsvpProps {
  event: LocalEvent;
  rsvpData: RsvpList;
  onRsvpsChanged: () => void;
}

export const Rsvp = ({ event, rsvpData, onRsvpsChanged }: RsvpProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createBaseStyleSheet(theme);
  const styles1 = createRsvpStyleSheet(theme);
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { stripeCustomerId: string; user_type: string; id: string } };

  const [selectedButton, setSelectedButton] = useState<RsvpType>();

  useEffect(() => {
    findItemById();
  }, [rsvpData]);

  const findItemById = () => {
    const foundItem = rsvpData.rsvps.find((item) => item.guest.id === user?.id);
    if (foundItem) {
      setSelectedButton(foundItem.rsvp);
    } else {
      setSelectedButton(undefined);
    }
  };

  // Check if the logged-in user's ID is available in RSVP data
  const isCurrentUserRSVP = (type: RsvpType) => {
    if (rsvpData) {
      const currentUserRSVP = rsvpData.rsvps.find(
        (rsvp) => rsvp.guest.id === user?.id
      );
      return currentUserRSVP && currentUserRSVP.rsvp === type;
    }
    return false;
  };

  const rsvpsFilter = async (type: RsvpType) => {
    setSelectedButton(type === selectedButton ? undefined : type);

    const resp = await updateRsvp(event.id, type);
    onRsvpsChanged();
    Toast.show(resp.message, Toast.LONG, {
      backgroundColor: "black",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles1.container2}>
        <TouchableOpacity
          style={[
            styles1.button,
            selectedButton === RsvpType.GOING && styles1.selectedButton,
            isCurrentUserRSVP(RsvpType.GOING) && { backgroundColor: "#E9B9B4" },
          ]}
          onPress={() => rsvpsFilter(RsvpType.GOING)}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text style={styles1.buttonText}>Going</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles1.button,
            selectedButton === RsvpType.INTERESTED && styles1.selectedButton,
            isCurrentUserRSVP(RsvpType.INTERESTED) && {
              backgroundColor: "#E9B9B4",
            },
          ]}
          onPress={() => rsvpsFilter(RsvpType.INTERESTED)}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text style={styles1.buttonText}>Maybe</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: "5%",
          justifyContent: "space-between",
          gap: 100,
        }}
      >
        <Text style={{ fontSize: 20, color: "black", fontWeight: "600" }}>
          RSVPs
        </Text>

        <View style={{ flexDirection: "row", columnGap: 20 }}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: "black", fontWeight: "600" }}>
              {rsvpData?.going}
            </Text>
            <Text style={{ fontSize: 16, color: "black", fontWeight: "600" }}>
              Going
            </Text>
          </View>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: "black", fontWeight: "600" }}>
              {rsvpData?.interested}
            </Text>
            <Text style={{ fontSize: 16, color: "black", fontWeight: "600" }}>
              Maybe
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "flex-start",
          marginTop: "8%",
          width: "100%",
        }}
      >
        {rsvpData ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              gap: 5,
              width: "100%",
            }}
          >
            {rsvpData?.rsvps.map((rsvp, index) => (
              <View key={index} style={styles1.rsvpContainer}>
                <View style={styles1.profilePicContainer}>
                  <Image
                    source={{ uri: rsvp.guest.pic }}
                    style={styles1.profilePic}
                  />
                </View>
                <View style={styles1.rsvpImageContainer}>
                  {rsvp.rsvp === "going" && (
                    <Image source={Going} style={styles1.rsvpImage} />
                  )}
                  {rsvp.rsvp === "interested" && (
                    <Image source={startImg} style={styles1.rsvpImage} />
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text>No RSVP data available</Text>
        )}
      </View>
    </View>
  );
};
