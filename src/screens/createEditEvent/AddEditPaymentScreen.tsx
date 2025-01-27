import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import CurrencyInput from "react-native-currency-input";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { redDeleteIcon, saveIcon } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { MultiImageViewer } from "~/components/MultiImageViewer";
import { ShortModal } from "~/components/ShortModal";
import { UserChooser } from "~/components/user-chooser/UserChooser";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  EventMutations,
  PaymentId,
  useEventService,
} from "~/network/api/services/useEventService";
import { OneUser } from "~/types/one-user";
import {
  Payment,
  PaymentData,
  PaymentSplit,
  PaymentType,
} from "~/types/payment";
import { createStyleSheet } from "./style";

export const AddEditPaymentScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.ADD_EDIT_PAYMENT>) => {
  const { eventId, type, paymentId } = route.params;

  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [isUserChooserVisible, setUserChooserVisible] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const {
    queries: { paymentDetail },
  } = useEventService();

  const { data: payment, isPending } = useQuery({
    ...paymentDetail({ eventId, id: paymentId! }),
    enabled: !!paymentId,
  });

  console.log("isPending", isPending);

  const {
    control,
    setValue,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<PaymentData>({
    defaultValues: {
      id: paymentId,
      eventId,
      paymentType: type ?? PaymentType.Expense,
      paymentSplit: PaymentSplit.Fixed,
      amount: 0,
      description: "",
      images: [],
    },
    values: payment,
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  });

  // {
  //   id: paymentId,
  //   eventId,
  //   // user: payment?.user,
  //   paymentType: payment?.paymentType ?? type ?? PaymentType.Expense,
  //   paymentSplit: payment?.paymentSplit ?? PaymentSplit.Fixed,
  //   amount: payment?.amount ?? 0,
  //   description: payment?.description ?? "",
  //   images: payment?.images ?? [],
  // }

  const paymentType = useWatch({ control, name: "paymentType" });
  const paymentSplit = useWatch({ control, name: "paymentSplit" });

  const mutateCreatePayment = useMutation<Payment, Error, PaymentData>({
    mutationKey: [EventMutations.createPayment],
  });

  const mutateUpdatePayment = useMutation<Payment, Error, PaymentData>({
    mutationKey: [EventMutations.editPayment],
  });

  const mutateDeletePayment = useMutation<void, Error, PaymentId>({
    mutationKey: [EventMutations.deletePayment],
  });

  // </---------------Delete Expense and Payout--------------------/>

  // const openGallary = async () => {
  //   const { assets } = await launchImageLibrary({
  //     mediaType: "photo",
  //     includeBase64: true,
  //     maxWidth: 800,
  //     maxHeight: 800,
  //   });
  //   if (assets) {
  //     const img = assets?.[0];
  //     const fileNameTwo = img?.fileName ?? "";
  //     LodingData(true);
  //     const output =
  //       fileNameTwo.substr(0, fileNameTwo.lastIndexOf(".")) || fileNameTwo;
  //     const base64Two = img?.base64 ?? "";
  //     postImageUploadAPI(output, base64Two);
  //   }
  // };

  // const postImageUploadAPI = async (fileItem: any, base64Item: any) => {
  //   const token = await AsyncStorage.getItem("token");
  //   const pic: any = {
  //     uploadKey: "createPostImg",
  //     imageName: fileItem,
  //     base64String: "data:image/jpeg;base64," + base64Item,
  //   };

  //   console.log("================ postImageUploadAPI Request=================");
  //   try {
  //     const response = await fetch(
  //       process.env.API_URL + "/v3/users/upload/file",
  //       {
  //         method: "post",
  //         headers: new Headers({
  //           Authorization: "Bearer " + token,
  //           "Content-Type": "application/json",
  //         }),
  //         body: JSON.stringify(pic),
  //       }
  //     );
  //     const dataItem = await response.json();
  //     const tempData = imageSelectArray;
  //     tempData.push(dataItem?.data);
  //     setImageSelectArray(tempData);
  //     const tempTwo = imageSelectArrayKey;

  //     tempTwo.push(dataItem?.data?.key);
  //     setImageSelectArrayKey(tempTwo);
  //     LodingData(false);
  //   } catch (error) {
  //     console.log(error);
  //     LodingData(false);
  //   }
  // };
  //
  // const removeSelectImage = (imageItem: any) => {
  //   const newImage = imageSelectArray.filter(
  //     (person: any) =>
  //       person.imageUrl !== imageItem.imageUrl && person.key !== imageItem.key
  //   );

  //   setImageSelectArray(newImage);

  //   const newImageKey = imageSelectArrayKey.filter(
  //     (person: any) => person !== imageItem.key
  //   );
  //   setImageSelectArrayKey(newImageKey);
  // };

  const showUserChooser = () => {
    setUserChooserVisible(true);
    resetField("payee");
  };

  const handleChangeUser = (user: OneUser) => {
    setValue("payee", user);
    setUserChooserVisible(false);
  };

  const onSavePayment = (payment: PaymentData) => {
    if (paymentId) {
      mutateUpdatePayment.mutate(payment, {
        onSuccess: navigation.goBack,
      });
    } else {
      mutateCreatePayment.mutate(payment, {
        onSuccess: navigation.goBack,
      });
    }
  };

  const onDeletePayment = () => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete it?",
      [
        {
          text: "Yes",
          onPress: () => {
            mutateDeletePayment.mutate(
              { id: paymentId!, eventId },
              { onSuccess: navigation.goBack }
            );
          },
          style: "destructive",
        },
        {
          text: "No",
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
    // postContentModal(false);
  };

  return (
    <ShortModal height={isPending && !!paymentId ? 100 : 400}>
      <View style={{ flex: 1 }}>
        <View style={styles.breakDownCont}>
          <Loader showOverlay={true} visible={isPending && !!paymentId} />

          <View style={styles.subBreakdowncont}>
            <View
              style={{
                marginTop: 5,
                marginLeft: 0,
                paddingTop: 5,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.breakdownHeader}>
                {paymentId ? "Edit" : "Add"}
              </Text>
            </View>

            <View style={styles.payModalContainer}>
              <Text style={styles.whoCont}>Who:</Text>
              <View>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { value } }) => (
                    <TextInput
                      onPressIn={showUserChooser}
                      placeholder="select who to pay"
                      placeholderTextColor="darkgray"
                      value={
                        value
                          ? `${value.firstName} ${value.lastName}`
                          : userSearch
                      }
                      onChangeText={setUserSearch}
                      style={styles.payInput}
                    ></TextInput>
                  )}
                  name="payee"
                />
                {errors.payee && <Text>This is required.</Text>}
              </View>
            </View>

            {isUserChooserVisible && (
              <UserChooser
                search={userSearch}
                onChangeUser={handleChangeUser}
              />
            )}

            <View style={styles.amountCont}>
              <Text style={styles.amountLbl}>Amount</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setValue("paymentSplit", PaymentSplit.Fixed)}
              >
                <View
                  style={[
                    paymentSplit === PaymentSplit.Fixed
                      ? styles.priceContainer
                      : styles.priceContainerTwo,
                  ]}
                >
                  <Text style={styles.percentageSign}>$</Text>
                </View>
              </TouchableOpacity>
              {paymentType !== PaymentType.Expense ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setValue("paymentSplit", PaymentSplit.Percent)}
                >
                  <View
                    style={[
                      paymentSplit === PaymentSplit.Percent
                        ? styles.priceContainer
                        : styles.priceContainerTwo,
                    ]}
                  >
                    <Text style={styles.percentageSign}>%</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View></View>
              )}
              <View style={{ flexDirection: "row", width: 150 }}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    min: 0.01,
                  }}
                  render={({ field: { onChange, onBlur, value } }) =>
                    paymentSplit === PaymentSplit.Fixed ? (
                      <CurrencyInput
                        // style={styles.inputStyle}
                        value={value / 100}
                        onChangeValue={(v) => onChange((v ?? 0) * 100)}
                        onBlur={onBlur}
                        // placeholder={strings.ticketPriceFree}
                        separator="."
                        delimiter=","
                      />
                    ) : (
                      <>
                        <TextInput
                          keyboardType="numeric"
                          inputMode="numeric"
                          value={value.toString()}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />
                      </>
                    )
                  }
                  name="amount"
                />
              </View>
            </View>
            {errors.amount && <Text>This is required.</Text>}

            <View style={styles.descriptionCont}>
              <Text style={styles.descpLbl}>Description</Text>
            </View>
            <View>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    multiline
                    onChangeText={onChange}
                    style={styles.payoutDescLbl}
                  ></TextInput>
                )}
                name="description"
              />
              {errors.description && <Text>This is required.</Text>}
            </View>

            {payment?.images && <MultiImageViewer images={payment.images} />}

            {/* 
              TODO Add images
              <View
                style={{
                  backgroundColor: "#A9A9A9",
                  height: 1,
                  marginRight: 20,
                }}
              ></View>
              <View style={styles.mediaCont}>
                <Text style={styles.mediaLbl}>Media</Text>
                <TouchableOpacity onPress={openGallary}>
                  <Text style={styles.addPhotosCont}>add photos</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.multipleImagecont}>
                {imageSelectArray.map((item: any) => {
                  return (
                    <TouchableOpacity onPress={() => removeSelectImage(item)}>
                      <ImageComponent
                        source={{ uri: item?.imageUrl }}
                        style={styles.selectImage}
                      ></ImageComponent>
                    </TouchableOpacity>
                  );
                })}
              </View> */}

            <View style={styles.submitButton}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSubmit(onSavePayment)}
              >
                <ImageComponent
                  source={saveIcon}
                  style={styles.saveIcon}
                ></ImageComponent>
              </TouchableOpacity>
              {paymentId && (
                <TouchableOpacity onPress={onDeletePayment}>
                  <ImageComponent
                    source={redDeleteIcon}
                    style={styles.deleteIcon}
                  ></ImageComponent>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </ShortModal>
  );
};
