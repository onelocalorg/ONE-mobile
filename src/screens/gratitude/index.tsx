import React, {
  LegacyRef,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createStyleSheet } from "./style";
import { useAppTheme } from "@app-hooks/use-app-theme";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  LogBox,
  PermissionsAndroid,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useStringsAndLabels } from "@app-hooks/use-strings-and-labels";
import { ImageComponent } from "@components/image-component";
import {
  Search,
  activeRadio,
  arrowDown,
  bell,
  blackPin,
  calendar,
  close,
  dummy,
  event,
  gratitude,
  mapEvent,
  mapGifting,
  mapService,
  minus,
  onelogo,
  pin,
  pinWhite,
  plus,
  redPin,
} from "@assets/images";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "@network/reducers/store";
import {
  UserProfileState,
  onSetUser,
} from "@network/reducers/user-profile-reducer";
import {
  useUserProfile,
  userProfileParsedData,
} from "@network/hooks/user-service-hooks/use-user-profile";
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from "@react-navigation/native";
import { navigations } from "@config/app-navigation/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import GetLocation from "react-native-get-location";
import { Loader } from "@components/loader";
import Swiper from "react-native-swiper";
import ActiveEnv from "@config/env/env.dev.json";
import MapboxGL, { Callout, CircleLayer, MarkerView } from "@rnmapbox/maps";
import Toast from "react-native-simple-toast";

MapboxGL.setAccessToken(ActiveEnv.MAP_ACCESS_TOKEN);

import { API_URL, getData, setData } from "@network/constant";
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from "react-native-android-location-enabler";

interface MapScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

interface Range {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const GratitudeScreen = (props: MapScreenProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  var [eventData, eventDetail]: any = useState([]);
  var [latitude, setLatitude]: any = useState();
  var [longitude, setLongitude]: any = useState();
  const [eventList, eventDataStore] = useState([]);
  const [eventType, eventTypeData] = useState("event");
  const [profileData, setUserProfile]: any = useState("");
  const [isLoading, LodingData] = useState(false);
  const { navigation } = props || {};
  const mileStoneSwiperRef: any = useRef(null);
  const [zoomLevel, setCameraZoomLevel] = useState(11);
  const [shape, setShapData]: any = useState();
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { id: string; pic: string } };
  const { refetch } = useUserProfile({
    userId: user?.id,
  });
  var makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() + 1);
  const [range, setRange] = useState<Range>({
    startDate: new Date(),
    endDate: makeDate,
  });
  const mapRef: LegacyRef<MapboxGL.MapView> = useRef(null);
  const [tempdata, setNewLocation]: any = useState(getData('defaultLocation'));




  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      var tempdataTwo = getData('defaultLocation');
      console.log('setLocation=>', tempdataTwo);
      if (!tempdataTwo?.latitude) {
        console.log('-------------post 1 time------------');
        requestLocationPermission();
      }
      getUserProfileAPI();
    }, [])
  );

  useEffect(() => {
    LogBox.ignoreAllLogs();
    var tempdataTwo = getData('defaultLocation');
    if (tempdataTwo?.latitude) {
      console.log("useEffect ", zoomLevel);
      geoTaggingAPITwo();
    }
  }, [zoomLevel,tempdata?.latitude]);
 

  const requestLocationPermission = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 60000,
    })
      .then((location) => {
        if (location?.latitude && location?.longitude) {

          var isLocationDefault = {
            latitude: location.latitude,
            longitude: location.longitude,
            zoomLevel: 11
          }
          setData('defaultLocation', isLocationDefault)
          setLongitude(location?.longitude);
          setLatitude(location?.latitude);
          const shape: any = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [location?.longitude, location?.latitude],
                },
              },
            ],
          };
          setShapData(shape);
        }
      })
      .catch((error) => {
        const { code, message } = error;
        console.log('8888')
        console.log(code, message);
      });
  };

  const onNavigateToProfile = () => {
    if (user?.id) {
      refetch().then((res) => {
        const userData = userProfileParsedData(res?.data?.data);
        dispatch(onSetUser(userData));
      });
    }
    navigation.navigate(navigations.PROFILE);
  };

  const getUserProfileAPI = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(API_URL + "/v1/users/" + user.id, {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
      });
      const dataItem = await response.json();
      setUserProfile(dataItem.data);
      AsyncStorage.setItem("profile", dataItem.data.pic);
      AsyncStorage.setItem("uniqueId", dataItem.data.user_unique_id);
    } catch (error) {
      console.log(error);
    }
  };

  async function geoTaggingAPITwo() {
    const userLatLog = getData('defaultLocation')
    const token = await AsyncStorage.getItem("token");
    if (tempdata?.latitude) {
      var data: any = {
        start_date: moment(range.startDate).format("YYYY-MM-DD"),
        end_date: moment(range.endDate).format("YYYY-MM-DD"),
        type: eventType,
        user_lat: tempdata?.latitude,
        user_long: tempdata?.longitude,
        radius: 25,
        zoom_level: tempdata?.zoomLevel,
        device_type: "ios",
      };
    } else {
      var data: any = {
        start_date: moment(range.startDate).format("YYYY-MM-DD"),
        end_date: moment(range.endDate).format("YYYY-MM-DD"),
        type: eventType,
        user_lat: latitude,
        user_long: longitude,
        radius: 25,
        zoom_level: zoomLevel,
        device_type: Platform.OS,
      };
    }
    console.log("-----------------map location------------------", data);
    eventDataStore([]);
    try {
      const response = await fetch(API_URL + "/v1/events/geotagging", {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(data),
      });
      const dataItem = await response.json();
      console.log(
        "=========== Geo Tagging API Response ==============",
        dataItem?.data?.length
      );
      LodingData(false);
      if (dataItem?.data) {
        eventDetail(dataItem?.data);
      }

      if (dataItem?.data.length !== 0) {
        const resultTemp = dataItem?.data?.map((item: any) => {
          return { ...item, isActive: false };
        });
        resultTemp[0].isActive = true;
        eventDataStore(resultTemp);
      }
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }


  const onNavigateEventDetail = (item: any) => {
    navigation.navigate(navigations.EVENT_DETAIL, { id: item?._id });
  };

  const handleRegionChange = async (event: any) => {
    const newZoomLevel = event.properties.zoomLevel;
    console.log("ZoomLevel=>", newZoomLevel);
    setCameraZoomLevel(newZoomLevel);
    var isMapLocation: any = {
      latitude: event.geometry.coordinates[1],
      longitude: event.geometry.coordinates[0],
      zoomLevel: newZoomLevel, 
      device_type: Platform.OS
    }
    setNewLocation(isMapLocation);
    setData('defaultLocation', isMapLocation);
  };

  const onMarkerClick = (mapEventData: any) => {
    mileStoneSwiperRef?.current?.scrollTo(mapEventData);
    const resultTemp: any = [...eventList];
    for (let index = 0; index < resultTemp.length; index++) {
      resultTemp[index].isActive = false;
    }
    resultTemp[mapEventData].isActive = true;
    eventDataStore(resultTemp);
  };

  const changeMarkerColor = (indexMarker: any) => {
    const resultTemp: any = [...eventList];
    for (let index = 0; index < resultTemp.length; index++) {
      resultTemp[index].isActive = false;
    }
    if (resultTemp.length > indexMarker) {
      resultTemp[indexMarker].isActive = true;
    }

    eventDataStore(resultTemp);
  };

  const onCircleDrag = (event: any) => {
    var tempdataTwo = getData('defaultLocation');
    // LodingData(true);
    console.log(event, 'event circle')
    setCameraZoomLevel(tempdataTwo?.zoomLevel)
    var isMapLocation: any = {
      latitude: event.geometry.coordinates[1],
      longitude: event.geometry.coordinates[0],
      zoomLevel: tempdataTwo?.zoomLevel, 
      device_type: Platform.OS
    }
    setNewLocation(isMapLocation);
    setData('defaultLocation', isMapLocation);
    // setLongitude(event.geometry.coordinates[0]);
    // setLatitude(event.geometry.coordinates[1]);
  };

  const handleOpenURL = () => {
    Linking.openSettings();
  };

  async function userLocationClick() {
    if (Platform.OS === "ios") {
      requestLocationPermission();
    } else {
      getAndroidLocationPermission();
    }
  }

  async function getAndroidLocationPermission() {
    const checkEnable: Boolean = await isLocationEnabled();
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (granted === "never_ask_again") {
      Alert.alert(
        "Permission Denied",
        "To use this feature, please enable location permissions in your device settings.",
        [
          {
            text: "Setting",
            onPress: () => handleOpenURL(),
          },
        ],
        { cancelable: false }
      );
    }
    if (checkEnable && granted === PermissionsAndroid.RESULTS.GRANTED) {
      requestLocationPermission();
    }
    console.log(granted);
    if (!checkEnable) {
      const enableResult = await promptForEnableLocationIfNeeded();
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      requestLocationPermission();
    } else if (checkEnable) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        requestLocationPermission();
      }
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Loader visible={isLoading} showOverlay />

      <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
        <View style={styles.oneContainer}>
          <ImageComponent
            style={styles.oneContainerImage}
            source={onelogo}
          ></ImageComponent>
          <View>
            <Text style={styles.oneContainerText}>NE</Text>
            <Text style={styles.localText}>L o c a l</Text>
          </View>
        </View>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNavigateToProfile}
            style={styles.profileView}
          >
            <ImageComponent
              resizeMode="cover"
              isUrl={!!user?.pic}
              source={dummy}
              uri={profileData?.pic}
              style={styles.profile}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {tempdata?.latitude && tempdata?.longitude ? (
        <MapboxGL.MapView
          style={styles.map}
          onRegionDidChange={handleRegionChange}
          logoEnabled={false}
          scaleBarEnabled={true}
          ref={mapRef}
          attributionEnabled={false}
        >
          <MapboxGL.UserLocation />

          <View>
            <MapboxGL.Camera
              zoomLevel={zoomLevel}
              maxZoomLevel={14}
              minZoomLevel={5}
              followUserLocation={false}
              centerCoordinate={[parseFloat(tempdata?.longitude), parseFloat(tempdata?.latitude)]}
            />
          </View>

          <MapboxGL.PointAnnotation
            style={{ flex: 1 }}
            key="pointAnnotation"
            id="pointAnnotation"
            coordinate={[parseFloat(tempdata?.longitude), parseFloat(tempdata?.latitude)]}
            draggable
            onDragEnd={onCircleDrag}
          >
            <View
              style={{
                height: 200,
                width: 200,
                borderWidth: 1,
                borderRadius: 200 / 2,
                borderColor: "black",
                backgroundColor: "rgba(112, 68, 139, 0.7)",
              }}
            ></View>
          </MapboxGL.PointAnnotation>

          {eventList.map((event: any, jindex) => (
            <MapboxGL.MarkerView
              key={Math.random()}
              coordinate={[
                event?.location?.coordinates[0],
                event?.location?.coordinates[1],
              ]}
              id={event._id}
            >
              <TouchableOpacity onPress={() => onMarkerClick(jindex)}>
                <Image
                  resizeMode="contain"
                  source={event?.isActive ? redPin : blackPin}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </MapboxGL.MarkerView>
          ))}
        </MapboxGL.MapView>
      ) : (
        <></>
      )}

      {eventData != undefined && eventData.length > 0 ? (
        <View style={styles.avatarContainer}>
          <Swiper
            onIndexChanged={(value) => {
              changeMarkerColor(value);
              // onswipeSetEventIndex(value);
            }}
            ref={mileStoneSwiperRef}
            loop={false}
            // centeredSlides={false}
            showsPagination={false}
            bounces={true}
            removeClippedSubviews={false}
          >
            {eventData.map((eventData: any) => {
              return (
                <TouchableOpacity
                  key={Math.random()}
                  activeOpacity={1}
                  style={styles.listContainer}
                  onPress={() => onNavigateEventDetail(eventData)}
                >
                  <ImageComponent
                    resizeMode="stretch"
                    source={{ uri: eventData?.event_image }}
                    style={styles.dummy}
                  />
                  <View style={styles.flex}>
                    <View style={styles.row}>
                      <View style={styles.flex}>
                        <Text style={styles.dateText}>{`${moment(
                          eventData?.start_date
                        ).format("ddd, MMM DD")} • ${moment(
                          eventData?.start_date
                        ).format("hh:mm A")}`}</Text>
                        <Text numberOfLines={2} style={styles.title}>
                          {eventData?.name}
                        </Text>
                      </View>
                      <ImageComponent source={event} style={styles.event} />
                    </View>
                    <View style={styles.row}>
                      <ImageComponent source={pin} style={styles.pin} />
                      <Text style={styles.location}>{eventData?.address}</Text>
                      <ImageComponent
                        style={styles.addressDot}
                        source={activeRadio}
                      ></ImageComponent>
                      <Text numberOfLines={1} style={styles.fullAddress}>
                        {eventData?.full_address}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </Swiper>
        </View>
      ) : (
        <>
          {!tempdata?.longitude && !tempdata?.longitude ? (
            <>
            {Platform.OS === 'android' ? <TouchableOpacity
            onPress={userLocationClick}
            style={{ backgroundColor: "white", padding: 10 }}
          >
            <Text style={styles.locationTitle}>
              Device location not enabled
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 12,
              }}
            >
              <Text style={styles.locationDes}>
                Tap here to enable your device location for a better
                experience
              </Text>
              <Text style={styles.enableBtn}>Enable</Text>
            </View>
          </TouchableOpacity> : <TouchableOpacity
            onPress={() =>  Linking.openURL('app-settings:')}
            style={{ backgroundColor: "white", padding: 10 }}
          >
            <Text style={styles.locationTitle}>
              App Location Permission
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 12,
              }}
            >
              <Text style={styles.locationDes}>
                Go to app setting and enable location service to better experience  
              </Text>
            </View>
          </TouchableOpacity>}
            </>
            
          ) : (
            <></>
          )}
        </>
      )}
    </View>
  );
};
