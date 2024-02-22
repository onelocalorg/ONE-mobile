import { useAppTheme } from "@app-hooks/use-app-theme";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { createStyleSheet } from "./style";
import { dummy, sendPayoutImg } from "@assets/images";
import { ImageComponent } from "@components/image-component";
import { ModalRefProps } from "@components/modal-component";
import { TouchableOpacity } from "react-native";
import { API_URL } from "@network/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BreakDownModal } from "./add-breakDown-modal";
import { FlatList } from "react-native";
import { Loader } from "@components/loader";
import { useFocusEffect } from "@react-navigation/native";

interface GetAdmintoolsDropDownScreenProps {
  eventId: string;
  isPayout: boolean;
  viewCount: number;
}

export const GetAdmintoolsDropDownScreen = (
  props: GetAdmintoolsDropDownScreenProps
) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { eventId, isPayout, viewCount } = props || {};
  const [isLoading, LodingData] = useState(false);
  const addItemRef: React.Ref<ModalRefProps> = useRef(null);
  const [payoutData, setPayoutData]: any = useState({});
  const [userId, setUserId]: any = useState("");
  const [expenseListData, setExpenseListData]: any = useState([]);
  const [payoutListData, setPayoutListData]: any = useState([]);
  const [modalData, setModalData] = useState({});
  const [revenueAmt, setRevenueAmt] = useState(0);
  const [expensesAmt, setExpenseAmt]: any = useState();
  const [totalProfile, setTotalProfile]: any = useState();
  const [payoutAmt, setpayoutAmt]: any = useState();
  const [remainingAmt, setRemainingAmt]: any = useState();
  const [payOutsArray, setPayoutValues]: any = useState([]);
  const [expenseArray, setExpenseValues]: any = useState([]);
  const [expenseValueData, setnewExpenseArray]: any = useState([]);

  const openAddBreakDownModal = (id: any) => {
    setUserId(userId);
    addItemRef.current?.onOpenModal();
  };

  console.log(eventId, "------------------eventId11111111---------------");

  useFocusEffect(
    useCallback(() => {
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
        // API_URL + '/v1/events/event-financial/6194099bd5397a4e5c65e0e2',
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        }
      );
      const dataItem = await response.json();
      LodingData(false);
      console.log("=========== createPayoutAPI==============");
      setPayoutData(dataItem?.data);
      setExpenseListData(dataItem?.data?.expenses);
      setPayoutListData(dataItem?.data?.payouts);
      setUserId(dataItem?.data?.producer?.user_id);
      setRevenueAmt(dataItem?.data?.revenue_amount);
      setExpenseAmt(dataItem?.data?.total_expenses);
      setTotalProfile(
        dataItem?.data?.revenue_amount - dataItem?.data?.total_expenses
      );
      setpayoutAmt(dataItem?.data?.total_payout);
      setRemainingAmt(dataItem?.data?.remaining_amount);
      console.log(dataItem);
    } catch (error) {
      console.error(error);
      LodingData(false);
    }
  }

  const onSuccessfulCreate = (
    amount: any,
    descriptions: String,
    imageSelectArrayKey: [],
    user_id: {},
    borderData: string,
    type: any
  ) => {
    addItemRef.current?.onCloseModal();
    var data: any = {
      type: type,
      user_id,
      amount: parseInt(amount),
      description: descriptions,
      images: imageSelectArrayKey,
    };
    setModalData(data);
    console.log("------------modalData----------", data);
    const newuserData: any = { ...data };
    const FilterDataExpense: any = { ...data };
    const FilterDataPayouts: any = { ...data };
    delete FilterDataExpense.type;

    if (borderData === "Expense") {
      const newuserExpense = {
        ...FilterDataExpense,
        user_id: data["user_id"]["id"],
        amount: data.amount,
        description: data.description,
        images: data.images,
      };
      setExpenseValues([...expenseArray, newuserExpense]);
      setnewExpenseArray([newuserExpense]);
      console.log(expenseArray, "newuserExpense11111 newuserExpense");
      console.log(newuserExpense, "newuserExpense newuserExpense");
      setExpenseListData([...expenseListData, newuserData]);
      setExpenseAmt(expensesAmt + parseInt(newuserData["amount"]));
      setTotalProfile(revenueAmt - parseInt(newuserData["amount"]));
      console.log(
        revenueAmt - parseInt(newuserData["amount"]),
        "-----------totalProfile------------"
      );

      setRemainingAmt(revenueAmt - newuserData["amount"] - payoutAmt);
      console.log(remainingAmt, "-----------remainimgAmt------------");
    }

    if (borderData === "payout") {
      if (data.type === 1) {
        const newuserPayouts = {
          ...FilterDataPayouts,
          user_id: data["user_id"]["id"],
          amount: data.amount,
          description: data.description,
          images: data.images,
          type: data.type === 1 ? "price" : "percentage",
        };
        setPayoutValues([...payOutsArray, newuserPayouts]);
        console.log(newuserPayouts, "newuserPayouts newuserPayouts");
      } else {
        var getAmount = (totalProfile * data.amount) / 100;
        const newuserPayouts = {
          ...FilterDataPayouts,
          user_id: data["user_id"]["id"],
          amount: getAmount,
          description: data.description,
          images: data.images,
          type: data.type === 1 ? "price" : "percentage",
          amount_percent: amount,
        };
        setPayoutValues([...payOutsArray, newuserPayouts]);
        console.log(newuserPayouts, "newuserPayouts newuserPayouts");
      }

      setPayoutListData([...payoutListData, newuserData]);
      setpayoutAmt(payoutAmt + parseInt(newuserData["amount"]));
      setTotalProfile(revenueAmt - newuserData["amount"]);
      console.log(
        revenueAmt - newuserData["amount"],
        "-----------remainimgAmt2222222------------"
      );
      setRemainingAmt(revenueAmt - newuserData["amount"] - payoutAmt);
      console.log(remainingAmt, "-----------remainimgAmt1111111------------");
    }

    console.log(payoutAmt);
    console.log(parseInt(newuserData["amount"]));
  };

  //  // </---------------createPayoutAPI--------------------/>
  async function createPayoutAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem("token");
    var data: any = {
      revenue_amount: revenueAmt,
      total_expenses: expensesAmt,
      total_payout: payoutAmt,
      total_profit: totalProfile,
      remaining_amount: remainingAmt,
      // expenses: expenseArray,
      expenses: expenseValueData,
      payouts: payOutsArray,
    };
    console.log("-----------dataprint-------------", JSON.stringify(data));
    try {
      const response = await fetch(
        // API_URL + '/v1/events/event-financial/' + id,
        API_URL + "/v1/events/event-financial/" + eventId + "/create",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          // body: JSON.stringify(data),
          // body: Object.keys(data)
          // .map(key => key + '=' + data[key])
          // .join('&'),
        }
      );
      const dataItem = await response.json();
      LodingData(false);

      console.log(dataItem);
    } catch (error) {
      console.error(error);
      LodingData(false);
    }
  }

  return (
    <>
      <Loader visible={isLoading} showOverlay />
      <View style={styles.eventContainerTwo}>
        <View style={styles.uniqueViewCont}>
          <Text style={styles.uniqueViewLbl}>Unique Views</Text>
          <Text style={styles.uniqueCount}>{viewCount}</Text>
        </View>

        {/* <View style={styles.cancelEventCont}>
          <Text style={styles.cancelEventLbl}>Cancel Event</Text>
        </View> */}

        {/* {payoutData !== null && eventId !== undefined ? ( */}
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

          {/* <View style={styles.payoutCont}>
              <Text style={styles.revenueLbl}>Payouts</Text>
              <Text style={styles.revenueRuppes}>
                ${payoutData?.total_payout}
              </Text>
            </View>
            <View style={styles.revenueCont}>
              <Text style={styles.revenueLbl}>Remaining</Text>
              <Text style={styles.revenueRuppes}>
                ${payoutData?.remaining_amount}
              </Text>
            </View> */}

          {!isPayout ? (
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
          {/* { <\-------------------Expenses----------------------> */}
          <View>
            <View style={styles.userPayoutsStatementCont}>
              <View style={styles.subStatementcont}>
                <Text style={styles.expenensLbl}>Expenses</Text>
                {/* <Text style={styles.expenensLblTwo}>No expenses yet</Text> */}
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
                      <Text style={styles.totalRupeesLbl}>${item?.amount}</Text>
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
              <Text style={styles.rupeesLbl}>
              ${expensesAmt}
              </Text>
            </View>
          </View>

          {/* <\-------------------Payouts----------------------> */}
          <View>
            <View style={styles.userPayoutsStatementCont}>
              <View style={styles.subStatementcont}>
                <Text style={styles.expenensLbl}>Payouts</Text>
                {/* <Text style={styles.expenensLblTwo}>No expenses yet</Text> */}
              </View>
            </View>
            <FlatList
              data={payoutListData}
              renderItem={({ item }) => (
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
                          {item?.user_id?.first_name} {item?.user_id?.last_name}
                        </Text>
                        <Text style={styles.payoutForLbl}>
                          Payout for: {item?.description}
                        </Text>
                      </View>
                    </View>
                    {/* <Text style={styles.totalRupeesLbl}>${item?.amount}</Text> */}
                    {item?.amount !== undefined ? 
                      <Text style={styles.revenueRuppes}>{`$${Number(item?.amount.toFixed(2))}`}</Text> : <Text>$0</Text>}
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
              {/* <Text style={styles.rupeesLbl}>${payoutData?.total_payout}</Text> */}
              {payoutAmt !== undefined ? 
                      <Text style={styles.rupeesLbl}>{`$${Number(payoutAmt.toFixed(2))}`}</Text> : <Text>$0</Text>}
            </View>
          </View>
        </View>
        {/* ) : (
          <View></View>
        )} */}

        <BreakDownModal
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
