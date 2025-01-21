import React, { useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { LOG } from "~/config";
import { width } from "~/theme/device/device";

interface LocationAutocompleteProps {
  placeholder: string;
  address?: string;
  onPress: (data: GooglePlaceData, details: GooglePlaceDetail | null) => void;
}
export const LocationAutocomplete = ({
  address,
  placeholder,
  onPress,
}: LocationAutocompleteProps) => {
  const { theme } = useAppTheme();

  const ref = useRef<GooglePlacesAutocompleteRef>(null);

  useEffect(() => {
    ref.current?.setAddressText(address ?? "");
  }, [address]);

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      scrollEnabled={false}
      keyboardShouldPersistTaps="handled"
    >
      <GooglePlacesAutocomplete
        ref={ref}
        styles={{
          container: {
            flex: 1,
            flexDirection: "column",
            zIndex: 10000000,
          },
          textInput: {
            backgroundColor: "#E8E8E8",
            height: 35,
            borderRadius: 10,
            color: "black",
            fontSize: 14,
            borderColor: theme.colors.black,
            borderWidth: theme.borderWidth.borderWidth1,
          },
          // listView: {
          //   color: "black", //To see where exactly the list is
          // zIndex: 10000000, //To popover the component outwards
          //   // position: 'absolute',
          //   // top: 45
          // },
          row: {
            backgroundColor: "white",
            zIndex: 10000000, //To popover the component outwards
            width,
          },
          predefinedPlacesDescription: {
            color: "black",
          },
          description: {
            color: "black",
            fontSize: 14,
          },
        }}
        keyboardShouldPersistTaps="handled"
        disableScroll={true}
        listViewDisplayed={false}
        textInputProps={{
          placeholderTextColor: "gray",
        }}
        placeholder={placeholder}
        GooglePlacesDetailsQuery={{ fields: "geometry" }}
        fetchDetails={true}
        onPress={(data, details) => {
          LOG.debug("GooglePlacesAutocomplete", details?.geometry.location);

          onPress(data, details);
        }}
        query={{
          key: process.env.GOOGLE_API_KEY, // client
          language: "en",
        }}
        currentLocationLabel="Current location"
      />
    </ScrollView>
  );
};
