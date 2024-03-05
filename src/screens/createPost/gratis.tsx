import React, {useEffect, useRef, useState} from 'react';
import {createStyleSheet} from './style';
import {useAppTheme} from '@app-hooks/use-app-theme';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  ListRenderItem,
  LogBox,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {ImageComponent} from '@components/image-component';
import {
  Gratis,
  addGreen,
  apple,
  arrowDown,
  arrowLeft,
  bell,
  blackOffer,
  buttonArrowGreen,
  dummy,
  gratitudeBlack,
  greenOffer,
  minus,
  onelogo,
  pin,
  plus,
  postCalender,
  request,
} from '@assets/images';
import {NavigationContainerRef, ParamListBase} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import GetLocation from 'react-native-get-location';
import Popover, {PopoverPlacement, Rect} from 'react-native-popover-view';
import {SizedBox} from '@components/sized-box';
import {verticalScale} from '@theme/device/normalize';
import {
  DatePickerRefProps,
  DateRangePicker,
} from '@components/date-range-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Toast from 'react-native-simple-toast';
import {Loader} from '@components/loader';
import {navigations} from '@config/app-navigation/constant';
import {ScrollView} from 'react-native';
import {Pill} from '@components/pill';
import {FlatListComponent} from '@components/flatlist-component';
import {width} from '@theme/device/device';
import { API_URL } from '@network/constant';

interface CreatePostGratisScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
}

export const CreatePostGratisScreen = (props: CreatePostGratisScreenProps) => {
  const {navigation} = props || {};
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {strings} = useStringsAndLabels();
  const [selecttype, createPostSelectType] = useState(1);
  const [type, createPostType] = useState('offer');
  const [typeIconWhat, getTypeIconWhat]: any = useState();
  const [showWhatPopover, setWhatShowPopover] = useState(false);
  const [getResourcewhatList, getResourseDatawhat]: any = useState([]);
  const [getResourcefromList, getResourseDataFrom]: any = useState([]);
  const [getResourceToList, getResourseDataTo]: any = useState([]);
  const [getResourceForLis, getResourseDataFor]: any = useState([]);
  const [whatSelectType, getWhatTypeValue]: any = useState();
  const [postImage, setCreatePostUri]: any = useState([]);
  const [forName, createPostforName] = useState('');
  const [forQuantity, createPostforQuantity] = useState('');
  const [whereAddress, createPostwhereAddress] = useState('');
  const [imageKey, selectedImageKey] = useState();
  const [when, createPostwhen] = useState(new Date());
  const [content, createPostcontent] = useState('');
  const [tags, createPosttags]: any = useState('');
  const [tagArray, tagselectArray]: any = useState([]);
  const [whatName, createPostwhatName] = useState('');
  const [addnewCmt, onAddComment] = useState('');
  const [addnewCmtReply, onAddCommentReply] = useState('');
  var [whatQuantity, createPostwhatQuantity] = useState(1);
  const [typeIconTo, getTypeIconTo]: any = useState();
  const [typrTovalue, getToTypeValue]: any = useState();
  const [showToPopover, setToShowPopover] = useState(false);
  const [isLoading, LodingData] = useState(false);
  const [isuser, userCheck] = useState(false);
  const [usergratisList, userGratiesListData]: any = useState([]);
  var [location, setUserLocation]: any = useState();
  const [userList, recentlyJoinUser]: any = useState([]);
  const [userListArray, getUsetList]: any = useState([]);
  const [imageArray, setImageArray]: any = useState([]);
  const [imageArrayKey, setImageArrayKey]:any = useState([]);
  var [gratisNo, totalGratisData]: any = useState(1);
  const [usertext, onUserSearch] = useState('');
  const datePickerRef: React.Ref<DatePickerRefProps> = useRef(null);

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    LogBox.ignoreAllLogs();
    requestLocationPermission();
    getResourcesAPI();
  }, []);

  const createPostSetType = (text: any, type: any) => {
    createPostSelectType(text);
    createPostType(type);
  };

  const selectWhatTypePost = (icon: any, type: any) => {
    getTypeIconWhat(icon);
    getWhatTypeValue(type);
    setWhatShowPopover(false);
  };

  const selectToTypePost = (icon: any, type: any) => {
    getTypeIconTo(icon);
    getToTypeValue(type);
    setToShowPopover(false);
  };
  const onConfirmStartDateTime = (startDate: Date) => {
    console.log(startDate);
    createPostwhen(startDate);
    datePickerRef.current?.onOpenModal('end');
  };

  const requestLocationPermission = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 6000,
    })
      .then(location => {
        setUserLocation(location);
        console.log(
          '---------------------location---------------------',
          location,
        );
        if (location) {
          // postListAPI();
        }
      })
      .catch(error => {
        console.log('---------------------error---------------------', error);
        const {code, message} = error;
        console.log(code, message);
      });
  };

  const getResourcesAPI = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(
        API_URL + '/v1/posts/resources',
        {
          method: 'get',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          }),
        },
      );
      const dataItem = await response.json();
      console.log(
        '-------------------Get Resources API Response---------------------',
      );
      console.log(dataItem);
      getResourseDatawhat(dataItem?.data?.what);
      getResourseDataTo(dataItem?.data?.to);
      getResourseDataFrom(dataItem?.data?.from);
      getResourseDataFor(dataItem?.data?.For);
      getTypeIconWhat(dataItem?.data?.what[1]['icon']);
      createPostwhatName(dataItem?.data?.what[1]['title'])
      getTypeIconTo(dataItem?.data?.to[0]['icon']);
      getToTypeValue(dataItem?.data?.to[0]['value']);
      getWhatTypeValue(dataItem?.data?.what[1]['value']);
      console.log(
        dataItem?.data[0]['icon'],
        '------------icon image--------------',
      );
    } catch (error) {
      console.error(error);
    }
  };

  const postImageUploadAPI = async (fileItem: any, base64Item: any) => {
    const token = await AsyncStorage.getItem('token');
    var pic: any = {
      uploadKey: 'createPostImg',
      imageName: fileItem,
      base64String: 'data:image/jpeg;base64,' + base64Item,
    };

    console.log('================ postImageUploadAPI Request=================');
    console.log(pic);
    try {
      const response = await fetch(
        API_URL + '/v1/users/upload/file',
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(pic),
        },
      );
      const dataItem = await response.json();
      console.log('-----------------Response------------');

      var tempData = imageArray;
      tempData.push(dataItem?.data);
      setImageArray(tempData);

      var tempTwo = imageArrayKey;
      tempTwo.push(dataItem?.data?.key)
      setImageArrayKey(tempTwo);
      // setCreatePostUri(dataItem?.data?.imageUrl);
      // selectedImageKey(dataItem?.data?.key);
      console.log(dataItem);
      LodingData(false);
    } catch (error) {
      console.log(error);
      LodingData(false);
    }
  };

  async function createPostAPI() {
    LodingData(true);
    const token = await AsyncStorage.getItem('token');
    var data: any = {
      type: 'gratis',
      what_type: whatSelectType,
      what_name: whatName,
      what_quantity: whatQuantity,
      to_type: typrTovalue,
      to_users: userListArray,
      content: content,
      tags: tagArray,
      post_image: imageArrayKey,
    };

    console.log('=========== Create Post API Request ==============');

    console.log(data);
    try {
      const response = await fetch(
        API_URL + '/v1/posts/create',
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
          body: JSON.stringify(data),
        },
      );
      const dataItem = await response.json();
      console.log('=========== Create Post API Response ==============');
      console.log(dataItem);
      LodingData(false);
      Toast.show(dataItem?.message, Toast.LONG, {
        backgroundColor: 'black',
      });
      if (dataItem?.success === true) {
        navigation?.goBack();
      }

      // postListAPI();
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function gratisUserList(textUser: any) {
    const token = await AsyncStorage.getItem('token');
    var datas: any = {
      searchtext: textUser,
    };
    onUserSearch(textUser);
    LodingData(true)
    console.log('=========== User List Gratis API Request ==============');
    console.log(datas);
    console.log(
      API_URL + '/v1/users/search-user?searchtext=' +
        textUser,
    );
    try {
      const response = await fetch(
        API_URL + '/v1/users/search-user?searchtext=' +
        textUser,
        {
          method: 'get',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        },
      );
      const dataItem = await response.json();
      console.log('=========== User List Gratis API Response ==============');
      const result = dataItem?.data?.map((item: any) => {
        return {...item, gratisNo: 1};
      });
      userGratiesListData(result);
      console.log(dataItem);
      LodingData(false)
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  const GallerySelect = async () => {
    const {assets} = await launchImageLibrary({
      mediaType: 'photo',
      // selectionLimit: 2,
      includeBase64: true,
      maxWidth: 800,
      maxHeight: 800,
    });
    console.log(assets);
    if (assets) {
      const img = assets?.[0];
      console.log('---------------assets Gallery 222---------------');
      console.log(assets);
      var fileNameTwo = img?.fileName ?? '';
      LodingData(true);
      var output =
        fileNameTwo.substr(0, fileNameTwo.lastIndexOf('.')) || fileNameTwo;
      var base64Two = img?.base64 ?? '';
      postImageUploadAPI(output, base64Two);
    }
  };

  const removeuserSelect = (id: any) => {
    const newPeople = userList.filter((person: any) => person !== id);
    console.log('--------newPeople---------', newPeople);

    recentlyJoinUser(newPeople);
    getUsetList(newPeople);
  };

  const CreateNewPostModal = () => {
    if (whatName.length === 0) {
      Toast.show('Enter About What', Toast.LONG, {
        backgroundColor: 'black',
      });
    // } else if (whatQuantity.length === 0) {
    //   Toast.show('Enter What Quantity', Toast.LONG, {
    //     backgroundColor: 'black',
    //   });
    // } else if (userList.length === 0) {
    //   Toast.show('Add User', Toast.LONG, {
    //     backgroundColor: 'black',
    //   });
    } else if (content.length === 0) {
      Toast.show('Enter Post Content', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else if (tagArray.length === 0) {
      Toast.show('Enter Post Tag', Toast.LONG, { 
        backgroundColor: 'black',
      });
    } else if (imageArray.length === 0) {
      Toast.show('Add Image to Post', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else {
      createPostAPI();
    }
    // } else {
    //   CreatePostModal(false);
  };

  const gratisPlusClick = (item: any, index: any) => {
    // console.log(item)
    item.gratisNo = item.gratisNo + 1;
    console.log(item.gratisNo);
    let markers = [...usergratisList];
    markers[index] = {
      ...markers[index],
      gratisNo: item.gratisNo,
    };
    totalGratisData(markers);
  };
  const gratisMinusClick = (item: any, index: any) => {
    // console.log(item)
    if (item.gratisNo > 1) {
      item.gratisNo = item.gratisNo - 1;
      let markers = [...usergratisList];
      markers[index] = {
        ...markers[index],
        gratisNo: item.gratisNo,
      };
      totalGratisData(markers);
    }
  };

  const renderItem: ListRenderItem<string> = ({item}) => (
    <Pill
      onPressPill={() => handleRemove(item)}
      pillStyle={styles.marginBottom}
      key={item}
      label={item}
    />
  );

  const removeSelectImage = (imageUrl: any) => {
    console.log(imageUrl)
    const newImage = imageArray.filter(
      (person: any) => person.imageUrl !== imageUrl
    );
    setImageArray(newImage);
    console.log('--------------setImageArray----------------')
    }

  const handleRemove = (id: any) => {
    const newPeople = tagArray.filter((person: any) => person !== id);
    console.log('--------newPeople---------', newPeople);

    tagselectArray(newPeople);
  };

  const onAddSkill = (text: any) => {
    if (text !== '' && text !== undefined) {
      tagselectArray([...tagArray, text]);
      console.log('onSubmitEditing onSubmitEditing', tags, tagArray, text);
      createPosttags('');
    }
  };

  // function handleToggleYourList(item:any, jindex: any,point:any) {
  //   let newArr = userList.map((item:any, index:any) => {
  //     const target: Partial<typeof item> = {...item};
  //     delete target['first_name'];
  //     delete target['last_name'];

  //     if (index == jindex) {
  //       return {...target, point: point};
  //     } else {
  //       return target;
  //     }
  //   });
  //   recentlyJoinUser(newArr);
  //   console.log('===========ansQueData 22==========', newArr);
  // }

  const AddUserList = (item: any) => {
    const found = userList.find((element:any) => element.id == item.id);
    if (!found) {
      recentlyJoinUser([...userList, item]); 
      
      const newItems = {...item};
      delete newItems.first_name;
      delete newItems.last_name;
      delete newItems.pic;
      delete newItems.id;
      delete newItems.gratisNo;
      console.log(item.gratisNo);
      const newuserData = {...newItems, point: item.gratisNo, user_id: item.id};
      getUsetList([...userListArray, newuserData]);
      
      console.log(userListArray);
    }else{
      Toast.show('Already Added', Toast.LONG, { 
        backgroundColor: 'black',
      });
    }
    
   
  };

  const whatQtyMinus = () => {
    if(whatQuantity > 1){
      whatQuantity = whatQuantity - 1
      createPostwhatQuantity(whatQuantity)
    }
  }

  const whatQtyPlus = () => {
    whatQuantity = whatQuantity + 1
    createPostwhatQuantity(whatQuantity)
  }

  return (
    <>
      <Loader visible={isLoading} showOverlay />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={keyboardDismiss}
          activeOpacity={1}
          style={styles.createPostModal}>
          <View>
            <View style={styles.postClass}>
              <View style={styles.createPostCont}>
                <Text style={styles.textOne}>What</Text>
                <TextInput
                  placeholder="What do you want to offer?"
                  placeholderTextColor="darkgray"
                  value={whatName}
                  onChangeText={text => createPostwhatName(text)}
                  style={styles.postInputTwo}></TextInput>
                  {/* <SizedBox width={10}></SizedBox> */}
                  <View style={styles.QuantityContainer}>
                  <TouchableOpacity onPress={whatQtyMinus}>
                    <Text style={styles.QuantityMinus}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.QuantityMunber}>{whatQuantity}</Text>
                  <TouchableOpacity onPress={whatQtyPlus}>
                    <Text style={styles.QuantityPlus}>+</Text>
                  </TouchableOpacity>
                </View>
               
                <SizedBox width={10}></SizedBox>
                <TouchableOpacity
                  activeOpacity={1}
                  // onPress={() => setWhatShowPopover(true)}
                  >
                  <ImageComponent
                    resizeMode="cover"
                    source={{uri: typeIconWhat}}
                    style={styles.createImgOne}></ImageComponent>
                </TouchableOpacity>
               
              </View>
              <SizedBox height={10}></SizedBox>
              <View style={styles.postCont}>
                <Text style={styles.textOne}>Post Body</Text>
                <TextInput
                  multiline
                  placeholder="What do you want to say?"
                  placeholderTextColor="darkgray"
                  textAlignVertical={'top'}
                  value={content}
                  onChangeText={text => createPostcontent(text)}
                  style={styles.postinput}></TextInput>
              </View>
              <SizedBox height={10}></SizedBox>
              
              <View style={styles.createPostCont}>
                <Text style={styles.textOne}>To:</Text>
                
                <TextInput
                  placeholder="who do you want to send gratis to?"
                  placeholderTextColor="darkgray"
                  value={usertext}
                  onChangeText={text => gratisUserList(text)}
                  style={styles.postInputToType}></TextInput>
               
                <TouchableOpacity activeOpacity={1}>
                  <ImageComponent
                    resizeMode="stretch"
                    source={{uri: typeIconTo}}
                    style={styles.createImgOne}></ImageComponent>
                </TouchableOpacity>
               
              </View>

              <SizedBox height={verticalScale(10)}></SizedBox>

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
                    borderRadius: 10,
                    maxHeight: 275,
                    overflow: 'hidden',
                    height: 'auto',
                  }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <FlatList
                      data={usergratisList}
                      renderItem={({item, index}) => (
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
                          <View style={{flexDirection: 'row', marginRight: 50}}>
                            <ImageComponent
                              style={{
                                height: 30,
                                width: 30,
                                marginRight: 20,
                                marginLeft: 10,
                                borderRadius: 100,
                              }}
                              resizeMode="cover"
                              source={{uri: item?.pic}}></ImageComponent>
                            <Text  numberOfLines={1} style={{alignSelf: 'center',flexShrink: 1, width: 125, color: theme.colors.black}}>
                              {item?.first_name} {item?.last_name}
                            </Text>
                          </View>

                          <View style={styles.gratisCont}>
                            <TouchableOpacity
                              onPress={() => gratisMinusClick(item, index)}>
                              <ImageComponent
                                source={minus}
                                style={{
                                  height: 20,
                                  width: 20,
                                  marginHorizontal: 15,
                                }}></ImageComponent>
                            </TouchableOpacity>
                            <Text style={styles.gratistext}>
                              {item?.gratisNo}
                            </Text>
                            <TouchableOpacity
                              onPress={() => gratisPlusClick(item, index)}>
                              <ImageComponent
                                source={plus}
                                style={{
                                  height: 20,
                                  width: 20,
                                  marginHorizontal: 15,
                                }}></ImageComponent>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => AddUserList(item)}>
                              <ImageComponent
                                style={{
                                  height: 20,
                                  width: 20,
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

            
              <View style={styles.tagCont}>
                <Text style={styles.textOne}>Tags</Text>
                <TextInput
                  placeholder="add tags or people"
                  placeholderTextColor="darkgray"
                  value={tags}
                  onChangeText={text => createPosttags(text)}
                  style={styles.tagInput}></TextInput>
              </View>
              {tags !== '' ? (
                <TouchableOpacity
                  style={{zIndex: 1111111}}
                  onPress={() => {
                    onAddSkill(tags);
                  }}>
                  <ImageComponent
                    style={styles.skillAddImage}
                    source={addGreen}></ImageComponent>
                </TouchableOpacity>
              ) : (
                <View></View>
              )}

              <View style={styles.row}>
                <FlatListComponent
                  data={tagArray}
                  keyExtractor={item => item.toString()}
                  renderItem={renderItem}
                  numColumns={100}
                  showsHorizontalScrollIndicator={false}
                  columnWrapperStyle={styles.flexWrap}
                />
              </View>
              <TouchableOpacity
                onPress={GallerySelect}
                style={styles.imagesCont}>
                <Text style={styles.textTwo}>Image</Text>
                <Text style={styles.textTwo}>+</Text>
                <Text style={styles.textThree}>add images</Text>
              </TouchableOpacity>

              <View style={styles.multipleImagecont}>
                {imageArray.map((item: any) => {
                  return (
                    <TouchableOpacity
                    onPress={() => removeSelectImage(item?.imageUrl)}
                  >
                      <ImageComponent source={{uri: item?.imageUrl}} style={styles.selectImage}></ImageComponent></TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={CreateNewPostModal}
                activeOpacity={0.8}
                style={styles.purchaseContainer}>
                <View />
                <Text style={styles.titleTwo}>{strings.postOffer}</Text>
                <ImageComponent
                  source={buttonArrowGreen}
                  style={styles.buttonArrow}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </>
  );
};
