Check Hide Show PayMent Flow

1.Apple And Google Button Hide => Login
2.MemberShip => Profile
3.Buy Ticket => Event Detail
4.Payout Connect => Profile
5.Create Event => on Plus From Bottom

1.Current Location
npm i react-native-get-location

2.Google AutoComplete
npm i react-native-google-places-autocomplete

3. Slider on Map
   npm i react-native-image-slider-box

4.MapBox
https://github.com/rnmapbox/maps?tab=readme-ov-file
npm install @rnmapbox/maps

5.  datepicker ios issue
    npm install @react-native-community/datetimepicker --save
    https://github.com/react-native-datetimepicker/datetimepicker/issues/866

        6. Apple sign in
        "@invertase/react-native-apple-authentication": "^2.3.0",

        7. storege
        "@react-native-async-storage/async-storage": "^1.19.0",

        8. copy
        "@react-native-clipboard/clipboard": "^1.11.2",

        9. datepicker
        "@react-native-community/datetimepicker": "^7.3.0",

        10. get location
        "@react-native-community/geolocation": "^3.1.0",

        11.
        "@react-native-community/netinfo": "^9.4.1",

        12. google sign in
        "@react-native-google-signin/google-signin": "^11.0.0",

        13. bottom tab
        "@react-navigation/bottom-tabs": "^6.5.8",

        14. navidation
        "@react-navigation/native": "^6.1.7",

        15.
        "@react-navigation/stack": "^6.3.17",

        16.
        "@reduxjs/toolkit": "^1.9.5",

        17. Map
        "@rnmapbox/maps": "^10.1.18",

        18. stripe payment
        "@stripe/stripe-react-native": "^0.37.0",

        19.
        "@tanstack/react-query": "^4.29.19",

        20. Axios for api
        "axios": "^1.4.0",

        21.
        "jwt-decode": "^4.0.0",

        22.
        "lodash": "^4.17.21",

        23.
        "moment": "^2.29.4",

        24. scroll
        "react-infinite-scroll-component": "^6.1.0",

        25. On device location
        "react-native-android-location-enabler": "^2.0.1",

        26.
        "react-native-calendars": "^1.1303.0",

        27. camere
        "react-native-camera": "^4.2.1",

        28.
        "react-native-device-info": "^10.7.0",

        29.
        "react-native-eject": "^0.2.0",

        30.
        "react-native-elements": "^3.4.3",

        31.
        "react-native-fast-image": "^8.6.3",

        32. geo location
        "react-native-geolocation-service": "^5.3.1",

        33. On Modal Swipe gesture
        "react-native-gesture-handler": "^2.12.0",

        34.
        "react-native-get-location": "^4.0.1",

        35. Google address autofill
        "react-native-google-places-autocomplete": "^2.5.6",

        36. crop image and upload
        "react-native-image-crop-picker": "^0.40.2",

        37. image upload
        "react-native-image-picker": "^7.1.0",

        38.
        "react-native-keyboard-aware-scroll-view": "^0.9.5",

        39.
        "react-native-maps": "^1.9.1",

        40.
        "react-native-modal-datetime-picker": "^17.0.0",

        41.
        "react-native-paper": "^5.9.1",

        42.
        "react-native-paper-dates": "^0.18.12",

        43.
        "react-native-permissions": "^4.0.1",

        44.
        "react-native-popover-view": "^5.1.8",

        45.
        "react-native-reanimated": "^3.3.0",

        46.
        "react-native-safe-area-context": "^4.6.3",

        47.
        "react-native-screens": "^3.22.0",

        48. toast
        "react-native-simple-toast": "^3.1.0",

        49. splash screen
        "react-native-splash-screen": "^3.3.0",

        50.
        "react-native-svg": "^13.9.0",

        51.
        "react-native-swipe-gestures": "^1.0.5",

        52.
        "react-native-swiper": "^1.6.0",

        53.
        "react-native-vector-icons": "^10.0.0",

        54.
        "react-native-webview": "^13.2.3",

        55.
        "react-redux": "^8.1.1",

        56.
        "redux": "^4.2.1",

        57.
        "redux-persist": "^6.0.0",

        58.
        "watchman": "^1.0.0"

For Android
0.37.0

For IOS
0.28.0

env:
WORKSPACE: ${{ ‘ios/OneBoulder.xcworkspace’ }}
SCHEME: ${{ OneBoulder }}
CONFIGURATION: ${{ ‘Release’ }}
ARCHIVE_PATH: ${{ ‘build/OneBoulder.xcarchive’ }}
EXPORT_PATH_PROD: ${{ ‘prod/’ }}
PLIST_PATH_PROD: ${{ ‘ios/OneBoulder/info.plist’ }}

APP_CENTER_TOKEN_PROD: ${{ secrets.APP_CENTER_TOKEN_MYAPP_IOS_PROD }}

ARTIFACT_NAME: ${{ OneBoulder-ipa’ }}
  ARTIFACT_PATH_PROD: ${{ ‘prod/’ }}
  APP_NAME_PROD: ${{ OneBoulder-iOS/ENV_PROD’ }}
  TESTING_GROUP_PROD: ${{ ‘ENV_PROD’ }}
  UPLOAD_FILE_PROD: ${{ ‘prod/OneBoulder.ipa’ }}
  DISTRIBUTION_CERTIFICATE: ${{ secrets.APPLE_APP_DISTRIBUTION_CERTIFICATE }}
  CERTIFICATE_PASSWORD: ${{ secrets.CERTIFICATE_PASSWORD }}
  DISTRIBUTION_PROFILE_PROD:${{secrets.APPLE_DISTRIBUTION_PROFILE }}
KEY_PWD: ${{ secrets.KEY_PWD }}
