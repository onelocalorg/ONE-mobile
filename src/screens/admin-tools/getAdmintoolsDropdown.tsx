import { useAppTheme } from "@app-hooks/use-app-theme";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { createStyleSheet } from "./style";
import { dummy, sendPayoutImg } from "@assets/images";
import { ImageComponent } from "@components/image-component";
import { ModalRefProps } from "@components/modal-component";
import { TouchableOpacity } from "react-native";
import { API_URL, setData } from "@network/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native";
import { Loader } from "@components/loader";
import { useFocusEffect } from "@react-navigation/native";
import { EditPayoutModal } from "./editPayoutExpense-modal";
import Toast from "react-native-simple-toast";
import { AddPayoutExpenseModel } from "./addPayoutExpense-modal";

interface GetAdmintoolsDropDownScreenProps {
  eventId: string;
}

export const GetAdmintoolsDropDownScreen = (props: GetAdmintoolsDropDownScreenProps) => {

  const { theme } = useAppTheme(); 
  const styles = createStyleSheet(theme);
  const { eventId } = props || {};
  const [isLoading, LodingData] = useState(false);
  const addItemRef: React.Ref<ModalRefProps> = useRef(null);
  const editItemRef: React.Ref<ModalRefProps> = useRef(null);
  const [payoutData, setPayoutData]: any = useState({});
  const [userId, setUserId]: any = useState("");
  const [expenseListData, setExpenseListData]: any = useState([]);
  const [payoutListData, setPayoutListData]: any = useState([]);
  const [modalData, setModalData] = useState({});
  const [isPayout, setIsPayout] = useState(false);
  const [revenueAmt, setRevenueAmt] = useState(0);
  const [expensesAmt, setExpenseAmt]: any = useState();
  const [totalProfile, setTotalProfile]: any = useState();
  const [payoutAmt, setpayoutAmt]: any = useState();
  const [remainingAmt, setRemainingAmt]: any = useState();
  
  const openAddBreakDownModal = (id: any) => {
    setUserId(userId);
    addItemRef.current?.onOpenModal();
  };

  console.log(eventId, "------------------eventId11111111---------------");

  useFocusEffect(
    useCallback(() => {
      console.log(eventId, "------------getPayoutAPI--------------");
      getPayoutAPI();
    }, [eventId]) 
  ); 

  // </--------------getPayoutAPI---------------------->

  async function getPayoutAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");
    console.log("=========== createPayoutAPI Request ==============");
    try {
      const response = await fetch(
        API_URL + "/v1/events/event-financial/" + eventId,
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        }
      );
      console.log(API_URL + "/v1/events/event-financial/" + eventId);
      const dataItem = await response.json();
      console.log("=========== payout data from API==============", dataItem);
      LodingData(false);
      setPayoutData(dataItem?.data);
      setExpenseListData(dataItem?.data?.expenses);
      setPayoutListData(dataItem?.data?.payouts);
      setUserId(dataItem?.data?.producer?.user_id);
      setRevenueAmt(dataItem?.data?.revenue_amount);
      setExpenseAmt(dataItem?.data?.total_expenses);
      setIsPayout(dataItem?.data?.isPayout);
      setTotalProfile(
        dataItem?.data?.revenue_amount - dataItem?.data?.total_expenses
      );
      setpayoutAmt(dataItem?.data?.total_payout);
      setRemainingAmt(dataItem?.data?.remaining_amount);
      
    } catch (error) {
      console.error(error);
      LodingData(false);
    }
  }

  const onSuccessfulCreate = (payoutListData: any) => {
    addItemRef.current?.onCloseModal();
    console.log("-------------onSuccessfulCreate--------------");
    console.log(payoutListData);

    setPayoutData(payoutListData);
    setExpenseListData(payoutListData.expenses);
    setPayoutListData(payoutListData.payouts);
    setUserId(payoutListData.producer?.user_id);
    setRevenueAmt(payoutListData.revenue_amount);
    setExpenseAmt(payoutListData.total_expenses);
    setTotalProfile(
      payoutListData.revenue_amount - payoutListData.total_expenses
    );
    setpayoutAmt(payoutListData.total_payout);
    setRemainingAmt(payoutListData.remaining_amount);
  };

  //  // </---------------createPayoutAPI--------------------/>

  async function createPayoutAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");
    var data: any = {
    };
    console.log("-----------dataprint-------------", JSON.stringify(data));
    try {
      const response = await fetch(
        API_URL + "/v1/events/event-financial/" + eventId + "/create",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        }
      );
      const dataItem = await response.json();
      console.log(dataItem); 
      LodingData(false);
      
      if (dataItem.success) {
        setIsPayout(false);
      }
      Toast.show(dataItem?.message, Toast.LONG, {
        backgroundColor: "black",
      });

      console.log(dataItem);
    } catch (error) {
      console.error(error);
      LodingData(false);
    }
  }

  const editClick = (item:any, type:any) =>{
    editItemRef.current?.onOpenModal();
  }
 
  return (
    <>
      <Loader visible={isLoading} showOverlay />
      <View style={styles.eventContainerTwo}>
        
        {revenueAmt > 0 ? (
          <View style={styles.eventListCont}>
            <Text style={styles.financialCont}>Financials</Text>

            <View style={styles.revenueCont}>
              <Text style={styles.revenueLbl}>Revenue</Text>
              <Text style={styles.revenueRuppes}>${revenueAmt}</Text>
            </View>
            <View style={styles.revenueCont}>
              <Text style={styles.revenueLbl}>Expenses</Text>
              <Text style={styles.revenueRuppes}>${expensesAmt}</Text>
            </View>
            <View style={styles.revenueCont}>
              <Text style={styles.revenueLbl}>Profit</Text>
              <Text style={styles.revenueRuppes}>${totalProfile}</Text>
            </View>
            <View style={styles.payoutCont}>
              <Text style={styles.revenueLbl}>Payouts</Text>
              {payoutAmt !== undefined ? (
                <Text style={styles.revenueRuppes}>
                  {`$${Number(payoutAmt.toFixed(2))}`}
                </Text>
              ) : (
                <Text>$0</Text>
              )}
            </View>
            <View style={styles.revenueCont}>
              <Text style={styles.revenueLbl}>Remaining</Text>
              {remainingAmt !== undefined ? (
                <Text style={styles.revenueRuppes}>
                  {`$${Number(remainingAmt.toFixed(2))}`}
                </Text>
              ) : (
                <Text>$0</Text>
              )}
            </View>

            {isPayout ? (
              <TouchableOpacity onPress={createPayoutAPI}>
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
            ) : (
              <View></View>
            )}
            {/* {/ { <\-------------------Expenses----------------------> /} */}
            <View>
              <View style={styles.userPayoutsStatementCont}>
                <View style={styles.subStatementcont}>
                  <Text style={styles.expenensLbl}>Expenses</Text>
                </View>
              </View>
              <FlatList
                data={expenseListData}
                renderItem={({ item, index }) => (
                  <View>
                    <View style={styles.userDetailsCont}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={styles.detailsSubCont}>
                          <ImageComponent
                            source={{ uri: item?.user_id?.pic }}
                            resizeMode="cover"
                            style={styles.userImage}
                          />
                          <View style={styles.userNameCont}>
                            <Text style={styles.usernameLbl}>
                              {item?.user_id?.first_name}{" "}
                              {item?.user_id?.last_name}
                            </Text>
                            <Text style={styles.payoutForLbl}>
                              Payout for: {item?.description}
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
              <View style={styles.borderBottom}></View>
              <View style={styles.rupeesCont}>
                <Text style={styles.rupeesLbl}>${expensesAmt}</Text>
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
                data={payoutListData}
                renderItem={({ item, index }) => (
                  <View style={styles.userDetailsCont}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={styles.detailsSubCont}>
                        <TouchableOpacity onPress={() => editClick(item, index)}>
                          <ImageComponent
                            source={{ uri: item?.user_id?.pic }}
                            resizeMode="cover"
                            style={styles.userImage}
                          />
                        </TouchableOpacity>
                      
                        
                        <ImageComponent
                          source={{ uri: item?.user_id?.pic }}
                          resizeMode="cover"
                          style={styles.userImage}
                        />
                        <View style={styles.userNameCont}>
                          <Text style={styles.usernameLbl}>
                            {item?.user_id?.first_name}{" "}
                            {item?.user_id?.last_name}
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
              <View style={styles.borderBottom}></View>
              <View style={styles.rupeesCont}>
                {payoutAmt !== undefined ? (
                  <Text style={styles.rupeesLbl}>{`$${Number(
                    payoutAmt.toFixed(2)
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

          {/* type, userSelectedData, amount, percentageAmount, description, 
              imagearray,EventID, expensePayoutID, profitAmt */}
        <EditPayoutModal
          ref={editItemRef}
          id={eventId}
          revenue={payoutData?.revenue_amount}
          expense={payoutData?.total_expenses}
          payout={payoutData?.total_payout}
          profilt={payoutData?.total_profit}
          remainingAmt={payoutData?.remaining_amount}
          userId={userId}
          onSuccessFulData={onSuccessfulCreate}
        />

        <AddPayoutExpenseModel
          ref={addItemRef}
          id={eventId}
          revenue={payoutData?.revenue_amount}
          expense={payoutData?.total_expenses}
          payout={payoutData?.total_payout}
          profilt={payoutData?.total_profit}
          remainingAmt={payoutData?.remaining_amount}
          userId={userId}
          onSuccessFulData={onSuccessfulCreate}
        />
      </View>
    </>
  );
};
