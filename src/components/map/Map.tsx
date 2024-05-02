import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import MapboxGL from "@rnmapbox/maps";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from "react-native-android-location-enabler";
import GetLocation from "react-native-get-location";
import Swiper from "react-native-swiper";
import { useSelector } from "react-redux";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { activeRadio, blackPin, event, pin, redPin } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { getData, setData } from "~/network/constant";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { createStyleSheet } from "./style";

interface Range {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

MapboxGL.setAccessToken(process.env.MAP_ACCESS_TOKEN!);

export const Map = () => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  var [eventData, eventDetail]: any = useState([]);
  const [tempdata, setNewLocation]: any = useState(getData("defaultLocation"));
  var [latitude, setLatitude]: any = useState(tempdata?.latitude);
  var [longitude, setLongitude]: any = useState(tempdata?.longitude);
  const [eventList, eventDataStore] = useState([]);
  const [eventType, eventTypeData] = useState("event");
  const [isLoading, setIsLoading] = useState(false);
  const mileStoneSwiperRef: any = useRef(null);
  var zoomLeveDefault = getData("mapCircleRadius");
  const [zoomLevel, setCameraZoomLevel] = useState(zoomLeveDefault);
  const [shape, setShapData]: any = useState();
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { id: string; pic: string } };
  var makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() + 1);
  const [range, setRange] = useState<Range>({
    startDate: new Date(),
    endDate: makeDate,
  });
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // const mapRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      if (!latitude) {
        requestLocationPermission();
      }
    }, [])
  );

  useEffect(() => {
    handleEnabledPressed();
  }, []);

  async function handleEnabledPressed() {
    if (Platform.OS === "android") {
      try {
        const checkEnable: Boolean = await isLocationEnabled();
        const enableResult = await promptForEnableLocationIfNeeded();
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        const granteds = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        );
        if (checkEnable) {
          return true;
        } else {
          return false;
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
  }

  const requestLocationPermission = async () => {
    console.log("check 2222");
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 60000,
    })
      .then((location) => {
        if (location?.latitude && location?.longitude) {
          var isLocationDefault = {
            latitude: location.latitude,
            longitude: location.longitude,
            zoomLevel: getData("mapCircleRadius"),
          };
          setData("defaultLocation", isLocationDefault);
          setLongitude(location?.longitude);
          setLatitude(location?.latitude);
          setNewLocation(isLocationDefault);
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
        console.log(code, message);
      });
  };

  async function geoTaggingAPITwo() {
    setIsLoading(true);
    const token = await AsyncStorage.getItem("token");
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
    console.log(
      "-----------------map location request------------------",
      data
    );
    eventDataStore([]);
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/events/geotagging",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(data),
        }
      );
      const dataItem = await response.json();
      console.log(
        "=========== Geo Tagging API Response ==============",
        dataItem?.data?.length
      );
      setIsLoading(false);
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
      setIsLoading(false);
      console.error(error);
    }
  }

  const handleRegionChange = async (event: any) => {
    if (mapLoaded) {
      const newZoomLevel = event.properties.zoomLevel;
      if (newZoomLevel !== zoomLevel) {
        setIsLoading(true);
      }
      console.log("handleRegionChange newZoomLevel", newZoomLevel);
      setCameraZoomLevel(newZoomLevel);
      var isMapLocation: any = {
        latitude: latitude,
        longitude: longitude,
        zoomLevel: newZoomLevel,
        device_type: Platform.OS,
      };

      setData("defaultLocation", isMapLocation);
    }
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
    console.log("event circle drag latitude", event.geometry.coordinates[1]);
    console.log("event circle drag longitude", event.geometry.coordinates[0]);
    var isMapLocation: any = {
      latitude: event.geometry.coordinates[1],
      longitude: event.geometry.coordinates[0],
      zoomLevel: zoomLevel,
      device_type: Platform.OS,
    };
    setNewLocation(isMapLocation);
    setLongitude(event.geometry.coordinates[0]);
    setLatitude(event.geometry.coordinates[1]);
    setData("defaultLocation", isMapLocation);
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
      console.log("check");
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
      {tempdata?.latitude && tempdata?.longitude ? (
        <MapboxGL.MapView
          style={styles.map}
          onRegionDidChange={handleRegionChange}
          onDidFinishLoadingMap={() => setMapLoaded(true)}
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
              centerCoordinate={[
                parseFloat(tempdata?.longitude),
                parseFloat(tempdata?.latitude),
              ]}
            />
          </View>

          {/* <MapboxGL.PointAnnotation
            style={{ flex: 1 }}
            key="pointAnnotation"
            id="pointAnnotation"
            coordinate={[
              parseFloat(tempdata?.longitude),
              parseFloat(tempdata?.latitude),
            ]}
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
          </MapboxGL.PointAnnotation> */}

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
                  // FIXME
                  //   onPress={() => onNavigateEventDetail(eventData)}
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
              {Platform.OS === "android" ? (
                <TouchableOpacity
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
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => Linking.openURL("app-settings:")}
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
                      Go to app setting and enable location service to better
                      experience
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </View>
  );
};
