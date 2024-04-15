import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import ActiveEnv from "@config/env/env.dev.json";

const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: ActiveEnv.GOOGLE_KEY,
        language: "en",
      }}
    />
  );
};

export default GooglePlacesInput;
