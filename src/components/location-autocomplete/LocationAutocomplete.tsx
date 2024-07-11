import { useEffect, useRef } from "react";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { LOG } from "~/config";

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
    <>
      <GooglePlacesAutocomplete
        ref={ref}
        styles={{
          container: {
            flex: 1,
            flexDirection: "column",
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
          //   zIndex: 10000000, //To popover the component outwards
          //   // position: 'absolute',
          //   // top: 45
          // },
          predefinedPlacesDescription: {
            color: "black",
          },
          description: {
            color: "black",
            fontSize: 14,
          },
        }}
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
    </>
  );
};
