/* eslint-disable react-hooks/exhaustive-deps */
import { useAppTheme } from "~/app-hooks/use-app-theme";
import React, { useEffect, useRef, useState } from "react";
import { createStyleSheet } from "./style";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import {
  Alert,
  Keyboard,
  LogBox,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "~/components/header";
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import { Pill } from "~/components/pill";
import {
  Search,
  addGreen,
  arrowLeft,
  bell,
  calendarTime,
  dummy,
  edit,
  onelogo,
  pinWhite,
  save,
  sendPayoutImg,
  ticket,
} from "~/assets/images";
import { SizedBox } from "~/components/sized-box";
import { normalScale, verticalScale } from "~/theme/device/normalize";
import { Input } from "~/components/input";
import { ImageComponent } from "~/components/image-component";
import { AddTicketModal } from "./add-ticket-modal";
import { ModalRefProps } from "~/components/modal-component";
import { navigations } from "~/config/app-navigation/constant";
import {
  Result,
  Ticket,
} from "~/network/hooks/home-service-hooks/use-event-lists";
import moment from "moment";
import { formatPrice } from "~/utils/common";
import {
  DatePickerRefProps,
  DateRangePicker,
} from "~/components/date-range-picker";
import { useTicketHolderCheckinsList } from "~/network/hooks/home-service-hooks/use-ticket-holder-checkin-list";
import { useUpdateEvent } from "~/network/hooks/home-service-hooks/use-update-event";
import { Loader } from "~/components/loader";
import { ButtonComponent } from "~/components/button-component";
import { TicketBodyParamProps } from "~/network/api/services/home-service";
import { useCreateEvent } from "~/network/hooks/home-service-hooks/use-create-event";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useSelector } from "react-redux";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { useUserProfile } from "~/network/hooks/user-service-hooks/use-user-profile";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GetLocation from "react-native-get-location";
import { DatePickerModal } from "react-native-paper-dates";
import Toast from "react-native-simple-toast";
import { API_URL } from "~/network/constant";
import { Switch } from "react-native";
import { AddPayoutExpenseModel } from "./addPayoutExpense-modal";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GetAdmintoolsDropDownScreen } from "./getAdmintoolsDropdown";
import { ScrollView } from "react-native-gesture-handler";
import { width } from "~/theme/device/device";
import { Platform } from "react-native";
import ActiveEnv from "~/config/env/env.dev.json";
import { emailRegexEx } from "~/assets/constants";

interface AdminToolsScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      eventData: Result;
      isCreateEvent: boolean;
    };
  };
}

export const AdminToolsScreen = (props: AdminToolsScreenProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const { navigation, route } = props || {};
  const { eventData, isCreateEvent } = route?.params ?? {};
  const styles = createStyleSheet(theme);
  const modalRef: React.Ref<ModalRefProps> = useRef(null);
  const addItemRef: React.Ref<ModalRefProps> = useRef(null);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  var [location, setUserLocation]: any = useState();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isBreakDown, setIsBreakDown] = useState(false);
  const [setFilter, SetToggleFilter] = useState("VF");
  const [eventDetails, setEventDetails] = useState<Result>(
    (eventData as Result) || {}
  );
  const {
    name,
    address,
    lat,
    long,
    start_date,
    end_date,
    tickets,
    email_confirmation_body,
    id,
    full_address,
    isPayout,
    viewCount,
    about,
    is_event_owner,
  } = eventDetails || {};
  const datePickerRefStart: React.Ref<DatePickerRefProps> = useRef(null);
  const datePickerRefend: React.Ref<DatePickerRefProps> = useRef(null);
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { id: string; pic: string; city: string } };
  const [eventImage, setEventImage] = useState("");
  const [eventImageDisplay, setEventImageDisplay] = useState("");
  const { refetch, data } = useTicketHolderCheckinsList({
    eventId: id,
    queryParams: { pagination: false },
  });
  const { mutateAsync } = useUpdateEvent();
  const [isLoading, LodingData] = useState(false);
  const [setLocation, setAddressLocation]: any = useState();
  const { mutateAsync: createEvent, isLoading: createEventLoading } =
    useCreateEvent();

  console.log(
    start_date,
    "-----------------event detail start date------------------"
  );
  console.log(
    end_date,
    "-----------------event detail end date------------------"
  );
  useEffect(() => {
    LogBox.ignoreAllLogs();
    // requestLocationPermission();
    setEventDetails({ ...eventDetails, start_date: startDateValue.toString() });
  }, [startDateValue, endDateValue]);

  useEffect(() => {
    if (!isCreateEvent) {
      refetch();
      if (eventData) {
        setEventDetails(eventData);
        setEventImageDisplay(eventData?.event_image);
        setEventImage(eventData?.event_image_id);
      }
    } else {
      setEventDetails({
        ...eventDetails,
        start_date: new Date().toString(),
        end_date: new Date().toString(),
      });
    }
  }, [eventData]);

  const requestLocationPermission = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 6000,
    })
      .then((location) => {
        setUserLocation(location);
        console.log(
          "---------------------location---------------------",
          location
        );
      })
      .catch((error) => {
        console.log("---------------------error---------------------", error);
        const { code, message } = error;
        console.log(code, message);
      });
  };

  async function onCancleEvent(eventID: any) {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");

    console.log("=========== Cancle Event API Request ==============");
    console.log(API_URL + "/v1/events/cancel-event/" + eventID);
    try {
      const response = await fetch(
        API_URL + "/v1/events/cancel-event/" + eventID,
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            Accept: "application/json",
          }),
        }
      );
      const dataItem = await response.json();
      console.log("=========== Cancle Event API Response ==============");
      console.log(dataItem);

      Toast.show(dataItem?.message, Toast.LONG, {
        backgroundColor: "black",
      });
      if (dataItem?.success === true) {
        LodingData(false);
        navigation?.goBack();
      } else {
        LodingData(false);
      }

      // postListAPI();
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  const onBackPress = () => {
    navigation?.goBack();
  };

  const onNavigate = () => {
    navigation?.navigate(navigations.CHECK_IN, { eventId: id });
  };

  const onConfirmStartDateTime = (startDate: Date) => {
    setEventDetails({ ...eventDetails, start_date: startDate.toString() });
    setStartDateValue(startDate);
    datePickerRefStart.current?.onOpenModal("start");
  };

  const onConfirmEndDateTime = (endDate: Date) => {
    setEventDetails({ ...eventDetails, end_date: endDate.toString() });
    setEndDateValue(endDate);
    datePickerRefend.current?.onOpenModal("end");
  };

  const getDate = (date = new Date().toString()) => {
    return `${moment(date).format("ddd, MMM DD • hh:mm A")}`;
  };

  const checkValidation = () => {
    return !(
      name &&
      // tickets?.length &&
      address &&
      full_address &&
      about &&
      !!eventImageDisplay
    );
  };

  const onCreateEvent = async () => {
    var getTicket: any = [];
    if (tickets?.length) {
      console.log("is ticket", tickets?.length);
      getTicket = tickets?.map((ele) => ele?.id ?? "");
      var ticketArray = getTicket.join(",");
    } else {
      console.log("not is ticket");
      var ticketArray: any = "";
    }

    LodingData(true);
    Keyboard.dismiss();
    const res = await createEvent({
      bodyParams: {
        ...eventDetails,
        tickets: ticketArray,
        eventImage,
        latitude: lat?.toString(),
        longitude: long?.toString(),
        type: setFilter,
      },
    });
    console.log(res);
    if (res?.success) {
      LodingData(false);
      navigation?.goBack();
    } else {
      LodingData(false);
    }
  };

  const onUpdateEvent = async () => {
    var getTicket: any = tickets?.map((ele) => ele?.id ?? "");
    LodingData(true);
    Keyboard.dismiss();
    let request = {};
    // if (name !== eventData?.name) {
    request = { ...request, name };
    // }
    // if (address !== eventData?.address) {
    request = { ...request, address };
    // }
    // if (full_address !== eventData?.full_address) {
    request = { ...request, full_address };
    // }
    // if (start_date !== eventData?.start_date) {
    request = { ...request, startDate: start_date.toString() };
    // }
    // if (end_date !== eventData?.end_date) {
    request = { ...request, endDate: end_date.toString() };
    // }
    // if (email_confirmation_body !== eventData?.email_confirmation_body) {
    request = { ...request, emailConfirmationBody: email_confirmation_body };
    // }
    // if (about !== eventData?.about) {
    request = { ...request, about: about };
    // }
    request = { ...request, latitude: lat?.toString() };
    request = { ...request, longitude: long?.toString() };

    request = { ...request, type: setFilter };
    // }
    request = {
      ...request,
      tickets: getTicket.join(","),
      eventImage,
    };

    if (Object.keys(request).length === 0) {
      Alert.alert("", strings.pleaseEdit);
      return;
    }

    const res = await mutateAsync({ bodyParams: request, eventId: id });
    if (res?.success) {
      LodingData(false);
      navigation?.goBack();
    } else {
      LodingData(false);
    }
  };

  const handleText = (text: string, key: string) => {
    setEventDetails({ ...eventDetails, [key]: text });
  };

  const onSuccessfulTicketCreation = (ticketDetails: TicketBodyParamProps) => {
    setIsEdit(false);
    modalRef.current?.onCloseModal();
    const eventDetailsCopy = { ...eventDetails };
    if (isEdit) {
      const allTickets = [...(eventDetailsCopy?.tickets || [])];
      const index = allTickets.findIndex(
        (ele) => ele?.id === ticketDetails?.id
      );
      allTickets.splice(index, 1, ticketDetails);
      eventDetailsCopy.tickets = allTickets;
    } else {
      const allTickets = [...(eventDetailsCopy?.tickets || [])];
      allTickets.push(ticketDetails);
      eventDetailsCopy.tickets = allTickets;
    }
    setEventDetails(eventDetailsCopy);
  };

  const onCancel = () => {
    setIsEdit(false);
  };

  const openCreateTicketModal = () => {
    setIsEdit(false);
    modalRef.current?.onOpenModal();
  };

  const openAddBreakDownModal = () => {
    setIsEdit(false);
    addItemRef.current?.onOpenModal();
  };

  const openEditTicketModal = (index: number) => {
    setSelectedTicketIndex(index);
    setIsEdit(true);
    modalRef.current?.onOpenModal();
  };

  const onUploadImage = async () => {
    const { assets } = await launchImageLibrary({
      mediaType: "photo",
      includeBase64: true,
      maxWidth: 800,
      maxHeight: 800,
    });
    if (assets) {
      const img = assets?.[0];
      var fileNameTwo = img?.fileName ?? "";
      LodingData(true);
      var output =
        fileNameTwo.substr(0, fileNameTwo.lastIndexOf(".")) || fileNameTwo;
      var base64Two = img?.base64 ?? "";
      ProfileImageUploadAPI(output, base64Two);
    }
  };

  const ProfileImageUploadAPI = async (fileItem: any, base64Item: any) => {
    var pic: any = {
      uploadKey: "create_event_image",
      imageName: fileItem,
      base64String: "data:image/jpeg;base64," + base64Item,
    };

    console.log(API_URL + "/v1/users/upload/file");
    try {
      const response = await fetch(API_URL + "/v1/users/upload/file", {
        method: "post",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(pic),
      });
      const dataItem = await response.json();
      LodingData(false);
      setEventImage(dataItem?.data?.key);
      setEventImageDisplay(dataItem?.data?.imageUrl);
      console.log(dataItem);
    } catch (error) {
      LodingData(false);
      console.log(error);
    }
  };

  const onNavigateToProfile = () => {
    navigation?.navigate(navigations.PROFILE);
  };

  const toggleSwitch = (value: any) => {
    if (isEnabled === false) {
      setIsEnabled(true);
      SetToggleFilter("AO");
    } else {
      setIsEnabled(false);
      SetToggleFilter("VF");
    }
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={keyboardDismiss}
    >
      <Loader visible={isLoading || createEventLoading} showOverlay />
      <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
        <TouchableOpacity onPress={onBackPress} style={{ zIndex: 11111222222 }}>
          <View style={styles.row2}>
            <ImageComponent source={arrowLeft} style={styles.arrowLeft} />
          </View>
        </TouchableOpacity>
        <View style={styles.oneContainer}>
          <ImageComponent
            style={styles.oneContainerImage}
            source={onelogo}
          ></ImageComponent>
          <View>
            <Text style={styles.oneContainerText}>NE</Text>
            <Text style={styles.localText}>L o c a l</Text>
            {/* <Text style={styles.localText}>[Local]</Text> */}
          </View>
        </View>
        <View style={styles.profileContainer}>
          {/* <ImageComponent
              style={styles.bellIcon}
              source={bell}></ImageComponent> */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNavigateToProfile}
            style={styles.profileView}
          >
            <ImageComponent
              resizeMode="cover"
              isUrl={!!user?.pic}
              source={dummy}
              uri={user?.pic}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        <TouchableOpacity activeOpacity={1} onPress={keyboardDismiss}>
          <View>
            <TouchableOpacity activeOpacity={0.8} onPress={onUploadImage}>
              <ImageComponent
                isUrl={!!eventImageDisplay}
                resizeMode="cover"
                uri={eventImageDisplay}
                source={dummy}
                style={styles.profile}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onUploadImage}
                style={styles.add}
              >
                <ImageComponent source={addGreen} style={styles.addGreen} />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.pillContainer}>
              <Pill
                label={strings.adminTools}
                backgroundColor={theme.colors.white}
                foreGroundColor={theme.colors.black}
                icon={ticket}
                disabled
              />
            </View>

            <SizedBox height={verticalScale(6)} />
            {!isCreateEvent && (
              <Pill
                label={strings.checkIns}
                backgroundColor={theme.colors.lightRed}
                pillStyle={styles.checkIn}
                onPressPill={onNavigate}
              />
            )}
            <View style={styles.toggleContainer}>
              <Text style={styles.villageLblTwo}>Village Friendly </Text>
              <View style={styles.switchToggle}>
                {Platform.OS === "ios" ? (
                  <Switch
                    style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.5 }] }}
                    thumbColor={"white"}
                    ios_backgroundColor="#008000"
                    onChange={() => toggleSwitch(isEnabled)}
                    value={isEnabled}
                  />
                ) : (
                  <Switch
                    style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.0 }] }}
                    trackColor={{ false: "#008000", true: "#008000" }}
                    thumbColor={"white"}
                    ios_backgroundColor="#008000"
                    onChange={() => toggleSwitch(isEnabled)}
                    value={isEnabled}
                  />
                )}
              </View>
              <Text style={styles.villageLblTwo}> Adult Oriented</Text>
            </View>
            <View style={styles.innerContainer}>
              <Input
                onChangeText={(text) => handleText(text, "name")}
                placeholder={strings.enterTitle}
                value={name}
              />
              <View style={styles.row}>
                <View style={styles.circularView}>
                  <ImageComponent
                    source={calendarTime}
                    style={styles.calendarTime}
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    datePickerRefStart.current?.onOpenModal("start")
                  }
                  style={styles.margin}
                >
                  <Text style={styles.time}>Start Date</Text>
                  <Text style={styles.time}>{`- ${moment(start_date).format(
                    "MMM DD YYYY (hh:mm A)"
                  )}`}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <View style={styles.circularView}>
                  <ImageComponent
                    source={calendarTime}
                    style={styles.calendarTime}
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => datePickerRefend.current?.onOpenModal("end")}
                  style={styles.margin}
                >
                  <Text style={styles.time}>End Date</Text>
                  <Text style={styles.time}>{`- ${moment(end_date).format(
                    "MMM DD YYYY (hh:mm A)"
                  )}`}</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.row, styles.center]}>
                <View style={[styles.circularView, styles.yellow]}>
                  <ImageComponent source={pinWhite} style={styles.pinWhite} />
                </View>
                <SizedBox width={normalScale(8)} />
                <View>
                  <Input
                    placeholder={strings.enterVenue}
                    inputStyle={styles.textStyle}
                    value={address}
                    onChangeText={(text) => handleText(text, "address")}
                    height={verticalScale(40)}
                  />
                  <SizedBox height={verticalScale(8)} />
                  {/* <Input
                placeholder={strings.enterAddress}
                inputStyle={styles.textStyle}
                value={full_address}
                onChangeText={text => handleText(text, 'full_address')}
                height={verticalScale(40)}
              /> */}
                  <View style={{ width: width - 100 }}>
                    <GooglePlacesAutocomplete
                      styles={{
                        textInput: {
                          backgroundColor: "#E8E8E8",
                          height: 35,
                          borderRadius: 10,
                          color: "black",
                          fontSize: 14,
                          borderColor: theme.colors.black,
                          borderWidth: theme.borderWidth.borderWidth1,
                          placeholderTextColor: theme.colors.black,
                        },
                        listView: {
                          color: "black", //To see where exactly the list is
                          zIndex: 10000000, //To popover the component outwards
                          // position: 'absolute',
                          // top: 45
                        },
                        predefinedPlacesDescription: {
                          color: "black",
                        },
                        description: {
                          color: "black",
                          fontSize: 14,
                        },
                      }}
                      listViewDisplayed={false}
                      textInputProps={{
                        placeholderTextColor: "gray",
                      }}
                      placeholder="where is this offer located?"
                      GooglePlacesDetailsQuery={{ fields: "geometry" }}
                      fetchDetails={true}
                      onPress={(data: any, details = null) => {
                        setEventDetails({
                          ...eventDetails,
                          full_address: data.description,
                          lat: details?.geometry?.location.lat,
                          long: details?.geometry?.location.lng,
                        });
                      }}
                      query={{
                        key: ActiveEnv.GOOGLE_KEY, // client
                      }}
                      currentLocationLabel="Current location"
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.event}>{strings.aboutEvent}</Text>
              <SizedBox height={verticalScale(4)} />
              <Input
                placeholder={strings.enterAboutEvent}
                height={verticalScale(60)}
                multiline
                value={about}
                onChangeText={(text) => handleText(text, "about")}
              />
              <View style={[styles.row, styles.marginTop]}>
                <Text style={styles.tickets}>{strings.tickets}:</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={openCreateTicketModal}
                >
                  <ImageComponent source={addGreen} style={styles.addGreen} />
                </TouchableOpacity>
              </View>
              <View>
                {tickets?.map((ele, index) => (
                  <View key={ele?.price.toString()} style={styles.rowOnly}>
                    <Text style={styles.ticket}>{`${ele?.name} - ${
                      ele?.price
                    } - (ends ${getDate(ele?.end_date)})`}</Text>
                    <TouchableOpacity
                      onPress={() => openEditTicketModal(index)}
                      activeOpacity={0.8}
                    >
                      <ImageComponent source={edit} style={styles.edit} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <Text style={styles.tickets}>{strings.confirmationEmail}:</Text>
              <SizedBox height={verticalScale(4)} />
              <Input
                placeholder={strings.enterEmail}
                height={verticalScale(60)}
                multiline
                value={email_confirmation_body}
                onChangeText={(text) =>
                  handleText(text, "email_confirmation_body")
                }
              />
              <SizedBox height={verticalScale(8)} />
              {!isCreateEvent && (
                <>
                  <Text style={styles.tickets}>{strings.attendees}:</Text>
                  <SizedBox height={verticalScale(5)} />
                  {(data?.results || []).length > 0 ? (
                    (data?.results || [])?.map((item) => (
                      <Text key={item?._id} style={styles.attendee}>
                        {item?.is_app_user
                          ? `${item?.user?.first_name} ${item?.user?.last_name}`
                          : item?.user?.name}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.noAttendee}>{strings.noAttendees}</Text>
                  )}
                  <SizedBox height={20}></SizedBox>

                  {/* <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onCancleEvent(id)}
                  style={styles.cancleEventBtn}>
                  <Text style={styles.cancleEventText}>
                    {strings.cancleEvent}
                  </Text>
                </TouchableOpacity> */}
                </>
              )}
            </View>

            {is_event_owner ? (
              <View style={styles.uniqueViewCont}>
                <Text style={styles.uniqueViewLbl}>Unique Views</Text>
                <Text style={styles.uniqueCount}>{viewCount}</Text>
              </View>
            ) : (
              <></>
            )}

            <GetAdmintoolsDropDownScreen eventId={id} navigation={navigation} />
            {is_event_owner ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onCancleEvent(id)}
                style={styles.cancleEventBtn}
              >
                <Text style={styles.cancleEventText}>
                  {strings.cancleEvent}
                </Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <View style={styles.bottomButton}>
        <ButtonComponent
          onPress={isCreateEvent ? onCreateEvent : onUpdateEvent}
          icon={save}
          title={strings.save}
          disabled={checkValidation()}
        />
      </View>

      <AddTicketModal
        onSuccessfulTicketCreation={onSuccessfulTicketCreation}
        eventId={id}
        eventDetails={eventDetails}
        ticketData={eventDetails?.tickets?.[selectedTicketIndex]}
        ref={modalRef}
        isEdit={isEdit}
        onCancel={onCancel}
      />

      {/* <BreakDownModal ref={addItemRef} id={''} revenue={0} expense={0} profilt={0} payout={0} remainingAmt={0} userId={''}></BreakDownModal> */}

      <DateRangePicker
        selectStartDate={onConfirmStartDateTime}
        ref={datePickerRefStart}
      />

      <DateRangePicker
        selectEndDate={onConfirmEndDateTime}
        ref={datePickerRefend}
      />

      {/* <DatePickerModal
          locale="en"
          mode="range"
          visible={open}
          onDismiss={onDismiss}
          startDate={range.startDate}
          endDate={range.endDate}
          onConfirm={onConfirm}
          validRange={{ startDate: new Date() }}
          editIcon="none"
          // closeIcon='none'
        /> */}
    </TouchableOpacity>
  );
};
