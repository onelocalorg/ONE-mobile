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
import ActiveEnv from '@config/env/env.dev.json';
import MapboxGL, { Callout, CircleLayer, MarkerView } from '@rnmapbox/maps';


MapboxGL.setAccessToken(ActiveEnv.MAP_ACCESS_TOKEN);

import { API_URL } from "@network/constant";

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
  var [radius, setRadius] = useState(25);
  var [radiusTwo, setRadiusTwo] = useState(25);
  var [eventData, eventDetail]: any = useState([]);
  var [location, setUserLocation]: any = useState();
  var [latitude, setLatitude]: any = useState();
  var [longitude, setLongitude]: any = useState();
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
  const mapRef: LegacyRef<MapboxGL.MapView> = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    LogBox.ignoreAllLogs();
    if(location?.latitude && location?.longitude){
      geoTaggingAPITwo()
    }
  }, [radiusTwo]);

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

  async function geoTaggingAPITwo() {
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      start_date: moment(range.startDate).format("YYYY-MM-DD"),
      end_date: moment(range.endDate).format("YYYY-MM-DD"),
      type: eventType,
      user_lat: latitude,
      user_long: longitude,
      radius: radiusTwo,
    };
    console.log('geoTaggingAPITwo request',data);
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
    console.log(event,'event')
    setLongitude(event.geometry.coordinates[0]);
    setLatitude(event.geometry.coordinates[1]);
    const newZoomLevel = event.properties.zoomLevel;
    let integerValue = parseInt(newZoomLevel);
    console.log(integerValue)
    setCameraZoomLevel(integerValue)
    if (integerValue === 14) {
      setRadiusTwo(1)
    } else if (integerValue === 13) {
      setRadiusTwo(2)
    } else if (integerValue === 12) {
      setRadiusTwo(3)
    } else if (integerValue === 11) {
      setRadiusTwo(4)
    } else if (integerValue === 10) {
      setRadiusTwo(8)
    } else if (integerValue === 9) {
      setRadiusTwo(20)
    } else if (integerValue === 8) {
      setRadiusTwo(40)
    } else if (integerValue === 7) {
      setRadiusTwo(80)
    } else if (integerValue === 6) {
      setRadiusTwo(160)
    } else if (integerValue === 5) {
      setRadiusTwo(320)
    } 
    console.log('Zoom level:', JSON.stringify(newZoomLevel));
    console.log(JSON.stringify(event))
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
    LodingData(true)
    setLongitude(event.geometry.coordinates[0]);
    setLatitude(event.geometry.coordinates[1]);
    geoTaggingAPITwo()
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
      logoEnabled={false}
      scaleBarEnabled={true}
      ref={mapRef}
      >
        <MapboxGL.UserLocation />
        {location?.latitude && location?.longitude ? <View>
          <MapboxGL.Camera
            zoomLevel={9}
            maxZoomLevel={14}
            minZoomLevel={5}
            followUserLocation={false}
            centerCoordinate={shape?.features[0]?.geometry?.coordinates[0] !== undefined ? [shape?.features[0]?.geometry?.coordinates[0], shape?.features[0]?.geometry?.coordinates[1]] : [-122.4194, 37.7749]}
          />
        </View> : <></>}

        <MapboxGL.PointAnnotation style={{flex:1}} key="pointAnnotation" id='pointAnnotation' coordinate={shape?.features[0]?.geometry?.coordinates[0] !== undefined ? [shape?.features[0]?.geometry?.coordinates[0], shape?.features[0]?.geometry?.coordinates[1]] : [-122.4194, 37.7749]} draggable onDragEnd={onCircleDrag}>
          <View
            style={{ height: 200, width: 200, borderWidth: 3, borderRadius: 200/2, borderColor: 'black', backgroundColor: 'rgba(112, 68, 139, 0.7)'}}
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
              resizeMode="contain"
                source={event?.isActive ? redPin : blackPin}
                style={{ width: 20, height: 20 }}
              /></TouchableOpacity>
          </MapboxGL.MarkerView>
        ))}
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
