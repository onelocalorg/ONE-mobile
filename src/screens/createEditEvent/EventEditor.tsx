/* eslint-disable react-hooks/exhaustive-deps */
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash/fp";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { addGreen, edit } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { ChooseDate } from "~/components/choose-date/ChooseDate";
import { ImageChooser } from "~/components/image-chooser/ImageChooser";
import { ImageComponent } from "~/components/image-component";
import { LocationAutocomplete } from "~/components/location-autocomplete/LocationAutocomplete";
import { useMyUserId } from "~/navigation/AuthContext";
import { EventMutations } from "~/network/api/services/useEventService";
import { normalScale, verticalScale } from "~/theme/device/normalize";
import { ImageKey } from "~/types/image-info";
import {
  LocalEvent,
  LocalEventData,
  LocalEventUpdateData,
} from "~/types/local-event";
import { TicketTypeData } from "~/types/ticket-type-data";
import { FileKey } from "~/types/upload-file-data";
import { isNotEmpty } from "~/utils/common";
import { AddTicketModal } from "./AddTicketModal";
import { createStyleSheet } from "./style";

interface Callback {
  onSuccess: () => void;
}
interface EventEditorProps {
  event?: LocalEvent;
  isLoading: boolean;
  onSubmitCreate?: (data: LocalEventData, callback: Callback) => void;
  onSubmitUpdate?: (data: LocalEventUpdateData, callback: Callback) => void;
}
export const EventEditor = ({
  event,
  isLoading,
  onSubmitCreate,
  onSubmitUpdate,
}: EventEditorProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const viewCount = event?.viewCount;
  const styles = createStyleSheet(theme);
  const navigation = useNavigation();
  const [isEndDateActive, setEndDateActive] = useState(false);
  const [curTicket, setCurTicket] = useState<number | undefined>();
  const myUserId = useMyUserId();
  const isMyEvent = myUserId === event?.host.id;
  const [isTicketModalVisible, setTicketModalVisible] = useState(false);

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
              "cancelDate",
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
          images: [],
          timezone: DateTime.local().zoneName,
        },
  });

  const { append, remove, update } = useFieldArray({
    control,
    name: "ticketTypes",
  });

  const mutateCancelEvent = useMutation<LocalEvent, Error, string>({
    mutationKey: [EventMutations.cancelEvent],
  });

  const onSubmit = (data: LocalEventData | LocalEventUpdateData) => {
    const onSuccess = () => {
      navigation.goBack();
    };

    event
      ? onSubmitUpdate!(_.pickBy(isNotEmpty, data) as LocalEventUpdateData, {
          onSuccess,
        })
      : onSubmitCreate!(_.pickBy(isNotEmpty, data) as LocalEventData, {
          onSuccess,
        });
  };

  const handleTicketSelected = (index: number) => {
    setCurTicket(index);
    setTicketModalVisible(true);
  };

  const onTicketUpdate = (ticket: TicketTypeData) => {
    curTicket !== undefined ? update(curTicket, ticket) : append(ticket);
    setCurTicket(undefined);
    setTicketModalVisible(false);
  };

  const handleTicketRemoved = (index: number) => {
    remove(index);
  };

  const handleChangeImages = (images: ImageKey[]) => {
    setValue("images", images);
  };

  console.log("images", getValues("images"));

  const ChooseStartAndEndDates = () => (
    <View style={styles.rowContainer}>
      <FontAwesomeIcon icon={faCalendar} size={20} />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <ChooseDate date={value} setDate={onChange}>
            <Text style={styles.label}>Start</Text>
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
              <Text style={styles.label}>End</Text>
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
          <Text style={styles.label}>+ Add end date</Text>
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
    <View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ justifyContent: "space-between" }}>
          <View style={{ rowGap: 12 }}>
            <View>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={strings.enterTitle}
                    style={styles.postInput}
                    value={value}
                  />
                )}
                name="name"
              />
              {errors.name && <Text>This is required.</Text>}
            </View>

            <ChooseStartAndEndDates />

            <View>
              <View style={styles.rowContainer}>
                <FontAwesomeIcon icon={faLocationDot} size={20} />
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <LocationAutocomplete
                      address={value}
                      placeholder="Location"
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
                {errors.address && <Text>This is required.</Text>}
              </View>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder={strings.enterVenue}
                    style={styles.postInput}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
                name="venue"
              />
            </View>

            <View>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Event details"
                    multiline
                    value={value}
                    style={[styles.postInput, { height: 100 }]}
                    onChangeText={onChange}
                  />
                )}
                name="details"
              />
              {errors.details && <Text>This is required.</Text>}
            </View>

            <ImageChooser
              id={event?.id}
              uploadKey={FileKey.createEventImage}
              defaultValue={getValues("images")}
              onChangeImages={handleChangeImages}
            />

            <View style={styles.rowContainer}>
              <Pressable onPress={() => setTicketModalVisible(true)}>
                <Text style={styles.label}>{strings.tickets}</Text>
                <ImageComponent source={addGreen} style={styles.addGreen} />
              </Pressable>
              <AddTicketModal
                isVisible={isTicketModalVisible}
                onSuccess={onTicketUpdate}
                onDismiss={() => setTicketModalVisible(false)}
                value={
                  curTicket === undefined
                    ? undefined
                    : getValues("ticketTypes")[curTicket]
                }
              />
              <View>
                {getValues("ticketTypes").map((t, index) => {
                  return (
                    <View
                      key={`${t.quantity}${t.name}${t.price}`}
                      style={styles.rowContainer}
                    >
                      <Text style={styles.ticket}>{`${t?.name} - ${
                        t.quantity ? t.quantity : "Unlimited"
                      } ${
                        t.price > 0 ? "@ $" + t.price.toFixed(2) : "Free"
                      }`}</Text>
                      <View style={styles.rowContainer}>
                        <Pressable onPress={() => handleTicketSelected(index)}>
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
      </TouchableWithoutFeedback>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 12,
          marginTop: 30,
        }}
      >
        <ButtonComponent
          onPress={navigation.goBack}
          hasIcon={false}
          title="Cancel"
          style={styles.cancelButton}
        />

        <ButtonComponent
          onPress={handleSubmit(onSubmit)}
          title={event ? strings.updateEvent : strings.createEvent}
          disabled={isLoading}
          style={styles.postButton}
        />
      </View>
    </View>
  );
};
