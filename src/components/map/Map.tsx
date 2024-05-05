import AsyncStorage from "@react-native-async-storage/async-storage";
import MapboxGL, {
  Camera,
  CircleLayer,
  HeatmapLayer,
  MapView,
  ShapeSource,
  UserLocation,
} from "@rnmapbox/maps";
import { FeatureCollection } from "geojson";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-swiper";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { activeRadio, event, pin } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { LOG } from "~/config";
import { createStyleSheet } from "./style";
// import { getData, setData } from "~/network/constant";

interface Range {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

MapboxGL.setAccessToken(process.env.MAP_ACCESS_TOKEN!);

const BOULDER_LON = -105.2705;
const BOULDER_LAT = 40.015;
const DEFAULT_ZOOM = 12;

export const Map = () => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  var [eventData, eventDetail]: any = useState([]);

  // TODO Use the center of the current locale
  const [centerCoordinate, setCenterCoordinate] = useState([
    BOULDER_LON,
    BOULDER_LAT,
  ]);

  const [eventList, eventDataStore] = useState([]);
  const [eventType, eventTypeData] = useState("event");
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<FeatureCollection>();
  // const mileStoneSwiperRef: any = useRef(null);
  // var zoomLeveDefault = getData("mapCircleRadius");
  const [zoomLevel, setCameraZoomLevel] = useState(DEFAULT_ZOOM);
  // const [shape, setShapData]: any = useState();
  // const { user } = useSelector<StoreType, UserProfileState>(
  //   (state) => state.userProfileReducer
  // ) as { user: { id: string; pic: string } };
  var makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() + 1);
  const [range, setRange] = useState<Range>({
    startDate: new Date(),
    endDate: makeDate,
  });
  // const mapRef = useRef(null);
  // const [mapLoaded, setMapLoaded] = useState(false);

  // const mapRef = useRef(null);

  // useFocusEffect(
  //   useCallback(() => {
  //     if (!latitude) {
  //       requestLocationPermission();
  //     }
  //   }, [])
  // );

  const camera = useRef<MapboxGL.Camera>(null);

  useEffect(() => {
    // checkLocation();
    // Center the map in the default location
    camera.current?.setCamera({
      centerCoordinate,
      zoomLevel,
    });
  });

  useEffect(() => {
    async function fetchEvents() {
      const url = process.env.API_URL + "/v2/events";
      LOG.info(url);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(url, {
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
      });
      LOG.info(response.status);
      const dataItem = await response.json();

      LOG.debug(dataItem?.data);
      setEvents(dataItem?.data);
    }

    fetchEvents();
  }, []);

  // async function checkLocation() {
  //   if (Platform.OS === "android") {
  //     try {
  //       const checkEnable: Boolean = await isLocationEnabled();
  //       const enableResult = await promptForEnableLocationIfNeeded();
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //       );
  //       const granteds = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
  //       );
  //       if (checkEnable) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     } catch (error: unknown) {
  //       if (error instanceof Error) {
  //         console.error(error.message);
  //       }
  //     }
  //   }
  // }

  // const requestLocationPermission = async () => {
  //   console.log("check 2222");
  //   GetLocation.getCurrentPosition({
  //     enableHighAccuracy: false,
  //     timeout: 60000,
  //   })
  //     .then((location) => {
  //       if (location?.latitude && location?.longitude) {
  //         var isLocationDefault = {
  //           latitude: location.latitude,
  //           longitude: location.longitude,
  //           zoomLevel: getData("mapCircleRadius"),
  //         };
  //         // setData("defaultLocation", isLocationDefault);
  //         setLongitude(location?.longitude);
  //         setLatitude(location?.latitude);
  //         setNewLocation(isLocationDefault);
  //         const shape: any = {
  //           type: "FeatureCollection",
  //           features: [
  //             {
  //               type: "Feature",
  //               geometry: {
  //                 type: "Point",
  //                 coordinates: [location?.longitude, location?.latitude],
  //               },
  //             },
  //           ],
  //         };
  //         setShapData(shape);
  //       }
  //     })
  //     .catch((error) => {
  //       const { code, message } = error;
  //       console.log(code, message);
  //     });
  // };

  // async function fetchNearbyEvents() {
  //   LOG.debug("> fetchNearbyEvents");
  //   setIsLoading(true);
  //   const token = await AsyncStorage.getItem("token");
  //   var data: any = {
  //     start_date: moment(range.startDate).format("YYYY-MM-DD"),
  //     end_date: moment(range.endDate).format("YYYY-MM-DD"),
  //     type: eventType,
  //     user_lat: BOULDER_LAT,
  //     user_long: BOULDER_LON,
  //     radius: 25,
  //     zoom_level: zoomLevel,
  //     device_type: Platform.OS,
  //   };
  //   eventDataStore([]);
  //   try {
  //     const url = process.env.API_URL + "/v1/events/geotagging";
  //     LOG.info(url);
  //     LOG.info(data);
  //     const response = await fetch(url, {
  //       method: "post",
  //       headers: new Headers({
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //       }),
  //       body: JSON.stringify(data),
  //     });
  //     LOG.info(response.status);
  //     const dataItem = await response.json();
  //     LOG.debug(dataItem?.data);
  //     // setIsLoading(false);
  //     if (dataItem?.data) {
  //       eventDetail(dataItem?.data);
  //     }

  //     if (dataItem?.data.length !== 0) {
  //       const resultTemp = dataItem?.data?.map((item: any) => {
  //         return { ...item, isActive: false };
  //       });
  //       resultTemp[0].isActive = true;
  //       eventDataStore(resultTemp);
  //     }
  //     LOG.debug("< fetchNearbyEvents");
  //   } catch (error) {
  //     LOG.error("fetchNearbyEvents", error);
  //     // setIsLoading(false);
  //   }
  // }

  // const handleRegionChange = async (event: any) => {
  //   // if (mapLoaded) {
  //   const newZoomLevel = event.properties.zoomLevel;
  //   if (newZoomLevel !== zoomLevel) {
  //     setIsLoading(true);
  //   }
  //   console.log("handleRegionChange newZoomLevel", newZoomLevel);
  //   setCameraZoomLevel(newZoomLevel);
  //   var isMapLocation: any = {
  //     // latitude: latitude,
  //     // longitude: longitude,
  //     zoomLevel: newZoomLevel,
  //     device_type: Platform.OS,
  //   };

  //   // setData("defaultLocation", isMapLocation);
  //   // }
  // };

  // const onMarkerClick = (mapEventData: any) => {
  //   // mileStoneSwiperRef?.current?.scrollTo(mapEventData);
  //   const resultTemp: any = [...eventList];
  //   for (let index = 0; index < resultTemp.length; index++) {
  //     resultTemp[index].isActive = false;
  //   }
  //   resultTemp[mapEventData].isActive = true;
  //   eventDataStore(resultTemp);
  // };

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

  // const onCircleDrag = (event: any) => {
  //   console.log("event circle drag latitude", event.geometry.coordinates[1]);
  //   console.log("event circle drag longitude", event.geometry.coordinates[0]);
  //   var isMapLocation: any = {
  //     latitude: event.geometry.coordinates[1],
  //     longitude: event.geometry.coordinates[0],
  //     zoomLevel: zoomLevel,
  //     device_type: Platform.OS,
  //   };
  //   setNewLocation(isMapLocation);
  //   setLongitude(event.geometry.coordinates[0]);
  //   setLatitude(event.geometry.coordinates[1]);
  //   setData("defaultLocation", isMapLocation);
  // };

  // const handleOpenURL = () => {
  //   Linking.openSettings();
  // };

  // async function userLocationClick() {
  //   if (Platform.OS === "ios") {
  //     requestLocationPermission();
  //   } else {
  //     getAndroidLocationPermission();
  //   }
  // }

  // async function getAndroidLocationPermission() {
  //   const checkEnable: Boolean = await isLocationEnabled();
  //   const granted = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //   );
  //   if (granted === "never_ask_again") {
  //     Alert.alert(
  //       "Permission Denied",
  //       "To use this feature, please enable location permissions in your device settings.",
  //       [
  //         {
  //           text: "Setting",
  //           onPress: () => handleOpenURL(),
  //         },
  //       ],
  //       { cancelable: false }
  //     );
  //   }
  //   if (checkEnable && granted === PermissionsAndroid.RESULTS.GRANTED) {
  //     requestLocationPermission();
  //     console.log("check");
  //   }
  //   console.log(granted);
  //   if (!checkEnable) {
  //     const enableResult = await promptForEnableLocationIfNeeded();
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //     );
  //     requestLocationPermission();
  //   } else if (checkEnable) {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //     );
  //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //       );
  //       requestLocationPermission();
  //     }
  //   }
  // }

  const EventList = () => (
    // {eventData != undefined && eventData.length > 0 ? (
    <View style={styles.avatarContainer}>
      <Swiper
        onIndexChanged={(value) => {
          changeMarkerColor(value);
          // onswipeSetEventIndex(value);
        }}
        // ref={mileStoneSwiperRef}
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
  );
  // ) : (
  //   <>
  //     {!tempdata?.longitude && !tempdata?.longitude ? (
  //       <>
  //         {Platform.OS === "android" ? (
  //           <TouchableOpacity
  //             onPress={userLocationClick}
  //             style={{ backgroundColor: "white", padding: 10 }}
  //           >
  //             <Text style={styles.locationTitle}>
  //               Device location not enabled
  //             </Text>

  //             <View
  //               style={{
  //                 flexDirection: "row",
  //                 flexWrap: "wrap",
  //                 paddingHorizontal: 12,
  //               }}
  //             >
  //               <Text style={styles.locationDes}>
  //                 Tap here to enable your device location for a better
  //                 experience
  //               </Text>
  //               <Text style={styles.enableBtn}>Enable</Text>
  //             </View>
  //           </TouchableOpacity>
  //         ) : (
  //           <TouchableOpacity
  //             onPress={() => Linking.openURL("app-settings:")}
  //             style={{ backgroundColor: "white", padding: 10 }}
  //           >
  //             <Text style={styles.locationTitle}>
  //               App Location Permission
  //             </Text>

  //             <View
  //               style={{
  //                 flexDirection: "row",
  //                 flexWrap: "wrap",
  //                 paddingHorizontal: 12,
  //               }}
  //             >
  //               <Text style={styles.locationDes}>
  //                 Go to app setting and enable location service to better
  //                 experience
  //               </Text>
  //             </View>
  //           </TouchableOpacity>
  //         )}
  //       </>
  //     ) : (
  //       <></>
  // )}
  // </>
  // )}

  // const handleCameraChanged = (state: MapboxGL.MapState) => {
  //   // LOG.debug("> handleCameraChanged", state);

  //   const { zoom, center, bounds } = state.properties;

  //   // TODO Use _.debounce
  //   if (zoom < 10) {
  //     // Zoomed out
  //     // Just put a dot at Boulder
  //     // load
  //   }
  // };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        zoomEnabled={true}
        compassEnabled={true}
        // onRegionDidChange={handleRegionChange}
        // onDidFinishLoadingMap={() => setMapLoaded(true)}
        // ref={mapRef}
        // attributionEnabled={false}
        // onCameraChanged={handleCameraChanged}
      >
        <UserLocation />

        <Camera
          ref={camera}
          centerCoordinate={centerCoordinate}
          zoomLevel={zoomLevel}
          animationDuration={20}
          // zoomLevel={zoomLevel}
          // maxZoomLevel={14}
          // minZoomLevel={5}
          // followUserLocation={false}
          // centerCoordinate={[
          //   parseFloat(tempdata?.longitude),
          //   parseFloat(tempdata?.latitude),
          // ]}
        />

        <ShapeSource id="events" shape={events as GeoJSON.FeatureCollection}>
          <CircleLayer
            id={"circle-layer"}
            minZoomLevel={11}
            style={{
              circleRadiusTransition: { duration: 5000, delay: 0 },
              circleColor: "#003333",
            }}
            slot={"bottom"}
          />
          {/* <SymbolLayer
            id="eventSymbol"
            minZoomLevel={12}
            style={{
              iconImage: ["get", "icon"],
            }}
            slot={"middle"}
          /> */}
          <HeatmapLayer
            id="heatmap"
            maxZoomLevel={11}
            style={{
              heatmapColor: [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(33,102,172,0)",
                0.2,
                "rgb(103,169,207)",
                0.4,
                "rgb(209,229,240)",
                0.6,
                "rgb(253,219,199)",
                0.8,
                "rgb(239,138,98)",
                1,
                "rgb(178,24,43)",
              ],
            }}
          />
        </ShapeSource>

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
        {/* 
        {eventList.map((event: any, jindex) => (
          <MarkerView
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
          </MarkerView>
        ))} */}
      </MapView>
      {/* ) : (
        <></> */}
      {/* )} */}
      <EventList />
    </View>
  );
};

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [-105.31, 40.06829, 0],
      },
    },
  ],
};
