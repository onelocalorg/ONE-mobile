import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createStyleSheet} from './style';
import {useAppTheme} from '@app-hooks/use-app-theme';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  LogBox,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {ImageComponent} from '@components/image-component';
import {
  Gratis,
  Search,
  Vector,
  activeRadio,
  addGreen,
  arrowDown,
  bell,
  blackOffer,
  buttonArrowGreen,
  calendar,
  close,
  closeCard,
  comment,
  dummy,
  gratitudeBlack,
  greenOffer,
  logoblack,
  mapEvent,
  mapGifting,
  mapService,
  minus,
  money,
  moving,
  onelogo,
  painting,
  pin,
  plus,
  postCalender,
  request,
  send,
} from '@assets/images';
import {useDispatch, useSelector} from 'react-redux';
import {StoreType} from '@network/reducers/store';
import {
  UserProfileState,
  onSetUser,
} from '@network/reducers/user-profile-reducer';
import {
  useUserProfile,
  userProfileParsedData,
} from '@network/hooks/user-service-hooks/use-user-profile';
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {navigations} from '@config/app-navigation/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';
import {DatePickerModal, TimePickerModal} from 'react-native-paper-dates';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import GetLocation from 'react-native-get-location';
import {Loader} from '@components/loader';
import Popover, {PopoverPlacement, Rect} from 'react-native-popover-view';
import {SizedBox} from '@components/sized-box';
import {verticalScale} from '@theme/device/normalize';
import {
  DatePickerRefProps,
  DateRangePicker,
} from '@components/date-range-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Toast from 'react-native-simple-toast';
import GestureRecognizer from 'react-native-swipe-gestures';
import {Result} from '@network/hooks/home-service-hooks/use-event-lists';

interface ChatScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

interface Range {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const ChatScreen = (props: ChatScreenProps) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {strings} = useStringsAndLabels();

return(
  <View style={styles.container}>
    <Text style={styles.text}>{strings.comingSoon}</Text>
  </View>
)
};
