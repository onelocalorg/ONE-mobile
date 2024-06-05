/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import _ from "lodash/fp";
import { DateTime } from "luxon";
import React, { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { addGreen, dummy, edit, pinWhite, save, ticket } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { ChooseDate } from "~/components/choose-date/ChooseDate";
import { ImageComponent } from "~/components/image-component";
import { Input } from "~/components/input";
import { Loader } from "~/components/loader";
import { LocationAutocomplete } from "~/components/location-autocomplete/LocationAutocomplete";
import { ModalRefProps } from "~/components/modal-component";
import { Navbar } from "~/components/navbar/Navbar";
import { Pill } from "~/components/pill";
import { SizedBox } from "~/components/sized-box";
import { LOG } from "~/config";
import { navigations } from "~/config/app-navigation/constant";
import { createEvent, updateEvent } from "~/network/api/services/event-service";
import { useTicketHolderCheckinsList } from "~/network/hooks/home-service-hooks/use-ticket-holder-checkin-list";
import { width } from "~/theme/device/device";
import { normalScale, verticalScale } from "~/theme/device/normalize";
import { isLocalEvent } from "~/types/local-event";
import { LocalEventData } from "~/types/local-event-data";
import { LocalEventUpdateData } from "~/types/local-event-update-data";
import { TicketTypeData } from "~/types/ticket-type-data";
import { handleApiError } from "~/utils/common";
import { AddTicketModal } from "./AddTicketModal";
import { GetAdmintoolsDropDownScreen } from "./getAdmintoolsDropdown";
import { createStyleSheet } from "./style";

interface CreateEditEventScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      eventData?: LocalEventData;
    };
  };
}

export const CreateEditEventScreen = ({
  route,
  navigation,
}: CreateEditEventScreenProps) => {
  const event = route?.params.eventData;
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const isCreateEvent = !route?.params.eventData;
  const eventId = route?.params.eventData?.id;
  const viewCount = isLocalEvent(route?.params.eventData)
    ? route?.params.eventData.viewCount
    : undefined;
  const isEventOwner = isLocalEvent(route?.params.eventData)
    ? route?.params.eventData.is_event_owner
    : undefined;
  const styles = createStyleSheet(theme);
  // const modalRef: React.Ref<ModalRefProps> = useRef(null);
  const addItemRef: React.Ref<ModalRefProps> = useRef(null);

  const [startDate, setStartDate] = useState<DateTime>(
    route?.params.eventData?.startDate ??
      DateTime.now().startOf("hour").plus({ hour: 1 })
  );
  const [endDate, setEndDate] = useState<DateTime>();
  const [isEndDateActive, setEndDateActive] = useState(false);

  const [name, setName] = useState(route?.params.eventData?.name);
  const [about, setAbout] = useState(route?.params.eventData?.about);
  const [setFilter, SetToggleFilter] = useState("VF");
  const [eventDetails, setEventDetails] = useState(route?.params.eventData);
  const [ticketTypes, setTicketTypes] = useState(
    route?.params.eventData?.ticketTypes || []
  );
  const [isTicketTypesDirty, setTicketTypesDirty] = useState(false);
  const [fullAddress, setFullAddress] = useState(
    route?.params.eventData?.fullAddress
  );
  const [latitude, setLatitude] = useState(route?.params.eventData?.latitude);
  const [longitude, setLongitude] = useState(
    route?.params.eventData?.longitude
  );
  const [eventImage, setEventImage] = useState<string>();
  const [eventImageDisplay, setEventImageDisplay] = useState<string>();
  const { refetch, data } = useTicketHolderCheckinsList({
    eventId: event?.id,
    queryParams: { pagination: false },
  });
  const [isLoading, setLoading] = useState(false);
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

  async function onCancelEvent(eventID: any) {
    setLoading(true);
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
        setLoading(false);
        navigation?.navigate(navigations.EVENT_ROUTE);
      } else {
        setLoading(false);
      }

      // postListAPI();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  // const onNavigate = () => {
  //   navigation?.navigate(navigations.CHECK_IN, { eventId: id });
  // };

  const isValid = () => {
    return !(
      (name && startDate && latitude && longitude)
      // tickets?.length &&
      // address &&
      // full_address &&
      // about &&
      // !!eventImageDisplay
    );
  };

  const handleCreateEvent = async () => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      if (name && latitude && longitude) {
        await createEvent({
          ...eventDetails,
          name,
          about,
          startDate,
          endDate: isEndDateActive ? endDate : undefined,
          ticketTypes,
          eventImage,
          fullAddress,
          latitude,
          longitude,
          // type: setFilter,
        });
        navigation?.goBack();
      }
    } catch (e) {
      handleApiError("Failed to create event", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async () => {
    // var getTicket: any = ticketTypes?.map((ele) => ele?.id ?? "");
    setLoading(true);
    Keyboard.dismiss();
    const data: LocalEventUpdateData = {
      name: name !== event?.name ? name : undefined,
      fullAddress: fullAddress !== event?.fullAddress ? fullAddress : undefined,
      startDate: startDate !== event?.startDate ? startDate : undefined,
      endDate: endDate !== event?.endDate ? endDate : undefined,
      eventImage: eventImage !== event?.eventImage ? eventImage : undefined,
      // emailConfirmationBody: emailConfirmationBody !== event?.emailConfirmationBody ? emailConfirmationBody : undefined,
      about: about !== event?.about ? about : undefined,
      latitude: latitude !== event?.latitude ? latitude : undefined,
      longitude: longitude !== event?.longitude ? longitude : undefined,
      ticketTypes: isTicketTypesDirty ? ticketTypes : undefined,
    };

    if (_.isEmpty(data)) {
      Alert.alert("", strings.pleaseEdit);
      return;
    }

    try {
      await updateEvent(eventId!, data);
      navigation?.goBack();
    } catch (e: any) {
      handleApiError("Failed to update event", e);
    } finally {
      setLoading(false);
    }
  };

  // const handleText = (text: string, key: string) => {
  //   setEventDetails({ ...eventDetails, [key]: text });
  // };

  const onTicketAdded = (ticket: TicketTypeData) => {
    LOG.debug("> onTicketAdded", ticket);
    // setIsEdit(false);
    // modalRef.current?.onCloseModal();
    setTicketTypes([...ticketTypes, ticket]);
    setTicketTypesDirty(true);
    setCurTicket(undefined);

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

  const handleTicketRemoved = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
    setTicketTypesDirty(true);
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
      setLoading(true);
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
      setLoading(false);
      setEventImage(dataItem?.data?.key);
      setEventImageDisplay(dataItem?.data?.imageUrl);
      console.log(dataItem);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
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
        <ChooseDate date={endDate!} setDate={setEndDate}>
          End date
        </ChooseDate>
      ) : (
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() => {
            setEndDateActive(true);
            setEndDate(startDate.plus({ hour: 1 }));
          }}
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

  const verifyCancelEvent = (id: string) => {
    Alert.alert(
      strings.cancle,
      strings.verifyCancel,
      [
        { text: strings.no, onPress: () => null, style: "cancel" },
        {
          text: strings.yes,
          onPress: () => {
            onCancelEvent(id);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Pressable style={styles.container} onPress={keyboardDismiss}>
      <Navbar navigation={navigation} />
      <Loader visible={isLoading} showOverlay />
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
            {/* {!isCreateEvent && (
              <Pill
                label={strings.checkIns}
                backgroundColor={theme.colors.lightRed}
                pillStyle={styles.checkIn}
                onPressPill={onNavigate}
              />
            )} */}
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
                    placeholder="Where will the event be held?"
                    onPress={(data: any, details: any) => {
                      setFullAddress(data.description);
                      setLatitude(details!.geometry.location.lat);
                      setLongitude(details!.geometry.location.lng);
                    }}
                  ></LocationAutocomplete>

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
                    <View key={t.name} style={styles.rowOnly}>
                      <Text style={styles.ticket}>{`${t?.name} - ${
                        t.quantity ? t.quantity : "Unlimited"
                      } ${
                        t.price > 0 ? "@ $" + t.price.toFixed(2) : "Free"
                      }`}</Text>
                      <View style={styles.rowOnly}>
                        <Pressable onPress={() => setCurTicket(index)}>
                          <ImageComponent source={edit} style={styles.edit} />
                        </Pressable>
                        <Pressable onPress={() => handleTicketRemoved(index)}>
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

            {event ? (
              <View>
                {isEventOwner ? (
                  <View>
                    <View style={styles.uniqueViewCont}>
                      <Text style={styles.uniqueViewLbl}>Unique Views</Text>
                      <Text style={styles.uniqueCount}>{viewCount}</Text>
                    </View>
                    <View>
                      <GetAdmintoolsDropDownScreen
                        eventId={event.id!}
                        navigation={navigation}
                      />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => verifyCancelEvent(event.id!)}
                        style={styles.cancleEventBtn}
                      >
                        <Text style={styles.cancleEventText}>
                          {strings.cancleEvent}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <View style={styles.bottomButton}>
        <ButtonComponent
          onPress={isCreateEvent ? handleCreateEvent : handleUpdateEvent}
          icon={save}
          title={strings.save}
          disabled={isValid() || isLoading}
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
