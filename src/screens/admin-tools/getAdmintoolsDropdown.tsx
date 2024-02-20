import {useAppTheme} from '@app-hooks/use-app-theme';
import React, {useEffect, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import {createStyleSheet} from './style';
import {dummy, sendPayoutImg} from '@assets/images';
import {ImageComponent} from '@components/image-component';
import {ModalRefProps} from '@components/modal-component';
import {TouchableOpacity} from 'react-native';
import {API_URL} from '@network/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BreakDownModal} from './add-breakDown-modal';
import {FlatList} from 'react-native';
import {Loader} from '@components/loader';

interface GetAdmintoolsDropDownScreenProps {
  eventId: string;
  isPayout: boolean;
  viewCount: number;
}

export const GetAdmintoolsDropDownScreen = (
  props: GetAdmintoolsDropDownScreenProps,
) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {eventId, isPayout, viewCount} = props || {};
  const [isLoading, LodingData] = useState(false);
  const addItemRef: React.Ref<ModalRefProps> = useRef(null);
  const [payoutData, setPayoutData]: any = useState({});
  const [userId, setUserId]: any = useState('');
  const [expenseListData, setExpenseListData]: any = useState([]);
  const [payoutListData, setPayoutListData]: any = useState([]);

  const openAddBreakDownModal = (id: any) => {
    setUserId(userId);
    // addItemRef.current?.onOpenModal();
  };

  console.log(
    eventId,'------------------eventId11111111---------------',
  );

  useEffect(() => {
    getPayoutAPI();
  }, [eventId]);


  // </--------------getPayoutAPI---------------------->
  async function getPayoutAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem('token');

    console.log('=========== createPayoutAPI Request ==============');

    try {
      const response = await fetch(
        API_URL + '/v1/events/event-financial/' + eventId,
        // API_URL + '/v1/events/event-financial/6565af618267f45414608d66',
        {
          method: 'get',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          }),
        },
      );
      const dataItem = await response.json();
      LodingData(false);
      console.log('=========== createPayoutAPI==============');
      setPayoutData(dataItem?.data);
      setExpenseListData(dataItem?.data?.expenses);
      setPayoutListData(dataItem?.data?.payouts);
      setUserId(payoutData?.producer?.user_id);
      console.log(dataItem);
    } catch (error) {
      console.error(error);
      LodingData(false);
    }
  }

  const onSuccessfulCreate = () => {
    addItemRef.current?.onCloseModal();
  };

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

        {payoutData !== null && eventId !== undefined ? (
          <View style={styles.eventListCont}>
            <Text style={styles.financialCont}>Financials</Text>

            <View style={styles.revenueCont}>
              <Text style={styles.revenueLbl}>Revenue</Text>
              <Text style={styles.revenueRuppes}>
                ${payoutData?.revenue_amount}
              </Text>
            </View>
            <View style={styles.revenueCont}>
              <Text style={styles.revenueLbl}>Expenses</Text>
              <Text style={styles.revenueRuppes}>
                ${payoutData?.total_expenses}
              </Text>
            </View>
            <View style={styles.revenueCont}>
              <Text style={styles.revenueLbl}>Profit</Text>
              <Text style={styles.revenueRuppes}>
                ${payoutData?.total_profit}
              </Text>
            </View>
            <View style={styles.payoutCont}>
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
            </View>

            {isPayout ? (
              <View>
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
              </View>
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
                renderItem={({item, index}) => (
                  <View>
                    <View style={styles.userDetailsCont}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={styles.detailsSubCont}>
                          <ImageComponent
                            source={{uri: item?.user_id?.pic}}
                            resizeMode="cover"
                            style={styles.userImage}
                          />
                          <View style={styles.userNameCont}>
                            <Text style={styles.usernameLbl}>
                              {item?.user_id?.first_name}{' '}
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
                  
                )}></FlatList>
              <TouchableOpacity activeOpacity={1}
                onPress={() => openAddBreakDownModal(userId)}
                style={styles.addItemCont}>
                <View style={styles.subAddItemCont}>
                  <Text style={styles.plusIcon}>+</Text>
                  <Text style={styles.addItemLbl}>add item</Text>
                </View>
              </TouchableOpacity >
              <View style={styles.borderBottom}></View>
              <View style={styles.rupeesCont}>
                <Text style={styles.rupeesLbl}>
                  ${payoutData?.total_expenses}
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
                renderItem={({item}) => (
                  <View style={styles.userDetailsCont}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={styles.detailsSubCont}>
                        <ImageComponent
                          source={{uri: item?.user_id?.pic}}
                          resizeMode="cover"
                          style={styles.userImage}
                        />
                        <View style={styles.userNameCont}>
                          <Text style={styles.usernameLbl}>
                            {item?.user_id?.first_name}{' '}
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
                )}></FlatList>
              <TouchableOpacity activeOpacity={1}
                onPress={() => openAddBreakDownModal(userId)}
                style={styles.addItemCont}>
                <View style={styles.subAddItemCont}>
                  <Text style={styles.plusIcon}>+</Text>
                  <Text style={styles.addItemLbl}>add item</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.borderBottom}></View>
              <View style={styles.rupeesCont}>
                <Text style={styles.rupeesLbl}>
                  ${payoutData?.total_payout}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View></View>
        )}

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
