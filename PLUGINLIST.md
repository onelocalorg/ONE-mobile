
1.Current Location
npm i react-native-get-location

2.Google AutoComplete
npm i react-native-google-places-autocomplete

3. Slider on Map
npm i react-native-image-slider-box


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



