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
import ImagePicker from "react-native-image-crop-picker";
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
import { EventMutations } from "~/network/api/services/useEventService";
import { UserMutations } from "~/network/api/services/useUserService";
import { normalScale, verticalScale } from "~/theme/device/normalize";
import {
  LocalEvent,
  LocalEventData,
  LocalEventUpdateData,
  isLocalEvent,
} from "~/types/local-event";
import { RemoteImage } from "~/types/remote-image";
import { TicketTypeData } from "~/types/ticket-type-data";
import { FileKeys, UploadFileData } from "~/types/upload-file-data";
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
  const viewCount = isLocalEvent(event) ? event.viewCount : undefined;
  const styles = createStyleSheet(theme);
  const navigation = useNavigation();
  const [isEndDateActive, setEndDateActive] = useState(false);
  const [curTicket, setCurTicket] = useState<number | undefined>();
  const [imageUrl, setImageUrl] = useState(event?.image);
  const myUserId = useMyUserId();
  const isMyEvent = myUserId === event?.id;

  const { isPending: isUploadingImage, mutate: uploadFile } = useMutation<
    RemoteImage,
    Error,
    UploadFileData
  >({
    mutationKey: [UserMutations.uploadFile],
  });

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

  const mutateCancelEvent = useMutation<LocalEvent, Error, string>({
    mutationKey: [EventMutations.cancelEvent],
  });

  const onSubmit = (data: LocalEventData | LocalEventUpdateData) => {
    const onSuccess = () => {
      navigation.goBack();
    };

    console.log("click", data);

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

  const chooseImage = async () => {
    try {
      const {
        mime,
        data: base64,
        filename,
        path,
      } = await ImagePicker.openPicker({
        width: 800,
        height: 400,
        cropping: true,
        mediaType: "photo",
        includeBase64: true,
        multiple: false,
        showsSelectedCount: false,
      });
      if (!base64) {
        Alert.alert("Image picker did not return data");
      } else {
        console.log("path", path);
        uploadFile(
          {
            uploadKey: FileKeys.createEventImage,
            imageName:
              filename || (event?.id ?? (Math.random() * 100000).toString()),
            mimeType: mime || "image/jpg",
            base64,
          },
          {
            onSuccess(uploadedFile) {
              setValue("image", uploadedFile.key);
              setImageUrl(uploadedFile.imageUrl);
            },
          }
        );
      }
    } catch (e) {
      if ((e as Error).message !== "User cancelled image selection") {
        console.error("Error choosing image", e);
      }
    }
  };

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
      <Loader visible={isLoading || isUploadingImage} showOverlay />
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          keyboardDismiss();
        }}
      >
        <View>
          <TouchableOpacity activeOpacity={0.8} onPress={chooseImage}>
            <ImageComponent
              isUrl={!!imageUrl}
              resizeMode="cover"
              uri={imageUrl}
              source={dummy}
              style={styles.profile}
            />
            <ImageComponent source={addGreen} style={styles.addGreen} />
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

            <View style={[styles.row]}>
              <View style={[styles.circularView, styles.yellow]}>
                <ImageComponent source={pinWhite} style={styles.pinWhite} />
              </View>
              <SizedBox width={normalScale(8)} />

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
              {errors.address && <Text>This is required.</Text>}
            </View>
            <SizedBox height={verticalScale(8)} />

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder={strings.enterVenue}
                  inputStyle={styles.textStyle}
                  value={value}
                  onChangeText={onChange}
                  height={verticalScale(40)}
                />
              )}
              name="venue"
            />
            <SizedBox height={verticalScale(8)} />

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
              <Pressable
                onPress={() => setCurTicket(event?.ticketTypes.length)}
              >
                <ImageComponent source={addGreen} style={styles.addGreen} />
              </Pressable>
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
    </Pressable>
  );
};
