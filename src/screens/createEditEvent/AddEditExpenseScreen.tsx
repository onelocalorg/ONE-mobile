import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CurrencyInput from "react-native-currency-input";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { redDeleteIcon, saveIcon } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { MultiImageViewer } from "~/components/MultiImageViewer";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "~/components/ui/actionsheet";
import { UserChooser } from "~/components/user-chooser/UserChooser";
import { RootStackScreenProps, Screens } from "~/navigation/types";
import {
  EventMutations,
  PaymentId,
  useEventService,
} from "~/network/api/services/useEventService";
import { Expense, ExpenseData } from "~/types/expense";
import { OneUser } from "~/types/one-user";
import { createStyleSheet } from "./style";

export const AddEditExpenseScreen = ({
  navigation,
  route,
}: RootStackScreenProps<Screens.ADD_EDIT_EXPENSE>) => {
  const { eventId, paymentId } = route.params;

  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [isUserChooserVisible, setUserChooserVisible] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const {
    queries,
    queries: { expenseDetail },
  } = useEventService();

  const { data: expense, isPending } = useQuery({
    ...expenseDetail({ eventId, id: paymentId! }),
    enabled: !!paymentId,
  });

  const {
    control,
    setValue,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<ExpenseData>({
    defaultValues: {
      event: {
        id: eventId,
      },
      amount: 0,
      description: "",
      images: [],
    },
    values: expense,
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  });

  const { mutate: createExpense } = useMutation<Expense, Error, ExpenseData>({
    mutationKey: [EventMutations.createExpense],
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queries.financialsForEvent(eventId).queryKey,
      });
    },
  });

  const { mutate: updateExpense } = useMutation<Expense, Error, ExpenseData>({
    mutationKey: [EventMutations.editExpense],
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queries.financialsForEvent(eventId).queryKey,
      });
    },
  });

  const { mutate: deleteExpense } = useMutation<void, Error, PaymentId>({
    mutationKey: [EventMutations.deleteExpense],
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

  const handleOnClose = () => {
    navigation.goBack();
  };

  const onSaveExpense = (payment: ExpenseData) => {
    setIsSaving(true);
    if (paymentId) {
      updateExpense(payment, {
        onSuccess: navigation.goBack,
      });
    } else {
      createExpense(payment, {
        onSuccess: navigation.goBack,
      });
    }
  };

  const onDeleteExpense = () => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete?",
      [
        {
          text: "Yes",
          onPress: () => {
            deleteExpense(
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
  };

  return (
    <Actionsheet defaultIsOpen={true} onClose={handleOnClose} snapPoints={[70]}>
      <KeyboardAvoidingView
        behavior="position"
        style={{
          position: "relative",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
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

            <UserChooser
              search={userSearch}
              onChangeUser={handleChangeUser}
              isVisible={isUserChooserVisible}
            />

            <View style={styles.amountCont}>
              <Text style={styles.amountLbl}>Amount</Text>
              <Text style={styles.percentageSign}>$</Text>
              <View style={{ flexDirection: "row", width: 150 }}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    min: 0.01,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CurrencyInput
                      // style={styles.inputStyle}
                      value={value / 100}
                      onChangeValue={(v) => onChange((v ?? 0) * 100)}
                      onBlur={onBlur}
                      // placeholder={strings.ticketPriceFree}
                      separator="."
                      delimiter=","
                    />
                  )}
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

            {expense?.images && <MultiImageViewer images={expense.images} />}

            <View style={styles.submitButton}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSubmit(onSaveExpense)}
                disabled={isSaving}
              >
                <ImageComponent
                  source={saveIcon}
                  style={styles.saveIcon}
                ></ImageComponent>
              </TouchableOpacity>
              {paymentId && (
                <TouchableOpacity onPress={onDeleteExpense}>
                  <ImageComponent
                    source={redDeleteIcon}
                    style={styles.deleteIcon}
                  ></ImageComponent>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ActionsheetContent>
      </KeyboardAvoidingView>
    </Actionsheet>
  );
};
