import MapboxGL, {
  Camera,
  Images,
  MapView,
  ShapeSource,
  SymbolLayer,
  UserLocation,
} from "@rnmapbox/maps";
import { FeatureCollection } from "geojson";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { createStyleSheet } from "./style";
// import { getData, setData } from "~/network/constant";

import { useFocusEffect } from "@react-navigation/native";
import { OnPressEvent } from "@rnmapbox/maps/lib/typescript/src/types/OnPressEvent";
import { DateTime } from "luxon";
import eventIcon from "~/assets/map/event.png";
import giftIcon from "~/assets/map/gift.png";
import { LOG } from "~/config";
import {
  featureToLocalEvent,
  listEventsForMap,
} from "~/network/api/services/event-service";
import { LocalEvent } from "~/types/local-event";
import { LocalEventData } from "~/types/local-event-data";
import { handleApiError } from "~/utils/common";
import { EventItem } from "../events/EventItem";

interface Range {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

MapboxGL.setAccessToken(process.env.MAP_ACCESS_TOKEN!);

const BOULDER_LON = -105.2705;
const BOULDER_LAT = 40.015;
const DEFAULT_ZOOM = 11.5;

interface MapProps {
  onClicked?: (event: LocalEventData) => void;
}
export const Map = ({ onClicked }: MapProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  var [eventData, eventDetail]: any = useState([]);

  // TODO Use the center of the current locale
  const [centerCoordinate, setCenterCoordinate] = useState([
    BOULDER_LON,
    BOULDER_LAT,
  ]);

  const [events, setEvents] = useState<FeatureCollection>();
  const [selectedEvents, setSelectedEvents] = useState<LocalEvent[]>([]);

  var makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() + 1);
  const [range, setRange] = useState<Range>({
    startDate: new Date(),
    endDate: makeDate,
  });

  const imageMarkers = {
    event: eventIcon,
    gift: giftIcon,
  };

  useFocusEffect(
    useCallback(() => {
      setSelectedEvents([]);
      fetchEvents();
    }, [])
  );

  const fetchEvents = async () => {
    try {
      const events = await listEventsForMap({
        startDate: DateTime.now(),
        isCanceled: false,
        // endDate: DateTime.now().plus({ months: 3 }),
      });
      setEvents(events);
    } catch (e) {
      handleApiError("Failed loading events", e);
    }
  };

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

  const handleMapEventPress = (event: OnPressEvent) => {
    LOG.debug("Map clicked", event);
    const localEvents = event.features.map(featureToLocalEvent);
    setSelectedEvents(localEvents);
    // selectedEvent?.id === localEvent.id ? undefined : localEvent;
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        zoomEnabled={true}
        compassEnabled={true}
        onPress={() => setSelectedEvents([])}
        gestureSettings={{
          pinchPanEnabled: false,
        }}
        // onRegionDidChange={handleRegionChange}
        // onDidFinishLoadingMap={() => setMapLoaded(true)}
        // ref={mapRef}
        // attributionEnabled={false}
        // onCameraChanged={handleCameraChanged}
      >
        <UserLocation />
        <Camera
          // ref={camera}
          centerCoordinate={centerCoordinate}
          zoomLevel={DEFAULT_ZOOM}
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
        <ShapeSource
          id="events"
          shape={events}
          hitbox={{ width: 20, height: 20 }}
          onPress={handleMapEventPress}
        >
          <SymbolLayer
            id="eventSymbol"
            minZoomLevel={1}
            style={{
              iconImage: "event",
            }}
          />
          <Images
            images={imageMarkers}
            onImageMissing={(imageKey: string) =>
              console.log("=> on image missing", imageKey)
            }
          />
        </ShapeSource>
        <>
          {selectedEvents.map((se) => (
            <EventItem key={se.id} event={se} onPress={() => onClicked?.(se)} />
          ))}
        </>
      </MapView>
    </View>
  );
};
