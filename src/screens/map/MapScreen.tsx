import React, {
  LegacyRef,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { Map } from "~/components/map/Map";
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
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ImageComponent } from "~/components/image-component";
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
} from "~/assets/images";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "~/network/reducers/store";
import {
  UserProfileState,
  onSetUser,
} from "~/network/reducers/user-profile-reducer";
import {
  useUserProfile,
  userProfileParsedData,
} from "~/network/hooks/user-service-hooks/use-user-profile";
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from "@react-navigation/native";
import { navigations } from "~/config/app-navigation/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import GetLocation from "react-native-get-location";
import { Loader } from "~/components/loader";
import Swiper from "react-native-swiper";
import MapboxGL, { Callout, CircleLayer, MarkerView } from "@rnmapbox/maps";
import Toast from "react-native-simple-toast";

const { user } = useSelector<StoreType, UserProfileState>(
  (state) => state.userProfileReducer
) as { user: { id: string; pic: string } };
const { refetch } = useUserProfile({
  userId: user?.id,
});
const dispatch = useDispatch();

MapboxGL.setAccessToken(process.env.MAP_ACCESS_TOKEN!);

import { getData, setData } from "~/network/constant";
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from "react-native-android-location-enabler";

interface MapScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const MapScreen = (props: MapScreenProps) => {
  const { theme } = useAppTheme();

  // const onNavigateToProfile = () => {
  //   if (user?.id) {
  //     refetch().then((res) => {
  //       const userData = userProfileParsedData(res?.data?.data);
  //       dispatch(onSetUser(userData));
  //     });
  //   }
  //   props.navigation.navigate(navigations.PROFILE);
  // };

  // const onNavigateEventDetail = (item: any) => {
  //   props.navigation.navigate(navigations.EVENT_DETAIL, { id: item?._id });
  // };

  return <Map />;
};
