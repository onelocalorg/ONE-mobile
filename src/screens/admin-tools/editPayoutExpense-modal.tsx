import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { createStyleSheet } from './style';
import { Alert, View } from 'react-native';
import { Text } from 'react-native';
import { useAppTheme } from '@app-hooks/use-app-theme';
import { useStringsAndLabels } from '@app-hooks/use-strings-and-labels';
import { TextInput } from 'react-native-gesture-handler';
import { ModalComponent, ModalRefProps } from '@components/modal-component';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, getData } from '@network/constant';
import { ScrollView } from 'react-native';
import { FlatList } from 'react-native';
import { ImageComponent } from '@components/image-component';
import { buttonArrowGreen, closeCard, redDeleteIcon, saveIcon } from '@assets/images';
import Toast from 'react-native-simple-toast';
import { Loader } from '@components/loader';
import { launchImageLibrary } from 'react-native-image-picker';
import { ButtonComponent } from '@components/button-component';
import { useFocusEffect } from '@react-navigation/native';

interface EditBreakDownModalProps {
  id: string;
  payoutExpenseObject: any,
  onSuccessFulData: (
    payoutListData: []
  ) => void;
}

// type, userSelectedData, amount, percentageAmount, description, imagearray,EventID, expensePayoutID, revenueAmt


export const editPayoutModalScreen = (props: EditBreakDownModalProps, ref: React.Ref<unknown> | undefined) => {

  const { payoutExpenseObject, id, onSuccessFulData } = props || {};
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const editItemRef: React.Ref<ModalRefProps> = useRef(null);
  const [isLoading, LodingData] = useState(false);
  const [isExpenseorPayout, setIsExpenseorPayout] = useState('Expense');
  const [priceData, setPriceData] = useState(1);
  const [amount, setAmount]: any = useState(0);
  const [descriptions, setDescriptions] = useState('');
  const [usertext, onUserSearch] = useState('');
  const [userList, recentlyJoinUser]: any = useState([]);
  const [usergratisList, userGratiesListData]: any = useState([]);
  const [userListArray, getUsetList]: any = useState();
  const [user_id, SetuserData] = useState({});
  const [imageSelectArray, setImageSelectArray]: any = useState([]);
  const [imageSelectArrayKey, setImageSelectArrayKey]: any = useState([]);
  const [newUserId, setNewUserIdData]: any = useState('');
  const [payoutListData, setPayoutListData]: any = useState([]);
  const [expensePayoutID, setExpensePayoutID]: any = useState();


  useFocusEffect(
    useCallback(() => {
      console.log('-----------payoutExpenseObject----------------', payoutExpenseObject);
      if (payoutExpenseObject != undefined) {
        recentlyJoinUser([payoutExpenseObject?.userSelectedData])
        setNewUserIdData(payoutExpenseObject?.userSelectedData.id)
        setIsExpenseorPayout(payoutExpenseObject?.isPayoutorExpense);
        setDescriptions(payoutExpenseObject?.description);
        setExpensePayoutID(payoutExpenseObject?.expensePayoutID)

        if (payoutExpenseObject?.images.length > 0) {
          setImageSelectArray(payoutExpenseObject?.images);

          var imageKeyArry = [];
          for (let index = 0; index < payoutExpenseObject?.images.length; index++) {
            imageKeyArry.push(payoutExpenseObject?.images[index]['key']);
          }
          setImageSelectArrayKey(imageKeyArry);
        }
        if (payoutExpenseObject?.percentageAmount > 0) {
          setAmount(payoutExpenseObject.percentageAmount.toString())
          setPriceData(2)
        } else {
          setAmount(payoutExpenseObject.amount.toString())
          setPriceData(1)
        }
      }
    }, [payoutExpenseObject])
  );

  const expenseContClick = (item: any) => {
    setIsExpenseorPayout(item);
  };

  const priceClick = (item: any) => {
    setPriceData(item);
  }


  const AddUserList = (item: any) => {
    const found = userList.find((element: any) => element.id == item.id);
    if (userList.length < 1) {
      if (!found) {
        recentlyJoinUser([...userList, item]);
        const newItems = { ...item };
        delete newItems.gratisNo;
        const newuserData = { ...newItems, first_name: item.first_name, last_name: item.last_name, pic: item.pic, id: item.id };
        SetuserData(newuserData);
        getUsetList([newuserData]);
        setNewUserIdData(newuserData.id)
      } else {
        Toast.show('Already Added', Toast.LONG, {
          backgroundColor: 'black',
        });
      }
    }
    else {
      Toast.show('You can not select more than one users', Toast.LONG, {
        backgroundColor: 'black',
      });
    }
  };

  const removeuserSelect = (id: any) => {
    const newPeople = userList.filter((person: any) => person !== id);
    recentlyJoinUser(newPeople);
  };

  async function gratisUserList(textUser: any) {
    const token = await AsyncStorage.getItem('token');
    var datas: any = {
      searchtext: textUser,
    };
    onUserSearch(textUser);
    LodingData(true);
    console.log(datas);
    console.log(API_URL + '/v1/users/search-user?searchtext=' + textUser);
    try {
      const response = await fetch(
        API_URL + '/v1/users/search-user?searchtext=' + textUser,
        {
          method: 'get',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        },
      );
      const dataItem = await response.json();
      const result = dataItem?.data?.map((item: any) => {
        return { ...item };
      });
      userGratiesListData(result);
      console.log(dataItem);
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  // </---------------EditPayoutAPI--------------------/>

  async function editExpenseAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem('token');
    var url = API_URL + '/v1/events/event-financial/' + id + '/edit/expense';
    var item: any = {
      user_id: newUserId,
      amount: amount,
      description: descriptions,
      type: 'price',
      images: imageSelectArrayKey,
      key: expensePayoutID
    };
    console.log('------------editExpenseAPI url-------------', url)
    console.log('------------editExpenseAPI request-------------', item)

    try {
      const response = await fetch(url, {
        method: 'post',
        headers: new Headers({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(item),
      },
      );

      const dataItem = await response.json();
      console.log('------------editExpenseAPI response-------------', dataItem)
      LodingData(false);
      if (dataItem.success) {
        onSuccessFulData(dataItem.data);
        resetState();
      } else {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }
    } catch (error) {
      console.error(error);
      LodingData(false);
    }
  }

  async function editPayoutAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem('token');
    var url = API_URL + '/v1/events/event-financial/' + id + '/edit/payout';

    var getAmount = (payoutExpenseObject?.profitAmt * amount) / 100;
    console.log(getAmount, '---------------getAmount-----------')
    if (priceData === 1) {
      var item: any = {
        user_id: newUserId,
        amount: amount,
        description: descriptions,
        type: 'price',
        images: imageSelectArrayKey,
        amount_percent: 0,
        key: expensePayoutID
      };
    } else {
      var item: any = {
        user_id: newUserId,
        amount: getAmount,
        description: descriptions,
        type: 'percentage',
        images: imageSelectArrayKey,
        amount_percent: amount,
        key: expensePayoutID
      };
    }

    console.log('------------editPayoutAPI url-------------', url)
    console.log('------------editPayoutAPI request-------------', item)

    try {
      const response = await fetch(url, {
        method: 'post',
        headers: new Headers({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(item),
      },
      );
      const dataItem = await response.json();
      console.log('------------editPayoutAPI response-------------', dataItem)
      LodingData(false);
      if (dataItem.success) {
        onSuccessFulData(dataItem.data);
        resetState();
      } else {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }

    } catch (error) {
      console.error(error);
      LodingData(false);
    }
  }

  // </---------------Delete Expense and Payout--------------------/>
 
  const deleteClick = () => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete it?',
      [
        {
          text: 'Yes', onPress: () => {
            if (isExpenseorPayout == 'Expense') {
              deleteExpenseAPI();
            } else {
              deletePayoutAPI();
            }
          }, style: "destructive"
        },
        {
          text: 'No',
          onPress: () => {
            
          },
        },
      ],
      { cancelable: false }
    );
    // postContentModal(false);
  };

  async function deleteExpenseAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem('token');
    var url = API_URL + '/v1/events/event-financial/' + id + '/delete/expense'
    var dataReq = {
      key: expensePayoutID
    }
    console.log('-------------deletePayoutAPI url--------', url);
    console.log('-------------deletePayoutAPI Request--------', dataReq);
    try {
      const response = await fetch(url,
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(dataReq),
        },
      );
      const dataItem = await response.json();
      console.log('-------------deletePayoutAPI Response--------', dataItem);
      LodingData(false);
      if (dataItem.success) {
        onSuccessFulData(dataItem.data);
        resetState();
      } else {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }
    } catch (error) {
      console.error(error);
      LodingData(false);
    }
  }

  async function deletePayoutAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem('token');
    var url = API_URL + '/v1/events/event-financial/' + id + '/delete/payout'
    var dataReq = {
      key: expensePayoutID
    }
    console.log('-------------deletePayoutAPI url--------', url);
    console.log('-------------deletePayoutAPI Request--------', dataReq);
    try {
      const response = await fetch(url,
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(dataReq),
        },
      );
      const dataItem = await response.json();
      console.log('-------------deletePayoutAPI Response--------', dataItem);
      LodingData(false);
      if (dataItem.success) {
        onSuccessFulData(dataItem.data);
        resetState();
      } else {
        Toast.show(dataItem?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }
    } catch (error) {
      console.error(error);
      LodingData(false);
    }
  }


  const openGallary = async () => {

    const { assets } = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 800,
      maxHeight: 800,
    });
    console.log(assets);
    if (assets) {
      const img = assets?.[0];
      console.log(assets);
      var fileNameTwo = img?.fileName ?? '';
      LodingData(true);
      var output =
        fileNameTwo.substr(0, fileNameTwo.lastIndexOf('.')) || fileNameTwo;
      var base64Two = img?.base64 ?? '';
      postImageUploadAPI(output, base64Two);
    }
  }

  const postImageUploadAPI = async (fileItem: any, base64Item: any) => {
    const token = await AsyncStorage.getItem('token');
    var pic: any = {
      uploadKey: 'createPostImg',
      imageName: fileItem,
      base64String: 'data:image/jpeg;base64,' + base64Item,
    };

    console.log('================ postImageUploadAPI Request=================');
    try {
      const response = await fetch(API_URL + '/v1/users/upload/file', {
        method: 'post',
        headers: new Headers({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(pic),
      });
      const dataItem = await response.json();
      var tempData = imageSelectArray;
      tempData.push(dataItem?.data);
      setImageSelectArray(tempData);
      console.log(' console.log(imageSelectArray)', imageSelectArray)
      var tempTwo = imageSelectArrayKey;

      tempTwo.push(dataItem?.data?.key)
      setImageSelectArrayKey(tempTwo);
      console.log(' console.log(imageSelectArrayKey)', imageSelectArrayKey)
      LodingData(false);
    } catch (error) {
      console.log(error);
      LodingData(false);
    }
  };

  const submitClick = () => {
    if (amount < 0) {
      Toast.show('Enter Ammount', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else if (descriptions.length === 0) {
      Toast.show('Enter Descriptions', Toast.LONG, {
        backgroundColor: 'black',
      });
    }
    else if (imageSelectArray.length === 0) {
      Toast.show('Add Image to Post', Toast.LONG, {
        backgroundColor: 'black',
      });
    }
    else {
      if (isExpenseorPayout === 'Expense') {
        console.log('----------------borderData === Expense--------------------')
        editExpenseAPI();
      } else {
        console.log('----------------borderData === payout--------------------')
        editPayoutAPI();
      }


    }

  }


  const resetState = () => {
    onUserSearch('');
    setDescriptions('');
    setAmount('');
    setImageSelectArray([]);
    SetuserData({});
    recentlyJoinUser([]);
  };

  const removeSelectImage = (imageItem: any) => {
    console.log(imageItem)
    const newImage = imageSelectArray.filter(
      (person: any) => person.imageUrl !== imageItem.imageUrl && person.key !== imageItem.key
    );

    setImageSelectArray(newImage);

    const newImageKey = imageSelectArrayKey.filter(
      (person: any) => person !== imageItem.key
    );
    setImageSelectArrayKey(newImageKey);

    console.log(newImage)
  };

  const closeModel = () => {
    console.log('--------close model-----------')
    onSuccessFulData([]);
  }

  return (
    <>
      <View style={styles.breakDownCont}>
        <ModalComponent ref={ref}>
          <Loader visible={isLoading} showOverlay />
          <View style={styles.subBreakdowncont}>
            <ScrollView showsVerticalScrollIndicator={false}>

              <View style={{ marginTop: 5, marginLeft: 0, paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={closeModel}>
                  <ImageComponent
                    source={closeCard}
                    style={{ height: 24, width: 26, zIndex: 123 }}
                  ></ImageComponent>
                </TouchableOpacity>
                <Text style={styles.breakdownHeader}>Add Breakdown</Text>
              </View>


              <View style={styles.payModalContainer}>
                <Text style={styles.whoCont}>Who:</Text>
                <View>
                  <TextInput
                    placeholder="select who to pay"
                    placeholderTextColor="darkgray"
                    value={usertext}
                    onChangeText={text => gratisUserList(text)}
                    style={styles.payInput}></TextInput>
                </View>
              </View>

              <View style={styles.avatarContainer}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {userList.map((userList: any) => {
                    return (
                      <TouchableOpacity
                        onPress={() => removeuserSelect(userList)}>
                        <ImageComponent
                          style={styles.avatarImage}
                          isUrl={!!userList?.pic}
                          resizeMode="cover"
                          uri={userList?.pic}></ImageComponent>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {usertext.length !== 0 ? (
                <View
                  style={{
                    borderWidth: 1,
                    marginVertical: 10,
                    marginHorizontal: 10,
                    marginRight: 20,
                    borderRadius: 10,
                    maxHeight: 275,
                    overflow: 'hidden',
                    height: 'auto',
                  }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <FlatList
                      data={usergratisList}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          activeOpacity={1}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 5,
                            borderBottomWidth: 1,
                            borderColor: 'gray',
                            paddingVertical: 8,
                          }}>
                          <View style={{ flexDirection: 'row', marginRight: 50 }}>
                            <ImageComponent
                              style={{
                                height: 30,
                                width: 30,
                                marginRight: 20,
                                marginLeft: 10,
                                borderRadius: 100,
                              }}
                              resizeMode="cover"
                              source={{ uri: item?.pic }}></ImageComponent>
                            <Text
                              numberOfLines={1}
                              style={{
                                alignSelf: 'center',
                                flexShrink: 1,
                                width: 150,
                                color: theme.colors.black
                              }}>
                              {item?.first_name} {item?.last_name}
                            </Text>

                            <TouchableOpacity onPress={() => AddUserList(item)}>
                              <ImageComponent
                                style={{
                                  height: 20,
                                  width: 20,
                                  marginLeft: 20,
                                  marginTop: 2,
                                }}
                                source={buttonArrowGreen}></ImageComponent>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      )}></FlatList>
                  </ScrollView>
                </View>
              ) : (
                <View></View>
              )}

              <View style={styles.TypeModalContainer}>
                <Text style={styles.typeCont}>Type:</Text>
                <View style={styles.typeDisplayCont}>
                  {isExpenseorPayout === 'Expense' ?
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => expenseContClick('Expense')}>
                      <Text
                        style={[
                          isExpenseorPayout === 'Expense'
                            ? styles.typeLbl
                            : styles.typeLblTwo,
                        ]}>
                        Expense
                      </Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => expenseContClick('Payout')}>
                      <Text
                        style={[
                          isExpenseorPayout === 'Payout'
                            ? styles.typeLbl
                            : styles.typeLblTwo,
                        ]}>
                        Payout
                      </Text>
                    </TouchableOpacity>
                  }


                </View>
              </View>

              <View style={styles.amountCont}>
                <Text style={styles.amountLbl}>Ammount</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => priceClick(1)}>
                  <View style={[
                    priceData === 1
                      ? styles.priceContainer : styles.priceContainerTwo,
                  ]}>
                    <Text style={styles.percentageSign}>$</Text>
                  </View>
                </TouchableOpacity>
                {isExpenseorPayout !== 'Expense' ?
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => priceClick(2)}>
                    <View
                      style={[
                        priceData === 2
                          ? styles.priceContainer : styles.priceContainerTwo,
                      ]}>
                      <Text style={styles.percentageSign}>%</Text>
                    </View>
                  </TouchableOpacity> : <View></View>}
                <View style={{ flexDirection: 'row', width:150 }}>
                  <Text style={styles.dollarIcon}>{priceData === 1 ? '$ ' : '% '}</Text>
                  <TextInput
                    value={amount}
                    keyboardType='number-pad'
                    onChangeText={text => setAmount(text)}
                    style={styles.dollarRupees}></TextInput>
                </View>
              </View>

              <View style={styles.descriptionCont}>
                <Text style={styles.descpLbl}>Description</Text>
                <View>
                  <TextInput
                    value={descriptions}
                    onChangeText={text => setDescriptions(text)}
                    style={styles.payoutDescLbl}></TextInput>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: '#A9A9A9',
                  height: 1,
                  marginRight: 20,
                }}></View>
              <View style={styles.mediaCont}>
                <Text style={styles.mediaLbl}>Media</Text>
                <TouchableOpacity onPress={openGallary}>
                  <Text style={styles.addPhotosCont}>add photos</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.multipleImagecont}>
                {imageSelectArray.map((item: any) => {
                  return (
                    <TouchableOpacity
                      onPress={() => removeSelectImage(item)}
                    >
                      <ImageComponent source={{ uri: item?.imageUrl }} style={styles.selectImage}></ImageComponent>
                    </TouchableOpacity>
                  );
                })}

              </View>

              <View style={styles.submitButton}>
                <TouchableOpacity activeOpacity={0.8} onPress={submitClick}>
                  <ImageComponent source={saveIcon} style={styles.saveIcon}></ImageComponent>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteClick}>
                  <ImageComponent source={redDeleteIcon} style={styles.deleteIcon}></ImageComponent>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </ModalComponent>
      </View>
    </>
  );
};

export const EditPayoutModal = forwardRef(editPayoutModalScreen);
