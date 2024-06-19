/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash/fp";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { addGreen, dummy, edit, pinWhite } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { ChooseDate } from "~/components/choose-date/ChooseDate";
import { ImageComponent } from "~/components/image-component";
import { Input } from "~/components/input";
import { Loader } from "~/components/loader";
import { LocationAutocomplete } from "~/components/location-autocomplete/LocationAutocomplete";
import { SizedBox } from "~/components/sized-box";
import { LOG } from "~/config";
import { useMyUserId } from "~/navigation/AuthContext";
import { useEventService } from "~/network/api/services/useEventService";
import { width } from "~/theme/device/device";
import { normalScale, verticalScale } from "~/theme/device/normalize";
import { LocalEvent, isLocalEvent } from "~/types/local-event";
import { LocalEventData } from "~/types/local-event-data";
import { LocalEventUpdateData } from "~/types/local-event-update-data";
import { TicketTypeData } from "~/types/ticket-type-data";
import { AddTicketModal } from "./AddTicketModal";
import { createStyleSheet } from "./style";

interface EventEditorProps {
  event?: LocalEvent;
  isLoading: boolean;
  onSubmitCreate?: (data: LocalEventData, { onSuccess }) => void;
  onSubmitUpdate?: (data: LocalEventUpdateData, { onSuccess }) => void;
}
export const EventEditor = ({
  event,
  isLoading,
  onSubmitCreate,
  onSubmitUpdate,
}: EventEditorProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const viewCount = isLocalEvent(event) ? event.viewCount : undefined;
  const styles = createStyleSheet(theme);
  const navigation = useNavigation();
  const [isEndDateActive, setEndDateActive] = useState(false);
  const [curTicket, setCurTicket] = useState<number | undefined>();
  const myUserId = useMyUserId();

  const isMyEvent = myUserId === event?.id;

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LocalEventData>({
    defaultValues: event
      ? {
          ..._.omit(
            [
              "gratis",
              "replies",
              "postDate",
              "author",
              "host",
              "isCanceled",
              "viewCount",
            ],
            event
          ),
        }
      : {
          name: "",
          startDate: DateTime.now().startOf("hour").plus({ hour: 1 }),
          coordinates: [],
          ticketTypes: [],
          timezone: DateTime.local().zoneName,
        },
  });

  const {
    mutations: { cancelEvent },
  } = useEventService();

  const mutateCancelEvent = useMutation(cancelEvent);

  const onSubmit = (data: LocalEventData | LocalEventUpdateData) => {
    const onSuccess = () => {
      navigation.goBack();
    };

    event
      ? onSubmitUpdate!(data as LocalEventUpdateData, { onSuccess })
      : onSubmitCreate!(data as LocalEventData, { onSuccess });
  };

  const onTicketAdded = (ticket: TicketTypeData) => {
    LOG.debug("> onTicketAdded", ticket);
    setValue("ticketTypes", [...getValues("ticketTypes"), ticket]);
    setCurTicket(undefined);
  };

  const handleTicketRemoved = (index: number) => {
    setValue(
      "ticketTypes",
      getValues("ticketTypes").filter((_, i) => i !== index)
    );
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
      const fileNameTwo = img?.fileName ?? "";
      setLoading(true);
      const output =
        fileNameTwo.substr(0, fileNameTwo.lastIndexOf(".")) || fileNameTwo;
      const base64Two = img?.base64 ?? "";
      ProfileImageUploadAPI(output, base64Two);
    }
  };

  const ProfileImageUploadAPI = async (fileItem: any, base64Item: any) => {
    const pic: any = {
      uploadKey: "create_event_image",
      imageName: fileItem,
      base64String: "data:image/jpeg;base64," + base64Item,
    };

    console.log(process.env.API_URL + "/v3/users/upload/file");
    try {
      const response = await fetch(
        process.env.API_URL + "/v3/users/upload/file",
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
      setValue("image", dataItem?.data?.key);
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
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <ChooseDate date={value} setDate={onChange}>
            Start date
          </ChooseDate>
        )}
        name="startDate"
      />
      {errors.startDate && <Text>This is required.</Text>}

      {isEndDateActive ? (
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <ChooseDate
              date={value ?? getValues("startDate").plus({ hour: 1 })}
              setDate={onChange}
            >
              End date
            </ChooseDate>
          )}
          name="endDate"
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() => {
            setEndDateActive(true);
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
            mutateCancelEvent.mutate(id, {
              onSuccess: () => navigation.goBack(),
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Pressable style={styles.container} onPress={keyboardDismiss}>
      <Loader visible={isLoading} showOverlay />
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          keyboardDismiss();
        }}
      >
        <View>
          <TouchableOpacity activeOpacity={0.8} onPress={onUploadImage}>
            <ImageComponent
              isUrl={!!getValues("image")}
              resizeMode="cover"
              uri={getValues("image")}
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

          <SizedBox height={verticalScale(26)} />
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
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={strings.enterTitle}
                  value={value}
                />
              )}
              name="name"
            />
            {errors.name && <Text>This is required.</Text>}

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
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <LocationAutocomplete
                      address={value}
                      placeholder="Where will the event be held?"
                      onPress={(data, details) => {
                        onChange(data.description);
                        if (details) {
                          setValue("coordinates", [
                            details.geometry.location.lng,
                            details.geometry.location.lat,
                          ]);
                        }
                      }}
                    ></LocationAutocomplete>
                  )}
                  name="address"
                />
                {/* {errors.address && <Text>This is required.</Text>} */}
              </View>
            </View>

            <Text style={styles.event}>{strings.aboutEvent}</Text>
            <SizedBox height={verticalScale(4)} />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder={strings.enterAboutEvent}
                  height={verticalScale(60)}
                  multiline
                  value={value}
                  onChangeText={onChange}
                />
              )}
              name="about"
            />
            {errors.about && <Text>This is required.</Text>}

            <View style={[styles.row, styles.marginTop]}>
              <Text style={styles.tickets}>{strings.tickets}:</Text>
              {/* <Pressable
                onPress={() => setCurTicket(eventData.ticketTypes.length)}
              >
                <ImageComponent source={addGreen} style={styles.addGreen} />
              </Pressable> */}
            </View>
            <AddTicketModal
              isVisible={curTicket !== undefined}
              onSuccess={onTicketAdded}
              onDismiss={() => setCurTicket(undefined)}
              value={
                curTicket === undefined
                  ? undefined
                  : getValues("ticketTypes")[curTicket]
              }
              // eventId={id}
              // eventDetails={eventDetails}
              // value={eventDetails.tickets?.[selectedTicketIndex]}
              // ref={modalRef}
              // isEdit={isEdit}
              // onCancel={onCancel}
            />
            <View>
              {getValues("ticketTypes").map((t, index) => {
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
          </View>

          {event ? (
            <View>
              {isMyEvent ? (
                <View>
                  <View style={styles.uniqueViewCont}>
                    <Text style={styles.uniqueViewLbl}>Unique Views</Text>
                    <Text style={styles.uniqueCount}>{viewCount}</Text>
                  </View>
                  <View>
                    /{" "}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => verifyCancelEvent(event.id)}
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

      <View style={styles.bottomButton}>
        <ButtonComponent
          onPress={handleSubmit(onSubmit)}
          title={event ? strings.updateEvent : strings.createEvent}
          disabled={isLoading}
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
