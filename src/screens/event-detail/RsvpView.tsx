import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { startImg } from "~/assets/images";
import Going from "~/assets/images/going.png";
import { useMyUserId } from "~/navigation/AuthContext";
import { useEventService } from "~/network/api/services/useEventService";
import { LocalEvent } from "~/types/local-event";
import { RsvpType } from "~/types/rsvp";
import { handleApiError } from "~/utils/common";
import { createStyleSheet as createRsvpStyleSheet } from "./rsvp-style";
import { createStyleSheet as createBaseStyleSheet } from "./style";

interface RsvpViewProps {
  event: LocalEvent;
}

export const RsvpView = ({ event }: RsvpViewProps) => {
  const { theme } = useAppTheme();
  const styles = createBaseStyleSheet(theme);
  const styles1 = createRsvpStyleSheet(theme);
  const myUserId = useMyUserId();
  const { gotoUserProfile } = useNavigations();

  const [selectedButton, setSelectedButton] = useState<RsvpType>();

  const {
    queries: { rsvpsForEvent },
    mutations: { createRsvp },
  } = useEventService();

  const { isError, data: rsvpList, error } = useQuery(rsvpsForEvent(event.id));
  if (isError) handleApiError("RSVP", error);

  console.log("rsvpList", rsvpList);

  const mutateCreateRsvp = useMutation(createRsvp);

  // const findItemById = () => {
  //   const foundItem = rsvpList?.rsvps.find(
  //     (item) => item.guest.id === myUserId
  //   );
  //   if (foundItem) {
  //     setSelectedButton(foundItem.rsvp);
  //   } else {
  //     setSelectedButton(undefined);
  //   }
  // };

  // const addGoingRsvp = () => {
  //   if (
  //     rsvpList?.rsvps.find((r) => r.guest.id === myUserId)?.rsvp !==
  //     RsvpType.GOING
  //   ) {
  //     void updateRsvp(eventId, RsvpType.GOING)
  //       .then(fetchRsvpData)
  //       .catch(handleApiError("RSVP"));
  //   }
  // };

  // Check if the logged-in user's ID is available in RSVP data
  const isCurrentUserRSVP = (type: RsvpType) => {
    if (rsvpList) {
      const currentUserRSVP = rsvpList.rsvps.find(
        (rsvp) => rsvp.guest.id === myUserId
      );
      return currentUserRSVP && currentUserRSVP.type === type;
    }
    return false;
  };

  const changeRsvp = (type: RsvpType) => {
    mutateCreateRsvp.mutate({
      type: selectedButton === type ? RsvpType.CANT_GO : type,
      eventId: event.id,
    });

    setSelectedButton(type === selectedButton ? undefined : type);
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
          onPress={() => changeRsvp(RsvpType.GOING)}
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
          onPress={() => changeRsvp(RsvpType.INTERESTED)}
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
              {rsvpList?.going}
            </Text>
            <Text style={{ fontSize: 16, color: "black", fontWeight: "600" }}>
              Going
            </Text>
          </View>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: "black", fontWeight: "600" }}>
              {rsvpList?.interested}
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
        {rsvpList ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              gap: 5,
              width: "100%",
            }}
          >
            {rsvpList?.rsvps.map((rsvp, index) => (
              <View key={index} style={styles1.rsvpContainer}>
                <Pressable onPress={() => gotoUserProfile(rsvp.guest)}>
                  <View style={styles1.profilePicContainer}>
                    <Image
                      source={{ uri: rsvp.guest.pic }}
                      style={styles1.profilePic}
                    />
                  </View>
                </Pressable>
                <View style={styles1.rsvpImageContainer}>
                  {rsvp.type === RsvpType.GOING && (
                    <Image source={Going} style={styles1.rsvpImage} />
                  )}
                  {rsvp.type === RsvpType.INTERESTED && (
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
