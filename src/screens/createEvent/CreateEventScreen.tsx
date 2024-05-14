/* eslint-disable react-hooks/exhaustive-deps */
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import {
  addGreen,
  arrowLeft,
  dummy,
  edit,
  onelogo,
  pinWhite,
  save,
  ticket,
} from "~/assets/images";

import { ImageComponent } from "~/components/image-component";
import { Input } from "~/components/input";
import { LocationAutocomplete } from "~/components/location-autocomplete/LocationAutocomplete";
import { ModalRefProps } from "~/components/modal-component";
import { Pill } from "~/components/pill";
import { SizedBox } from "~/components/sized-box";
import { navigations } from "~/config/app-navigation/constant";
import { normalScale, verticalScale } from "~/theme/device/normalize";
import { AddTicketModal } from "./AddTicketModal";
import { createStyleSheet } from "./style";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTime } from "luxon";
import { launchImageLibrary } from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-simple-toast";
import { useSelector } from "react-redux";
import { ButtonComponent } from "~/components/button-component";
import { ChooseDate } from "~/components/choose-date/ChooseDate";
import { Loader } from "~/components/loader";
import { LOG } from "~/config";
import { useCreateEvent } from "~/network/hooks/home-service-hooks/use-create-event";
import { useTicketHolderCheckinsList } from "~/network/hooks/home-service-hooks/use-ticket-holder-checkin-list";
import { useUpdateEvent } from "~/network/hooks/home-service-hooks/use-update-event";
import { StoreType } from "~/network/reducers/store";
import { UserProfileState } from "~/network/reducers/user-profile-reducer";
import { width } from "~/theme/device/device";
import { LocalEventData } from "~/types/local-event-data";
import { TicketType } from "~/types/ticket-type";
import { GetAdmintoolsDropDownScreen } from "./getAdmintoolsDropdown";

interface CreateEventScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      eventData?: LocalEventData;
      isCreateEvent: boolean;
    };
  };
}

export const CreateEventScreen = (props: CreateEventScreenProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const { navigation, route } = props || {};
  const { eventData, isCreateEvent } = route?.params ?? {};
  const styles = createStyleSheet(theme);
  // const modalRef: React.Ref<ModalRefProps> = useRef(null);
  const addItemRef: React.Ref<ModalRefProps> = useRef(null);
  const [isEdit, setIsEdit] = useState(false);

  const [startDate, setStartDate] = useState<DateTime>(
    route?.params.eventData?.start_date ??
      DateTime.now().startOf("hour").plus({ hour: 1 })
  );
  const [endDate, setEndDate] = useState(
    route?.params.eventData?.end_date ?? startDate.plus({ hour: 1 })
  );
  const [isEndDateActive, setEndDateActive] = useState(false);

  const [name, setName] = useState(route?.params.eventData?.name);
  const [about, setAbout] = useState(route?.params.eventData?.about);
  const [setFilter, SetToggleFilter] = useState("VF");
  const [eventDetails, setEventDetails] = useState(route?.params.eventData);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [fullAddress, setFullAddress] = useState(
    route?.params.eventData?.full_address
  );
  const [latitude, setLatitude] = useState(route?.params.eventData?.latitude);
  const [longitude, setLongitude] = useState(
    route?.params.eventData?.longitude
  );
  const {
    address,
    start_date,
    end_date,
    email_confirmation_body,
    id,
    viewCount,
    is_event_owner,
  } = eventDetails || {};
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { id: string; pic: string; city: string } };
  const [eventImage, setEventImage] = useState("");
  const [eventImageDisplay, setEventImageDisplay] = useState("");
  const { refetch, data } = useTicketHolderCheckinsList({
    eventId: id,
    queryParams: { pagination: false },
  });
  const { mutateAsync: updateEvent } = useUpdateEvent();
  const [isLoading, LodingData] = useState(false);
  const { mutateAsync: createEvent, isLoading: createEventLoading } =
    useCreateEvent();
  const [curTicket, setCurTicket] = useState<number | undefined>();

  // useEffect(() => {
  //   LogBox.ignoreAllLogs();
  //   // requestLocationPermission();
  //   setEventDetails({ ...eventDetails, start_date: startDateValue.toString() });
  // }, [startDateValue, endDateValue]);

  // useEffect(() => {
  //   if (!isCreateEvent) {
  //     refetch();
  //     if (eventData) {
  //       setEventDetails(eventData);
  //       if (eventData.event_image) {
  //         setEventImageDisplay(eventData.event_image);
  //       }
  //       if (eventData.event_image_id) {
  //         setEventImage(eventData.event_image_id);
  //       }
  //     }
  //   } else {
  //     setEventDetails({
  //       ...eventDetails,
  //       start_date: startDate,
  //       end_date: isEndDateVisible ? endDate : undefined,
  //     });
  //   }
  // }, [eventData]);

  // const requestLocationPermission = async () => {
  //   GetLocation.getCurrentPosition({
  //     enableHighAccuracy: false,
  //     timeout: 6000,
  //   })
  //     .then((location) => {
  //       setUserLocation(location);
  //       console.log(
  //         "---------------------location---------------------",
  //         location
  //       );
  //     })
  //     .catch((error) => {
  //       console.log("---------------------error---------------------", error);
  //       const { code, message } = error;
  //       console.log(code, message);
  //     });
  // };

  async function onCancleEvent(eventID: any) {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");

    console.log("=========== Cancle Event API Request ==============");
    console.log(process.env.API_URL + "/v1/events/cancel-event/" + eventID);
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/events/cancel-event/" + eventID,
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

  const checkValidation = () => {
    return !(
      (name && startDate && latitude && longitude)
      // tickets?.length &&
      // address &&
      // full_address &&
      // about &&
      // !!eventImageDisplay
    );
  };

  const onCreateEvent = async () => {
    LodingData(true);
    Keyboard.dismiss();
    const res = await createEvent({
      ...eventDetails,
      name: name!,
      about,
      start_date: startDate,
      end_date: isEndDateActive ? endDate : undefined,
      ticketTypes,
      event_image: eventImage ? eventImage : undefined,
      full_address: fullAddress!,
      latitude: latitude!,
      longitude: longitude!,
      // type: setFilter,
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
    var getTicket: any = ticketTypes?.map((ele) => ele?.id ?? "");
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
    request = { ...request, fullAddress };
    // }
    // if (start_date !== eventData?.start_date) {
    request = { ...request, startDate: start_date?.toString() };
    // }
    // if (end_date !== eventData?.end_date) {
    request = { ...request, endDate: end_date?.toString() };
    // }
    // if (email_confirmation_body !== eventData?.email_confirmation_body) {
    request = { ...request, emailConfirmationBody: email_confirmation_body };
    // }
    // if (about !== eventData?.about) {
    request = { ...request, about: about };
    // }
    request = { ...request, latitude: latitude?.toString() };
    request = { ...request, longitude: longitude?.toString() };

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

    const res = await updateEvent({ bodyParams: request, eventId: id });
    if (res?.success) {
      LodingData(false);
      navigation?.goBack();
    } else {
      LodingData(false);
    }
  };

  // const handleText = (text: string, key: string) => {
  //   setEventDetails({ ...eventDetails, [key]: text });
  // };

  const onTicketAdded = (ticket: TicketType) => {
    LOG.debug("> onTicketAdded", ticket);
    // setIsEdit(false);
    // modalRef.current?.onCloseModal();
    if (ticketTypes) {
      setTicketTypes([...ticketTypes, ticket]);
    } else {
      setTicketTypes([ticket]);
    }
    setCurTicket(undefined);

    LOG.debug("tickets.length", ticketTypes.length);

    // const eventDetailsCopy = { ...eventDetails };
    // if (isEdit) {
    //   const allTickets = [...(eventDetailsCopy?.tickets || [])];
    //   const index = allTickets.findIndex(
    //     (ele) => ele?.id === ticket?.id
    //   );
    //   allTickets.splice(index, 1, ticket);
    //   eventDetailsCopy.tickets = allTickets;
    // } else {
    //   const allTickets = [...(eventDetailsCopy?.tickets || [])];
    //   allTickets.push(ticket);
    //   eventDetailsCopy.tickets = allTickets;
    // }
    // setEventDetails(eventDetailsCopy);
  };

  // const onCancel = () => {
  //   setIsEdit(false);
  // };

  // const openCreateTicketModal = () => {
  //   // setIsEdit(false);
  //   modalRef.current?.onOpenModal();
  // };

  // // const openAddBreakDownModal = () => {
  // //   setIsEdit(false);
  // //   addItemRef.current?.onOpenModal();
  // // };

  // const openEditTicketModal = (index: number) => {
  //   setSelectedTicketIndex(index);
  //   setIsEdit(true);
  //   modalRef.current?.onOpenModal();
  // };

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

    console.log(process.env.API_URL + "/v1/users/upload/file");
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/users/upload/file",
        {
          method: "post",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(pic),
        }
      );
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

  // const toggleSwitch = (value: any) => {
  //   if (isEnabled === false) {
  //     setIsEnabled(true);
  //     SetToggleFilter("AO");
  //   } else {
  //     setIsEnabled(false);
  //     SetToggleFilter("VF");
  //   }
  // };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const ChooseStartAndEndDates = () => (
    <View>
      <ChooseDate date={startDate} setDate={setStartDate}>
        Start date
      </ChooseDate>

      {isEndDateActive ? (
        <ChooseDate date={endDate} setDate={setEndDate}>
          End date
        </ChooseDate>
      ) : (
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() => setEndDateActive(true)}
          style={{
            paddingHorizontal: normalScale(4),
            paddingVertical: verticalScale(4),
          }}
        >
          <Text>+ Add end date and time</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Pressable style={styles.container} onPress={keyboardDismiss}>
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
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            keyboardDismiss();
          }}
        >
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
            {/* <View style={styles.toggleContainer}>
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
            </View> */}
            <View style={styles.innerContainer}>
              <Input
                onChangeText={(text) => setName(text)}
                placeholder={strings.enterTitle}
                value={name}
              />
              <ChooseStartAndEndDates />
              <View style={[styles.row, styles.center]}>
                <View style={[styles.circularView, styles.yellow]}>
                  <ImageComponent source={pinWhite} style={styles.pinWhite} />
                </View>
                <SizedBox width={normalScale(8)} />

                {/*<View>
                  <Input
                    placeholder={strings.enterVenue}
                    inputStyle={styles.textStyle}
                    value={address}
                    onChangeText={(text) => handleText(text, "address")}
                    height={verticalScale(40)}
                  />
                  <SizedBox height={verticalScale(8)} /> */}
                {/* <Input
                placeholder={strings.enterAddress}
                inputStyle={styles.textStyle}
                value={full_address}
                onChangeText={text => handleText(text, 'full_address')}
                height={verticalScale(40)}
              /> */}
                <View style={{ width: width - 100 }}>
                  <LocationAutocomplete
                    address={fullAddress}
                    onPress={(data: any, details: any) => {
                      setFullAddress(data.description);
                      setLatitude(details!.geometry.location.lat);
                      setLongitude(details!.geometry.location.lng);
                    }}
                  >
                    Where will the event be held?
                  </LocationAutocomplete>

                  {/* </View> */}
                </View>
              </View>

              <Text style={styles.event}>{strings.aboutEvent}</Text>
              <SizedBox height={verticalScale(4)} />
              <Input
                placeholder={strings.enterAboutEvent}
                height={verticalScale(60)}
                multiline
                value={about}
                onChangeText={(text) => setAbout(text)}
              />
              <View style={[styles.row, styles.marginTop]}>
                <Text style={styles.tickets}>{strings.tickets}:</Text>
                <Pressable onPress={() => setCurTicket(ticketTypes.length)}>
                  <ImageComponent source={addGreen} style={styles.addGreen} />
                </Pressable>
              </View>
              <AddTicketModal
                isVisible={curTicket !== undefined}
                onSuccess={onTicketAdded}
                onDismiss={() => setCurTicket(undefined)}
                value={
                  curTicket === undefined ? undefined : ticketTypes[curTicket]
                }
                // eventId={id}
                // eventDetails={eventDetails}
                // value={eventDetails.tickets?.[selectedTicketIndex]}
                // ref={modalRef}
                // isEdit={isEdit}
                // onCancel={onCancel}
              />
              <View>
                {ticketTypes?.map((t, index) => {
                  return (
                    <View key={t.id || index} style={styles.rowOnly}>
                      <Text style={styles.ticket}>{`${t?.name} - ${
                        t.quantity ? t.quantity : "Unlimited"
                      } ${
                        t.price.gt(0) ? "@ $" + t.price.toFixed(2) : "Free"
                      }`}</Text>
                      <View style={styles.rowOnly}>
                        <Pressable onPress={() => setCurTicket(index)}>
                          <ImageComponent source={edit} style={styles.edit} />
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            setTicketTypes(
                              ticketTypes.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <Text style={styles.delete}>X</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
              {/* <Text style={styles.tickets}>{strings.confirmationEmail}:</Text>
              <SizedBox height={verticalScale(4)} />
              {email_confirmation_body ? (
                <Input
                  placeholder={strings.enterEmail}
                  height={verticalScale(60)}
                  multiline
                  value={email_confirmation_body!}
                  onChangeText={(text) =>
                    handleText(text, "email_confirmation_body")
                  }
                />
              ) : null} */}
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

            {id && is_event_owner ? (
              <View>
                <GetAdmintoolsDropDownScreen
                  eventId={id}
                  navigation={navigation}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onCancleEvent(id)}
                  style={styles.cancleEventBtn}
                >
                  <Text style={styles.cancleEventText}>
                    {strings.cancleEvent}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
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

      {/* <BreakDownModal ref={addItemRef} id={''} revenue={0} expense={0} profilt={0} payout={0} remainingAmt={0} userId={''}></BreakDownModal> */}

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
    </Pressable>
  );
};
