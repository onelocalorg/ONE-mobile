/* eslint-disable react-hooks/exhaustive-deps */
import {useAppTheme} from '@app-hooks/use-app-theme';
import React, {useEffect, useRef, useState} from 'react';
import {createStyleSheet} from './style';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {Alert, Keyboard, LogBox, Text, TouchableOpacity, View} from 'react-native';
import {Header} from '@components/header';
import {NavigationContainerRef, ParamListBase} from '@react-navigation/native';
import {Pill} from '@components/pill';
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
  ticket,
} from '@assets/images';
import {SizedBox} from '@components/sized-box';
import {normalScale, verticalScale} from '@theme/device/normalize';
import {Input} from '@components/input';
import {ImageComponent} from '@components/image-component';
import {AddTicketModal} from './add-ticket-modal';
import {ModalRefProps} from '@components/modal-component';
import {navigations} from '@config/app-navigation/constant';
import {
  Result,
  Ticket,
} from '@network/hooks/home-service-hooks/use-event-lists';
import moment from 'moment';
import {formatPrice} from '@utils/common';
import {
  DatePickerRefProps,
  DateRangePicker,
} from '@components/date-range-picker';
import {useTicketHolderCheckinsList} from '@network/hooks/home-service-hooks/use-ticket-holder-checkin-list';
import {useUpdateEvent} from '@network/hooks/home-service-hooks/use-update-event';
import {Loader} from '@components/loader';
import {ButtonComponent} from '@components/button-component';
import {TicketBodyParamProps} from '@network/api/services/home-service';
import {useCreateEvent} from '@network/hooks/home-service-hooks/use-create-event';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import {StoreType} from '@network/reducers/store';
import {UserProfileState} from '@network/reducers/user-profile-reducer';
import {useUserProfile} from '@network/hooks/user-service-hooks/use-user-profile';
import {TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetLocation from 'react-native-get-location';
import {DatePickerModal} from 'react-native-paper-dates';

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
  const {theme} = useAppTheme();
  const {strings} = useStringsAndLabels();
  const {navigation, route} = props || {};
  const {eventData, isCreateEvent} = route?.params ?? {};
  const styles = createStyleSheet(theme);
  const modalRef: React.Ref<ModalRefProps> = useRef(null);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  var [location, setUserLocation]: any = useState();
  const [eventDetails, setEventDetails] = useState<Result>(
    (eventData as Result) || {},
  );
  const {
    name,
    address,
    start_date,
    end_date,
    tickets,
    email_confirmation_body,
    id,
    full_address,
    about,
  } = eventDetails || {};
  const datePickerRefStart: React.Ref<DatePickerRefProps> = useRef(null);
  const datePickerRefend: React.Ref<DatePickerRefProps> = useRef(null);
  const {user} = useSelector<StoreType, UserProfileState>(
    state => state.userProfileReducer,
  ) as {user: {id: string; pic: string}};
  const [eventImage, setEventImage] = useState('');
  const {refetch, data} = useTicketHolderCheckinsList({
    eventId: id,
    queryParams: {pagination: false},
  });
  const {mutateAsync, isLoading} = useUpdateEvent();
  const {mutateAsync: createEvent, isLoading: createEventLoading} =
    useCreateEvent();

  useEffect(() => {
    LogBox.ignoreAllLogs();
    requestLocationPermission();
    setEventDetails({...eventDetails, start_date: startDateValue.toString()});
  }, [startDateValue, endDateValue]);

  useEffect(() => {
    if (!isCreateEvent) {
      refetch();
      if (eventData) {
        setEventDetails(eventData);
        setEventImage(eventData?.event_image);
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
      .then(location => {
        setUserLocation(location);
        console.log(
          '---------------------location---------------------',
          location,
        );
      })
      .catch(error => {
        console.log('---------------------error---------------------', error);
        const {code, message} = error;
        console.log(code, message);
      });
  };

  const onBackPress = () => {
    navigation?.goBack();
  };

  const onNavigate = () => {
    navigation?.navigate(navigations.CHECK_IN, {eventId: id});
  };

  const onConfirmStartDateTime = (startDate: Date) => {
    setEventDetails({...eventDetails, start_date: startDate.toString()});
    setStartDateValue(startDate);
    datePickerRefStart.current?.onOpenModal('start');
  };

  const onConfirmEndDateTime = (endDate: Date) => {
    setEventDetails({...eventDetails, end_date: endDate.toString()});
    setEndDateValue(endDate);
    datePickerRefend.current?.onOpenModal('end');
  };

  const getDate = (date = new Date().toString()) => {
    return `${moment(date).format('ddd, MMM DD • hh:mm A')}`;
  };

  const checkValidation = () => {
    return !(
      email_confirmation_body &&
      name &&
      tickets?.length &&
      address &&
      full_address &&
      about &&
      !!eventImage
    );
  };

  const onCreateEvent = async () => {
    Keyboard.dismiss();
    const res = await createEvent({
      bodyParams: {
        ...eventDetails,
        tickets: tickets?.map(ele => ele?.id ?? ''),
        eventImage,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });

    if (res?.success) {
      navigation?.goBack();
    }
  };

  const onUpdateEvent = async () => {
    Keyboard.dismiss();
    let request = {};
    if (name !== eventData?.name) {
      request = {...request, name};
    }
    if (address !== eventData?.address) {
      request = {...request, address};
    }
    if (full_address !== eventData?.full_address) {
      request = {...request, full_address};
    }
    if (start_date !== eventData?.start_date) {
      request = {...request, startDate: start_date};
    }
    if (end_date !== eventData?.end_date) {
      request = {...request, endDate: end_date};
    }
    if (email_confirmation_body !== eventData?.email_confirmation_body) {
      request = {...request, emailConfirmationBody: email_confirmation_body};
    }
    if (about !== eventData?.about) {
      request = {...request, about: about};
    }
    // if (location.latitude) {
    request = {...request, latitude: location.latitude};
    // }
    // if (location.longitude) {
    request = {...request, longitude: location.longitude};
    // }
    request = {...request, tickets: tickets?.map(ele => ele?.id), eventImage};

    if (Object.keys(request).length === 0) {
      Alert.alert('', strings.pleaseEdit);
      return;
    }

    const res = await mutateAsync({bodyParams: request, eventId: id});
    if (res?.success) {
      navigation?.goBack();
    }
  };

  const handleText = (text: string, key: string) => {
    setEventDetails({...eventDetails, [key]: text});
  };

  const onSuccessfulTicketCreation = (ticketDetails: TicketBodyParamProps) => {
    setIsEdit(false);
    modalRef.current?.onCloseModal();
    const eventDetailsCopy = {...eventDetails};
    if (isEdit) {
      const allTickets = [...(eventDetailsCopy?.tickets || [])];
      const index = allTickets.findIndex(ele => ele?.id === ticketDetails?.id);
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

  const openEditTicketModal = (index: number) => {
    setSelectedTicketIndex(index);
    setIsEdit(true);
    modalRef.current?.onOpenModal();
  };

  const onUploadImage = async () => {
    const {assets} = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 800,
      maxHeight: 800,
    });
    if (assets) {
      const img = assets?.[0];
      setEventImage(img?.uri ?? '');
    }
  };

  const onNavigateToProfile = () => {
    navigation?.navigate(navigations.PROFILE);
  };

  return (
    <View style={styles.container}>
      <Loader visible={isLoading || createEventLoading} showOverlay />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
          <TouchableOpacity onPress={onBackPress} style={{zIndex: 11111222222}}>
            <View style={styles.row2}>
              <ImageComponent source={arrowLeft} style={styles.arrowLeft} />
            </View>
          </TouchableOpacity>
          <View style={styles.oneContainer}>
            <ImageComponent
              style={styles.oneContainerImage}
              source={onelogo}></ImageComponent>
            <Text style={styles.oneContainerText}>NE</Text>
          </View>
          <View style={styles.profileContainer}>
            <ImageComponent
              style={styles.bellIcon}
              source={bell}></ImageComponent>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onNavigateToProfile}
              style={styles.profileView}>
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
        <View style={styles.innerContainer}>
          <Input
            onChangeText={text => handleText(text, 'name')}
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
              onPress={() => datePickerRefStart.current?.onOpenModal('start')}
              style={styles.margin}>
              <Text style={styles.time}>
                Start Date
              </Text>
              <Text style={styles.time}>{`- ${moment(start_date).format(
                'DD MMM YYYY (hh:mm A)',
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
              onPress={() => datePickerRefend.current?.onOpenModal('end')}
              style={styles.margin}>
              <Text style={styles.time}>
                End Date
              </Text>
              <Text style={styles.time}>{`- ${moment(end_date).format(
                'DD MMM YYYY (hh:mm A)',
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
                onChangeText={text => handleText(text, 'address')}
                height={verticalScale(40)}
              />
              <SizedBox height={verticalScale(8)} />
              <Input
                placeholder={strings.enterAddress}
                inputStyle={styles.textStyle}
                value={full_address}
                onChangeText={text => handleText(text, 'full_address')}
                height={verticalScale(40)}
              />
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={onUploadImage}>
            <ImageComponent
              isUrl={!!eventImage}
              resizeMode="cover"
              uri={eventImage}
              source={dummy}
              style={styles.profile}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onUploadImage}
              style={styles.add}>
              <ImageComponent source={addGreen} style={styles.addGreen} />
            </TouchableOpacity>
          </TouchableOpacity>
          <Text style={styles.event}>{strings.aboutEvent}</Text>
          <SizedBox height={verticalScale(4)} />
          <Input
            placeholder={strings.enterAboutEvent}
            height={verticalScale(60)}
            multiline
            value={about}
            onChangeText={text => handleText(text, 'about')}
          />
          <View style={[styles.row, styles.marginTop]}>
            <Text style={styles.tickets}>{strings.tickets}:</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={openCreateTicketModal}>
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
                  activeOpacity={0.8}>
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
            onChangeText={text => handleText(text, 'email_confirmation_body')}
          />
          <SizedBox height={verticalScale(8)} />
          {!isCreateEvent && (
            <>
              <Text style={styles.tickets}>{strings.attendees}:</Text>
              <SizedBox height={verticalScale(5)} />
              {(data?.results || []).length > 0 ? (
                (data?.results || [])?.map(item => (
                  <Text key={item?._id} style={styles.attendee}>
                    {item?.is_app_user
                      ? `${item?.user?.first_name} ${item?.user?.last_name}`
                      : item?.user?.name}
                  </Text>
                ))
              ) : (
                <Text style={styles.noAttendee}>{strings.noAttendees}</Text>
              )}
            </>
          )}
        </View>
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
    </View>
  );
};
