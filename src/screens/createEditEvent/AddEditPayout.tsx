import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import CurrencyInput from "react-native-currency-input";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { redDeleteIcon, saveIcon } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { MultiImageViewer } from "~/components/MultiImageViewer";
import { UserChooser } from "~/components/user-chooser/UserChooser";
import {
  EventMutations,
  PaymentId,
  useEventService,
} from "~/network/api/services/useEventService";
import { OneUser } from "~/types/one-user";
import { Payout, PayoutData, PayoutSplit } from "~/types/payout";
import { createStyleSheet } from "./style";

interface AddEditPayoutProps {
  eventId: string;
  payout?: Payout;
  onClose: () => void;
}
export const AddEditPayout = ({
  eventId,
  payout,
  onClose,
}: AddEditPayoutProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [isUserChooserVisible, setUserChooserVisible] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const {
    control,
    setValue,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<PayoutData>({
    defaultValues: payout ?? {
      event: {
        id: eventId,
      },
      amount: 0,
      split: PayoutSplit.Fixed,
      description: "",
      images: [],
    },
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  });

  const split = useWatch({ control, name: "split" });
  const amount = useWatch({ control, name: "amount" });

  const { queries } = useEventService();

  const { mutate: createPayout } = useMutation<Payout, Error, PayoutData>({
    mutationKey: [EventMutations.createPayout],
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queries.financialsForEvent(eventId).queryKey,
      });
    },
  });

  const { mutate: updatePayout } = useMutation<Payout, Error, PayoutData>({
    mutationKey: [EventMutations.editPayout],
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queries.financialsForEvent(eventId).queryKey,
      });
    },
  });

  const { mutate: deletePayout } = useMutation<void, Error, PaymentId>({
    mutationKey: [EventMutations.deletePayout],
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queries.financialsForEvent(eventId).queryKey,
      });
    },
  });

  const showUserChooser = () => {
    setUserChooserVisible(true);
    resetField("payee");
  };

  const handleChangeUser = (user: OneUser) => {
    setValue("payee", user);
    setUserChooserVisible(false);
  };

  const onSavePayout = (payment: PayoutData) => {
    setIsSaving(true);
    if (payout) {
      updatePayout(payment, {
        onSettled: onClose,
      });
    } else {
      createPayout(payment, {
        onSettled: onClose,
      });
    }
  };

  const onDeletePayout = () => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete it?",
      [
        {
          text: "Yes",
          onPress: () => {
            deletePayout({ id: payout!.id, eventId }, { onSettled: onClose });
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
    <View style={{ flex: 1 }}>
      <View style={styles.breakDownCont}>
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
              {payout ? "Edit" : "Add"}
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

          <UserChooser
            search={userSearch}
            onChangeUser={handleChangeUser}
            isVisible={isUserChooserVisible}
          />

          <View style={styles.amountCont}>
            <Text style={styles.amountLbl}>Amount</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setValue("split", PayoutSplit.Fixed)}
            >
              <View
                style={[
                  split === PayoutSplit.Fixed
                    ? styles.priceContainer
                    : styles.priceContainerTwo,
                ]}
              >
                <Text style={styles.percentageSign}>$</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setValue("split", PayoutSplit.Percent)}
            >
              <View
                style={[
                  split === PayoutSplit.Percent
                    ? styles.priceContainer
                    : styles.priceContainerTwo,
                ]}
              >
                <Text style={styles.percentageSign}>%</Text>
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", width: 150 }}>
              <Controller
                control={control}
                rules={{
                  required: true,
                  min: 0.01,
                }}
                render={({ field: { onChange, onBlur, value } }) =>
                  split === PayoutSplit.Fixed ? (
                    <CurrencyInput
                      // style={styles.inputStyle}
                      value={amount / 100}
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

          {payout?.images && <MultiImageViewer images={payout.images} />}

          <View style={styles.submitButton}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit(onSavePayout)}
              disabled={isSaving}
            >
              <ImageComponent
                source={saveIcon}
                style={styles.saveIcon}
              ></ImageComponent>
            </TouchableOpacity>
            {payout && (
              <TouchableOpacity onPress={onDeletePayout}>
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
  );
};
