import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { LOG } from "~/config";

interface LocationAutocompleteProps {
  children: string;
  onPress: (data: any, details: any) => void;
}

export const LocationAutocomplete = ({
  children,
  onPress,
}: LocationAutocompleteProps) => {
  const { theme } = useAppTheme();

  return (
    <GooglePlacesAutocomplete
      styles={{
        textInput: {
          backgroundColor: "#E8E8E8",
          height: 35,
          borderRadius: 10,
          color: "black",
          fontSize: 14,
          borderColor: theme.colors.black,
          borderWidth: theme.borderWidth.borderWidth1,
          placeholderTextColor: theme.colors.black,
        },
        listView: {
          color: "black", //To see where exactly the list is
          zIndex: 10000000, //To popover the component outwards
          // position: 'absolute',
          // top: 45
        },
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
      placeholder={children}
      GooglePlacesDetailsQuery={{ fields: "geometry" }}
      fetchDetails={true}
      onPress={(data: any, details) => {
        LOG.debug("GooglePlacesAutocomplete", details?.geometry.location);

        onPress(data, details);
      }}
      query={{
        key: process.env.GOOGLE_API_KEY, // client
        language: "en",
      }}
      currentLocationLabel="Current location"
    />
  );
};
