import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { startImg } from "~/assets/images";
import Going from "~/assets/images/going.png";
import { updateRsvp } from "~/network/api/services/event-service";
import { persistKeys } from "~/network/constant";
import { LocalEvent } from "~/types/local-event";
import { OneUser } from "~/types/one-user";
import { RsvpList, RsvpType } from "~/types/rsvp";
import { handleApiError } from "~/utils/common";
import { createStyleSheet as createRsvpStyleSheet } from "./rsvp-style";
import { createStyleSheet as createBaseStyleSheet } from "./style";

interface RsvpViewProps {
  event: LocalEvent;
  rsvpData: RsvpList;
  onUserPressed?: (user: OneUser) => void;
  onRsvpsChanged: () => void;
}

export const RsvpView = ({
  event,
  rsvpData,
  onUserPressed,
  onRsvpsChanged,
}: RsvpViewProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createBaseStyleSheet(theme);
  const styles1 = createRsvpStyleSheet(theme);

  const [selectedButton, setSelectedButton] = useState<RsvpType>();
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    findItemById();
    AsyncStorage.getItem(persistKeys.userProfileId).then((id) =>
      setUserId(id ? id : undefined)
    );
  }, [rsvpData]);

  const findItemById = () => {
    const foundItem = rsvpData.rsvps.find((item) => item.guest.id === userId);
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
        (rsvp) => rsvp.guest.id === userId
      );
      return currentUserRSVP && currentUserRSVP.rsvp === type;
    }
    return false;
  };

  const rsvpsFilter = async (type: RsvpType) => {
    setSelectedButton(type === selectedButton ? undefined : type);

    try {
      await updateRsvp(event.id, type);
      onRsvpsChanged();
      Toast.show("RSVP updated", Toast.LONG, {
        backgroundColor: "black",
      });
    } catch (e) {
      handleApiError("Error updating RSVP", e);
    }
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
                <Pressable onPress={() => onUserPressed?.(rsvp.guest)}>
                  <View style={styles1.profilePicContainer}>
                    <Image
                      source={{ uri: rsvp.guest.pic }}
                      style={styles1.profilePic}
                    />
                  </View>
                </Pressable>
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
