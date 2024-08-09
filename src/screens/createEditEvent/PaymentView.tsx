import { useQueries } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import {
  buttonArrowGreen,
  edit2,
  payoutClose,
  sendPayoutImg,
} from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { useEventService } from "~/network/api/services/useEventService";
import { PaymentType } from "~/types/payment";
import { createStyleSheet } from "./style";

interface PaymentViewProps {
  eventId: string;
}

export const PaymentView = ({ eventId }: PaymentViewProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  // const [userId, setUserId]: any = useState("");
  // const [expenseListData, setExpenseListData]: any = useState([]);
  // const [payoutListData, setPayoutListData]: any = useState([]);
  // const [isPayout, setIsPayout] = useState(false);
  // const [revenueAmt, setRevenueAmt] = useState(0);
  // const [expensesAmt, setExpenseAmt]: any = useState();
  // const [totalProfile, setTotalProfile]: any = useState();
  // const [payoutAmt, setpayoutAmt]: any = useState();
  const [isAddEditPayout, setISAddEditPayout] = useState(Boolean);
  // const [remainingAmt, setRemainingAmt]: any = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    queries: {
      financialsForEvent: getFinancials,
      paymentsForEvent: getPayments,
    },
  } = useEventService();

  const { isPending, isLoading, financials, payments } = useQueries({
    queries: [getFinancials(eventId), getPayments(eventId)],
    combine: (results) => {
      return {
        financials: results[0].data,
        payments: results[1].data,
        isLoading: results.some((result) => result.isLoading),
        isPending: results.some((result) => result.isPending),
      };
    },
  });

  const payouts =
    payments?.filter((p) => p.paymentType === PaymentType.Payout) ?? [];
  const expenses =
    payments?.filter((p) => p.paymentType === PaymentType.Expense) ?? [];

  // const openAddBreakDownModal = (id: any) => {
  //   setUserId(userId);
  //   navigation?.navigate(navigations.ADDPAYOUTEXPENSE, {
  //     id: eventId,
  //     addPayOutExpense: payoutData?.total_profit,
  //   });
  // };

  // async function getPayoutAPI() {
  //   LodingData(true);
  //   const token = await AsyncStorage.getItem("token");
  //   console.log("=========== createPayoutAPI Request ==============");
  //   try {
  //     const response = await fetch(
  //       process.env.API_URL + "/v3/events/event-financial/" + eventId,
  //       {
  //         method: "get",
  //         headers: new Headers({
  //           Authorization: "Bearer " + token,
  //           "Content-Type": "application/json",
  //         }),
  //       }
  //     );
  //     console.log(
  //       process.env.API_URL + "/v3/events/event-financial/" + eventId
  //     );
  //     const dataItem = await response.json();
  //     console.log(
  //       "=========== payout data from API==============",
  //       JSON.stringify(dataItem)
  //     );
  //     LodingData(false);
  //     setPayoutData(dataItem?.data);
  //     setExpenseListData(dataItem?.data?.expenses);
  //     setPayoutListData(dataItem?.data?.payouts);
  //     setUserId(dataItem?.data?.producer?.user_id);
  //     setRevenueAmt(dataItem?.data?.revenue_amount);
  //     setExpenseAmt(dataItem?.data?.total_expenses);
  //     setIsPayout(dataItem?.data?.isPayout);
  //     setISAddEditPayout(dataItem?.data?.isPayoutAddEdit);
  //     setTotalProfile(
  //       dataItem?.data?.revenue_amount - dataItem?.data?.total_expenses
  //     );
  //     setpayoutAmt(dataItem?.data?.total_payout);
  //     setRemainingAmt(dataItem?.data?.remaining_amount);
  //   } catch (error) {
  //     console.error(error);
  //     LodingData(false);
  //   }
  // }

  // async function createPayoutAPI() {
  //   LodingData(true);
  //   const token = await AsyncStorage.getItem("token");
  //   const data: any = {};
  //   console.log("-----------dataprint-------------", JSON.stringify(data));
  //   try {
  //     const response = await fetch(
  //       process.env.API_URL +
  //         "/v3/events/event-financial/" +
  //         eventId +
  //         "/create",
  //       {
  //         method: "post",
  //         headers: new Headers({
  //           Authorization: "Bearer " + token,
  //           "Content-Type": "application/json",
  //         }),
  //       }
  //     );
  //     const dataItem = await response.json();
  //     console.log(dataItem);
  //     LodingData(false);

  //     if (dataItem.success) {
  //       setIsPayout(false);
  //     }
  //     Toast.show(dataItem?.message, Toast.LONG, {
  //       backgroundColor: "black",
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     LodingData(false);
  //   }
  // }

  // const editClick = (item: any, type: any) => {
  //   const tempData = {
  //     isPayoutorExpense: type,
  //     userSelectedData: item.user_id,
  //     profitAmt: payoutData?.total_profit,
  //     percentageAmount: item.amount_percent,
  //     description: item.description,
  //     images: item.images,
  //     eventId: eventId,
  //     amount: item.amount,
  //     expensePayoutID: item.key,
  //   };
  //   navigation?.navigate(navigations.EDITPAYOUTEXPENSE, {
  //     payoutExpenseObject: tempData,
  //     id: eventId,
  //   });
  // };

  const sendPayoutModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const sendPayoutClick = () => {
    setModalVisible(false);

    // mutateCreatePayout.mutate()
  };

  nav;

  return (
    <>
      {financials && (
        <View style={styles.eventContainerTwo}>
          {financials.revenueAmt > 0 ? (
            <View style={styles.eventListCont}>
              <Text style={styles.financialCont}>Financials</Text>

              <View style={styles.revenueCont}>
                <Text style={styles.revenueLbl}>Revenue</Text>
                <Text style={styles.revenueRuppes}>
                  ${financials.revenueAmt}
                </Text>
              </View>
              <View style={styles.revenueCont}>
                <Text style={styles.revenueLbl}>Expenses</Text>
                <Text style={styles.revenueRuppes}>
                  ${financials.expensesAmt}
                </Text>
              </View>
              <View style={styles.revenueCont}>
                <Text style={styles.revenueLbl}>Profit</Text>
                <Text style={styles.revenueRuppes}>
                  ${financials.totalProfile}
                </Text>
              </View>
              <View style={styles.payoutCont}>
                <Text style={styles.revenueLbl}>Payouts</Text>
                {financials.payoutAmt !== undefined ? (
                  <Text style={styles.revenueRuppes}>
                    {`$${Number(financials.payoutAmt.toFixed(2))}`}
                  </Text>
                ) : (
                  <Text>$0</Text>
                )}
              </View>
              <View style={styles.revenueCont}>
                <Text style={styles.revenueLbl}>Remaining</Text>
                {financials.remainingAmt !== undefined ? (
                  <Text style={styles.revenueRuppes}>
                    {`$${Number(financials.remainingAmt.toFixed(2))}`}
                  </Text>
                ) : (
                  <Text>$0</Text>
                )}
              </View>

              {/* {payout.isPayout ? ( */}
              <TouchableOpacity onPress={sendPayoutModal}>
                <View style={styles.payoutContainer}>
                  <View style={styles.payoutsubContainer}>
                    <ImageComponent
                      source={sendPayoutImg}
                      style={styles.payoutImg}
                    />
                    <Text style={styles.sendPayoutLbl}>send payouts</Text>
                  </View>
                </View>

                <View style={styles.payOutDetailsCont}>
                  <Text style={styles.payoutDetailsLbl}>
                    Payout can be sent 3 days after the event. All refunds must
                    happen within this time before a payout can be sent.
                  </Text>
                </View>
              </TouchableOpacity>
              {/* ) : (
                <View></View>
              )} */}
              {/* {/ { <\-------------------Expenses----------------------> /} */}
              <View>
                <View style={styles.userPayoutsStatementCont}>
                  <View style={styles.subStatementcont}>
                    <Text style={styles.expenensLbl}>Expenses</Text>
                  </View>
                </View>
                <FlatList
                  data={expenses}
                  renderItem={({ item }) => (
                    <View>
                      <View style={styles.userDetailsCont}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View style={styles.detailsSubCont}>
                            {isAddEditPayout ? (
                              <TouchableOpacity
                                onPress={() => editClick(item, "Expense")}
                              >
                                <ImageComponent
                                  source={edit2}
                                  style={styles.editIcon}
                                />
                              </TouchableOpacity>
                            ) : (
                              <></>
                            )}

                            <ImageComponent
                              source={{ uri: item.user.pic }}
                              resizeMode="cover"
                              style={styles.userImage}
                            />
                            <View style={styles.userNameCont}>
                              <Text style={styles.usernameLbl}>
                                {item.user.firstName} {item.user.lastName}
                              </Text>
                              <Text style={styles.payoutForLbl}>
                                Expense for: {item?.description}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.totalRupeesLbl}>
                            ${item?.amount}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                ></FlatList>
                {isAddEditPayout ? (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => openAddBreakDownModal(userId)}
                    style={styles.addItemCont}
                  >
                    <View style={styles.subAddItemCont}>
                      <Text style={styles.plusIcon}>+</Text>
                      <Text style={styles.addItemLbl}>add item</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
                <View style={styles.borderBottom}></View>
                <View style={styles.rupeesCont}>
                  <Text style={styles.rupeesLbl}>
                    ${financials.expensesAmt}
                  </Text>
                </View>
              </View>

              {/* {/ <\-------------------Payouts----------------------> /} */}
              <View>
                <View style={styles.userPayoutsStatementCont}>
                  <View style={styles.subStatementcont}>
                    <Text style={styles.expenensLbl}>Payouts</Text>
                  </View>
                </View>
                <FlatList
                  data={payouts}
                  renderItem={({ item }) => (
                    <View style={styles.userDetailsCont}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={styles.detailsSubCont}>
                          {isAddEditPayout ? (
                            <TouchableOpacity
                              onPress={() => editClick(item, "Payout")}
                            >
                              <ImageComponent
                                source={edit2}
                                style={styles.editIcon}
                              />
                            </TouchableOpacity>
                          ) : (
                            <></>
                          )}

                          <ImageComponent
                            source={{ uri: item.user.pic }}
                            resizeMode="cover"
                            style={styles.userImage}
                          />
                          <View style={styles.userNameCont}>
                            <Text style={styles.usernameLbl}>
                              {item.user.firstName} {item.user.lastName}
                            </Text>
                            <Text style={styles.payoutForLbl}>
                              Payout for: {item?.description}
                            </Text>
                          </View>
                        </View>
                        {item?.amount !== undefined ? (
                          <Text style={styles.revenueRuppes}>{`$${Number(
                            item?.amount.toFixed(2)
                          )}`}</Text>
                        ) : (
                          <Text>$0</Text>
                        )}
                      </View>
                    </View>
                  )}
                ></FlatList>
                {isAddEditPayout ? (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => openAddBreakDownModal(userId)}
                    style={styles.addItemCont}
                  >
                    <View style={styles.subAddItemCont}>
                      <Text style={styles.plusIcon}>+</Text>
                      <Text style={styles.addItemLbl}>add item</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}

                <View style={styles.borderBottom}></View>
                <View style={styles.rupeesCont}>
                  {financials.payoutAmt !== undefined ? (
                    <Text style={styles.rupeesLbl}>{`$${Number(
                      financials.payoutAmt.toFixed(2)
                    )}`}</Text>
                  ) : (
                    <Text>$0</Text>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View></View>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalContainerTwo}>
              <View style={styles.modalView}>
                <Text style={styles.sendPayoutLblTwo}>
                  Are you sure you want to send payout?
                </Text>
                <Text style={styles.sendingTextLbl}>
                  (you won't be able to make changes after sending)
                </Text>
                <TouchableOpacity
                  onPress={sendPayoutClick}
                  style={styles.payoutButtonCont}
                >
                  <Text style={styles.sendPayoutButton}>Send Payout</Text>
                  <ImageComponent
                    style={styles.sendIcon}
                    source={buttonArrowGreen}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.cancelButtonCont}
                >
                  <Text style={styles.sendPayoutButton}>Cancel</Text>
                  <ImageComponent
                    style={styles.sendIcon}
                    source={payoutClose}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};
