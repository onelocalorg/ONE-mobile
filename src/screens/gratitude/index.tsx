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
  Dimensions,
  FlatList,
  Image,
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
import ActiveEnv from '@config/env/env.dev.json';
import MapboxGL, { Callout, CircleLayer, MarkerView } from '@rnmapbox/maps';


MapboxGL.setAccessToken(ActiveEnv.MAP_ACCESS_TOKEN);

import { API_URL } from "@network/constant";
import { MapCircle } from "react-native-maps";
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
  const { strings } = useStringsAndLabels();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [starttimePicker, startTimePicker] = useState(false);
  const [endtimePicker, endTimePicker] = useState(false);
  const [setStartTime, setStartTimeData] = useState();
  const [setEndTime, setEndTimeData] = useState();
  var [radius, setRadius] = useState(25);
  var [eventData, eventDetail]: any = useState([]);
  var [circleradius, setCircleRadius] = useState(5000);
  var [location, setUserLocation]: any = useState();
  var [pitch, setPitchOnMap] = useState(45);
  var [heading, setHeadingOnMap] = useState(60);
  var [zoom, setZoomOnMap] = useState(40);
  var [altitude, setAltitudeOnMap] = useState(35000);
  const [eventList, eventDataStore] = useState([]);
  const [eventType, eventTypeData] = useState("event");
  const [profileData, setUserProfile]: any = useState("");
  const [isLoading, LodingData] = useState(false);
  const { navigation } = props || {};
  const mileStoneSwiperRef: any = useRef(null);
  const [calloutVisible, setCalloutVisible] = useState(false);
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

  const [setCircle, setCircleHightWidth] = useState({
    height: 200,
    width: 200,
  });
  const map: LegacyRef<MapboxGL.MapView> = useRef(null);

  const dispatch = useDispatch();

  const latLong = {
    latitude: location?.latitude,
    longitude: location?.longitude,
  };

  var Camera = {
    center: {
      latitude: location?.latitude,
      longitude: location?.longitude,
    },
    pitch: pitch,
    heading: heading,
    zoom: zoom,
    altitude: altitude,
  };

  useEffect(() => {
    LogBox.ignoreAllLogs();
    setRadius(radius);
    eventTypeData(eventType);
    setCircleRadius(circleradius);
    setPitchOnMap(pitch);
    setHeadingOnMap(heading);
    setZoomOnMap(zoom);
    setAltitudeOnMap(altitude);
    // requestLocationPermission();
    // setUserLocation(location);
  }, [radius, eventType, circleradius, pitch, heading, zoom, altitude]);

  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
      getUserProfileAPI();
    }, [])
  );

  const requestLocationPermission = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 6000,
    })
      .then((location) => {
        setUserLocation(location);
        console.log(
          "---------------------location---------------------",
          location
        );
        setTimeout(() => {
          if (location?.latitude && location?.longitude) {
            geoTaggingAPI(location);
          }
        }, 3000);
      })
      .catch((error) => {
        console.log("---------------------error---------------------", error);
        const { code, message } = error;
        console.log(code, message);
      });
  };

  const onNavigateToProfile = () => {
    if (user?.id) {
      refetch().then((res) => {
        const userData = userProfileParsedData(res?.data?.data);
        console.log("check1===", userData);
        dispatch(onSetUser(userData));
      });
    }
    navigation.navigate(navigations.PROFILE);
  };

  const getUserProfileAPI = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("token", token);
    try {
      const response = await fetch(API_URL + "/v1/users/" + user.id, {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
      });
      const dataItem = await response.json();
      console.log("-----------------" + API_URL + "/v1/users/------------");
      console.log(dataItem);
      console.log(dataItem.data.pic);
      console.log("-----------------user profile 123------------");
      setUserProfile(dataItem.data);
      AsyncStorage.setItem("profile", dataItem.data.pic);
      AsyncStorage.setItem("uniqueId", dataItem.data.user_unique_id);
    } catch (error) {
      console.log(error);
    }
  };

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    (res: Range) => {
      console.log(res, "--------------date pick------------");
      const startDate = res?.startDate;
      const endDate = res?.endDate;
      LodingData(true);
      setOpen(false);
      setRange({ startDate, endDate });
      requestLocationPermission();
      console.log(range, "---------------set range ---------------");
    },
    [setOpen, setRange]
  );

  async function geoTaggingAPI(location: any) {
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      start_date: moment(range.startDate).format("YYYY-MM-DD"),
      end_date: moment(range.endDate).format("YYYY-MM-DD"),
      type: eventType,
      user_lat: location?.latitude,
      user_long: location?.longitude,
      radius: radius,
    };
    // var data: any = {
    //   start_date: moment(range.startDate).format("YYYY-MM-DD"),
    //   end_date: moment(range.endDate).format("YYYY-MM-DD"),
    //   radius: 25,
    //   type: 'event',
    //   user_lat: 72.52067196032797,
    //   user_long: 23.01715137677574,
    // };
    console.log(data);
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
      console.log("=========== Geo Tagging API Response ==============");
      LodingData(false);
      console.log(dataItem);
      eventDetail(dataItem?.data);

      if (dataItem?.data.length !== 0) {
        const resultTemp = dataItem?.data?.map((item: any) => {
          return { ...item, isActive: false };
        });
        resultTemp[0].isActive = true;
        eventDataStore(resultTemp);
        console.log(dataItem?.data[0]);
      }
      console.log(dataItem?.data);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  const onNavigateEventDetail = (item: any) => {
    navigation.navigate(navigations.EVENT_DETAIL, { id: item?._id });
  };

  // const mapPlusClick = () => {
  //   // var height = setCircle.height - 100
  //   // var width = setCircle.width - 100
  //   // setCircleHightWidth({ height, width });
  //   // geoTaggingAPITwo(location);
  //   map?.current?.getCamera().then((cam: Camera) => {
  //     console.log("--------------onZoomInPress------------------",cam);
  //     cam.altitude = altitude + 5000;
  //     radius = radius - 5000;
  //     cam.pitch = pitch + 5;
  //     // heading = heading + 5;
  //     cam.zoom = zoom + 5;
  //     map?.current?.animateCamera(cam);
  //     console.log(cam);
  //     setPitchOnMap(cam.pitch);
  //     // setHeadingOnMap(heading);
  //     setZoomOnMap(cam.zoom);
  //     setAltitudeOnMap(cam.altitude);
  //     geoTaggingAPI(location);
  //   });
  // };

  // const mapMinusClick = () => {
  //   // var height = setCircle.height + 100
  //   // var width = setCircle.width + 100
  //   // setCircleHightWidth({ height, width });
  //   // geoTaggingAPITwo(location);
  //   map?.current?.getCamera().then((cam: Camera) => {
  //     console.log("--------------onZoomOutPress------------------", cam);
  //     cam.altitude = altitude - 5000;
  //     radius = radius + 5000;
  //     cam.pitch = pitch - 5;
  //     // heading = heading + 5;
  //     cam.zoom = zoom - 5;
  //     map?.current?.animateCamera(cam);
  //     console.log(cam);
  //     setPitchOnMap(cam.pitch);
  //     // setHeadingOnMap(heading);
  //     setZoomOnMap(cam.zoom);
  //     setAltitudeOnMap(cam.altitude);
  //     geoTaggingAPI(location);
  //   });
  // };



  const onConfirmStrtTime = (res: any) => {
    console.log(res);
    setStartTimeData(res);
    startTimePicker(false);
    LodingData(true);
    requestLocationPermission();
  };
  const onConfirmEndTime = (res: any) => {
    console.log(res);
    setEndTimeData(res);
    endTimePicker(false);
    LodingData(true);
    requestLocationPermission();
  };

  const onDismissTimePicker = () => {
    startTimePicker(false);
    endTimePicker(false);
  };

  const onEventTypeClick = (type: any) => {
    LodingData(true);
    eventTypeData(type);
    geoTaggingAPI(location);
  };

  const onswipeSetEventIndex = (eventIndex: any) => {
    LodingData(true);
    geoTaggingAPI(location);
  };

  const onMarkerClick = (mapEventData: any) => {
    console.log("markerIndex", mapEventData);
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
    resultTemp[indexMarker].isActive = true;
    eventDataStore(resultTemp);
  };

  const state = {
    selectedPinID: null
  }

  // {
  //   eventList.map((event: any, jindex) => {
  const shape: any = {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [72.49908909999999,23.0504131]
      }
    }]
  };
  //   })
  // }


  const layerStyles = {
    pin: {
      iconImage: pin,
      iconSize: 0.5,
      iconOpacity: 1,
      iconAllowOverlap: false,
      iconIgnorePlacement: false
    },
    pinSelected: {
      iconImage: pinWhite,
      iconSize: 0.5,
      iconOpacity: 1,
      iconAllowOverlap: true,
      iconIgnorePlacement: true
    }
  }

  const onMarkerPress = () => {
    setCalloutVisible(true);
  };

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


      <MapboxGL.MapView
        style={styles.map}
      >
        <MapboxGL.UserLocation />
        <MapboxGL.Camera
          zoomLevel={7}
          followUserLocation={false}
          centerCoordinate={[72.49908909999999,23.0504131]} />
        <MapboxGL.ShapeSource
          existing
          id="symbolLocationSource"
          hitbox={{ width: 30, height: 30 }}
          shape={shape}
        >

          <MapboxGL.CircleLayer
            id='sf2010CircleFill'
            sourceLayerID='sf2010'
            style={{
              visibility: 'visible',
              circleRadius: 100,
              circleColor: '#70448B',
              circleStrokeColor: '#000000',
              circleStrokeWidth: 3,
              circleOpacity: 0.5
            }} />
        </MapboxGL.ShapeSource>


        {eventList.map((event: any, jindex) => {
          return (

            <MapboxGL.PointAnnotation key={event.id}
              id={'event.id'} onSelected={() => onMarkerClick(jindex)} coordinate={[event?.location?.coordinates[0], event?.location?.coordinates[1]]}>
              <View
                style={[event?.isActive === true ? styles.pinRed : styles.pinBlack]}
              ></View>
            </MapboxGL.PointAnnotation>

          );
        })}
      </MapboxGL.MapView>



      {eventData.length != 0 ? (
        <View style={styles.avatarContainer}>
          <Swiper
            onIndexChanged={(value) => {
              console.log("value index", value);
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
        <></>
      )}
    </View>

  );
};
