import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder='Search'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyAl6c5Bv7OT6iajoYA2dH_kNMDh0vRVQDo',
        language: 'en',
      }}
    />
  );
};

export default GooglePlacesInput;