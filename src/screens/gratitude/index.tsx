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
  const [setZoomLevel, setCameraZoomLevel] = useState(12);
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
  var RadiusCircle = 220
  const [CircleHeight, setCircleHight] = useState(RadiusCircle);
  const [CircleWidth, setCircleWidth] = useState(RadiusCircle);
  const mapRef: LegacyRef<MapboxGL.MapView> = useRef(null);

  const dispatch = useDispatch();

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
    setCircleHight(CircleHeight);
      setCircleWidth(CircleWidth);
    requestLocationPermission();
    // setUserLocation(location);
  }, [radius, eventType, circleradius, pitch, heading, zoom, altitude,]);

  useFocusEffect(
    useCallback(() => {
      console.log('CircleHeight:',CircleHeight,'CircleWidth:',CircleWidth);
      getUserProfileAPI();
    }, [])
  );

  useEffect(() => {
    console.log('Count updated:', CircleHeight, '----',CircleWidth);
    // You can perform side effects based on the updated count here
  }, [CircleHeight, CircleWidth]);


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
        if (location?.latitude && location?.longitude) {
          geoTaggingAPI(location);
          const shape: any = {
            'type': 'FeatureCollection',
            'features': [{
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [location?.longitude, location?.latitude]
              }
            }]
          };
          setShapData(shape);
          console.log(JSON.stringify(shape?.features[0]?.geometry?.coordinates[0]), 'longitude 11111');
          console.log(JSON.stringify(shape?.features[0]?.geometry?.coordinates[1]), 'latitude 1111');
          console.log(JSON.stringify(shape), 'shape shape shape')
        }
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
    //   user_lat: 72.52067196032797,23.01715137677574
    //   user_long: 23.01715137677574,
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

  async function geoTaggingAPITwo(location: any) {
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      start_date: moment(range.startDate).format("YYYY-MM-DD"),
      end_date: moment(range.endDate).format("YYYY-MM-DD"),
      type: eventType,
      user_lat: location?.coordinates[1],
      user_long: location?.coordinates[0],
      radius: radius,
    };
    //   user_lat: 72.52067196032797,
    //   user_long: 23.01715137677574,
    console.log(data);
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

  const handleRegionChange = async (event: any) => {
    const newZoomLevel = event.properties.zoomLevel;
    let integerValue = parseInt(newZoomLevel);
    console.log(integerValue)
    setCameraZoomLevel(integerValue)
    if (integerValue === 12) {
      var height = 200
      var width = 200
      setCircleHight(200)
      setCircleWidth(200)
    } else if (integerValue === 13) {
      var height = 210
      var width = 210
      setCircleHight(210)
      setCircleWidth(210)
    } else if (integerValue === 14) {
      var height = 220
      var width = 220
      setCircleHight(220)
      setCircleWidth(220)
    } else if (integerValue === 15) {
      var height = 230
      var width = 230
      setCircleHight(230)
      setCircleWidth(230)
    } else if (integerValue === 16) {
      var height = 240
      var width = 240
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 17) {
      var height = 250
      var width = 250
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 18) {
      var height = 260
      var width = 260
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 19) {
      var height = 270
      var width = 270
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 20) {
      var height = 280
      var width = 280
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 21) {
      var height = 290
      var width = 290
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 22) {
      var height = 300
      var width = 300
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 11) {
      var height = 195
      var width = 195
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 10) {
      var height = 190
      var width = 190
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 9) {
      var height = 180
      var width = 180
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 8) {
      var height = 170
      var width = 170
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 7) {
      var height = 160
      var width = 160
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 6) {
      var height = 150
      var width = 150
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 5) {
      var height = 140
      var width = 140
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 4) {
      var height = 130
      var width = 130
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 3) {
      var height = 120
      var width = 120
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 2) {
      var height = 110
      var width = 110
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 1) {
      var height = 95
      var width = 95
      setCircleHight(height)
      setCircleWidth(width)
    } else if (integerValue === 0) {
      var height = 90
      var width = 90
      setCircleHight(height)
      setCircleWidth(width)
    }
    console.log('Zoom level:', JSON.stringify(newZoomLevel));
    console.log(JSON.stringify(event))
    // Call your method or execute code based on the zoom level
  };

  const mapPlusClick = () => {

    // if (mapRef.current) {
    //   mapRef.current._onCameraChanged({
    //     zoom: 14, // Set the desired zoom level
    //   });
    // }
    console.log(setZoomLevel,'setZoomLevel 1')
    setCameraZoomLevel(prevCount => prevCount + 1);
    console.log(CircleHeight);
    if (setZoomLevel === 12) {
      var height = 100
      var width = 100
      setCircleHight(height)
      setCircleWidth(width)
      console.log('1111111')
    } else if (setZoomLevel === 13) {
      var height = 110
      var width = 110
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 14) {
      var height = 120
      var width = 120
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 15) {
      var height = 130
      var width = 130
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 16) {
      var height = 140
      var width = 140
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 17) {
      var height = 150
      var width = 150
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 18) {
      var height = 160
      var width = 160
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 19) {
      var height = 170
      var width = 170
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 20) {
      var height = 180
      var width = 180
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 21) {
      var height = 190
      var width = 190
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 22) {
      var height = 200
      var width = 200
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 11) {
      var height = 95
      var width = 95
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 10) {
      var height = 90
      var width = 90
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 9) {
      var height = 80
      var width = 80
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 8) {
      var height = 70
      var width = 70
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 7) {
      var height = 60
      var width = 60
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 6) {
      var height = 50
      var width = 50
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 5) {
      var height = 40
      var width = 40
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 4) {
      var height = 30
      var width = 30
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 3) {
      var height = 20
      var width = 20
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 2) {
      var height = 10
      var width = 10
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 1) {
      var height = 5
      var width = 5
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 0) {
      var height = 0
      var width = 0
      setCircleHight(height)
      setCircleWidth(width)
    }
    // geoTaggingAPITwo(location);
    // map?.current?._onCameraChanged.then((cam: Camera) => {
    //   console.log("--------------onZoomInPress------------------",cam);
    //   cam.altitude = altitude + 5000;
    //   radius = radius - 5000;
    //   cam.pitch = pitch + 5;
    //   // heading = heading + 5;
    //   cam.zoom = zoom + 5;
    //   map?.current?.animateCamera(cam);
    //   console.log(cam);
    //   setPitchOnMap(cam.pitch);
    //   // setHeadingOnMap(heading);
    //   setZoomOnMap(cam.zoom);
    //   setAltitudeOnMap(cam.altitude);
    //   geoTaggingAPI(location);
    // });
  };

  const mapMinusClick = () => {

    // if (mapRef.current) {
    //   mapRef.current.setCamera({
    //     zoom: 10, // Set the desired zoom level
    //   });
    // }
    console.log(setZoomLevel,'setZoomLevel')
    if (setZoomLevel === 12) {
      var height = 100
      var width = 100
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 13) {
      var height = 110
      var width = 110
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 14) {
      var height = 120
      var width = 120
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 15) {
      var height = 130
      var width = 130
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 16) {
      var height = 140
      var width = 140
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 17) {
      var height = 150
      var width = 150
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 18) {
      var height = 160
      var width = 160
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 19) {
      var height = 170
      var width = 170
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 20) {
      var height = 180
      var width = 180
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 21) {
      var height = 190
      var width = 190
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 22) {
      var height = 200
      var width = 200
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 11) {
      var height = 95
      var width = 95
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 10) {
      var height = 90
      var width = 90
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 9) {
      var height = 80
      var width = 80
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 8) {
      var height = 70
      var width = 70
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 7) {
      var height = 60
      var width = 60
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 6) {
      var height = 50
      var width = 50
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 5) {
      var height = 40
      var width = 40
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 4) {
      var height = 30
      var width = 30
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 3) {
      var height = 20
      var width = 20
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 2) {
      var height = 10
      var width = 10
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 1) {
      var height = 5
      var width = 5
      setCircleHight(height)
      setCircleWidth(width)
    } else if (setZoomLevel === 0) {
      var height = 0
      var width = 0
      setCircleHight(height)
      setCircleWidth(width)
    }
    // geoTaggingAPITwo(location);
    // map?.current?.getCamera().then((cam: Camera) => {
    //   console.log("--------------onZoomOutPress------------------", cam);
    //   cam.altitude = altitude - 5000;
    //   radius = radius + 5000;
    //   cam.pitch = pitch - 5;
    //   // heading = heading + 5;
    //   cam.zoom = zoom - 5;
    //   map?.current?.animateCamera(cam);
    //   console.log(cam);
    //   setPitchOnMap(cam.pitch);
    //   // setHeadingOnMap(heading);
    //   setZoomOnMap(cam.zoom);
    //   setAltitudeOnMap(cam.altitude);
    //   geoTaggingAPI(location);
    // });
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

  const onCircleDrag = (event: any) => {
    geoTaggingAPITwo(event?.geometry)
    console.log(event)
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
        onRegionDidChange={handleRegionChange}
      // zoomEnabled={false}
      ref={mapRef}
      >
        <MapboxGL.UserLocation />
        {location?.latitude && location?.longitude ? <View>
          <MapboxGL.Camera
            zoomLevel={12}
            followZoomLevel={15}
            followUserLocation={false}
            centerCoordinate={shape?.features[0]?.geometry?.coordinates[0] !== undefined ? [shape?.features[0]?.geometry?.coordinates[0], shape?.features[0]?.geometry?.coordinates[1]] : [-122.4194, 37.7749]}
          />
        </View> : <></>}

        <MapboxGL.PointAnnotation style={{flex:1}} key="pointAnnotation" id='pointAnnotation' coordinate={shape?.features[0]?.geometry?.coordinates[0] !== undefined ? [shape?.features[0]?.geometry?.coordinates[0], shape?.features[0]?.geometry?.coordinates[1]] : [-122.4194, 37.7749]} draggable onDragEnd={onCircleDrag}>
          <View
            style={{ height: CircleHeight, width: CircleWidth, borderWidth: 3, borderRadius: CircleHeight/2, borderColor: '#000000', backgroundColor: '#70448B', opacity: 0.5 }}
          >
          </View>
        </MapboxGL.PointAnnotation>

        {eventList.map((event: any, jindex) => (
          <MapboxGL.MarkerView
            coordinate={[event?.location?.coordinates[0], event?.location?.coordinates[1]]}
            id={event._id}
          >
            <TouchableOpacity onPress={() => onMarkerClick(jindex)}>
              <Image
                source={event?.isActive ? pin : pinWhite}
                style={{ width: 20, height: 20 }}
              /></TouchableOpacity>
          </MapboxGL.MarkerView>
        ))}
      </MapboxGL.MapView>

      <View style={styles.buttonCallout}>
        <TouchableOpacity style={[styles.touchable]} onPress={mapPlusClick}>
          <Image style={styles.plusClass} source={plus}></Image>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.touchable]} onPress={mapMinusClick}>
          <Image style={styles.plusClass} source={minus}></Image>
        </TouchableOpacity>
      </View>

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
