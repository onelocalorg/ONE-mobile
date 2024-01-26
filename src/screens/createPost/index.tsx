import React, {useEffect, useRef, useState} from 'react';
import {createStyleSheet} from './style';
import {useAppTheme} from '@app-hooks/use-app-theme';
import {
  FlatList,
  Image,
  Keyboard,
  LogBox,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {ImageComponent} from '@components/image-component';
import {
  arrowDown,
  arrowLeft,
  bell,
  blackOffer,
  buttonArrowGreen,
  dummy,
  gratitudeBlack,
  greenOffer,
  onelogo,
  pin,
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
import { navigations } from '@config/app-navigation/constant';

interface CreatePostScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
}

export const CreatePostScreen = (props: CreatePostScreenProps) => {
  const {navigation} = props || {};
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {strings} = useStringsAndLabels();
  const [selecttype, createPostSelectType] = useState(1);
  const [type, createPostType] = useState('offer');
  const [typeIconWhat, getTypeIconWhat]: any = useState();
  const [showWhatPopover, setWhatShowPopover] = useState(false);
  const [getResourceList, getResourseData]: any = useState([]);
  const [whatSelectType, getWhatTypeValue]: any = useState();
  const [postImage, setCreatePostUri]: any = useState([]);
  const [forName, createPostforName] = useState('');
  const [forQuantity, createPostforQuantity] = useState('');
  const [whereAddress, createPostwhereAddress] = useState('');
  const [imageKey, selectedImageKey] = useState();
  const [when, createPostwhen] = useState(new Date());
  const [content, createPostcontent] = useState('');
  const [tags, createPosttags] = useState('');
  const [whatName, createPostwhatName] = useState('');
  const [addnewCmt, onAddComment] = useState('');
  const [addnewCmtReply, onAddCommentReply] = useState('');
  const [whatQuantity, createPostwhatQuantity] = useState('');
  const [typeIconFor, getTypeIconFor]: any = useState();
  const [whatForType, getForTypeValue]: any = useState();
  const [showForPopover, setForShowPopover] = useState(false);
  const [isLoading, LodingData] = useState(false);
  var [location, setUserLocation]: any = useState();
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

  const selectForTypePost = (icon: any, type: any) => {
    getTypeIconFor(icon);
    getForTypeValue(type);
    setForShowPopover(false);
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
        'https://app.onelocal.one/api/v1/posts/resources',
        {
          method: 'get',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        },
      );
      const dataItem = await response.json();
      console.log(
        '-------------------Get Resources API Response---------------------',
      );
      console.log(dataItem);
      getResourseData(dataItem?.data);
      getTypeIconWhat(dataItem?.data[0]['icon']);
      getTypeIconFor(dataItem?.data[0]['icon']);
      getForTypeValue(dataItem?.data[0]['value']);
      getWhatTypeValue(dataItem?.data[0]['value']);
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
        'https://app.onelocal.one/api/v1/users/upload/file',
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
      setCreatePostUri(dataItem?.data?.imageUrl);
      selectedImageKey(dataItem?.data?.key);
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
      type: type,
      what_type: whatSelectType,
      what_name: whatName,
      what_quantity: whatQuantity,
      for_type: whatForType,
      for_name: forName,
      for_quantity: forQuantity,
      where_address: whereAddress,
      where_lat: location?.latitude,
      where_lng: location?.longitude,
      when: when,
      content: content,
      tags: tags,
      post_image: imageKey,
    };

    console.log('=========== Create Post API Request ==============');
    console.log(data);
    try {
      const response = await fetch(
        'https://app.onelocal.one/api/v1/posts/create',
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          body: Object.keys(data)
            .map(key => key + '=' + data[key])
            .join('&'),
        },
      );
      const dataItem = await response.json();
      console.log('=========== Create Post API Response ==============');
      console.log(dataItem);
      LodingData(false);
      Toast.show(dataItem?.message, Toast.LONG, {
        backgroundColor: 'black',
      });
      navigation?.goBack();

      // postListAPI();
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  const onBackPress = () => {
    navigation?.goBack();
  };

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

  const CreateNewPostModal = () => {
    if (whatName.length === 0) {
      Toast.show('Enter About What', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else if (whatQuantity.length === 0) {
      Toast.show('Enter What Quantity', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else if (forName.length === 0) {
      Toast.show('Enter About For', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else if (forQuantity.length === 0) {
      Toast.show('Enter For Quantity', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else if (whereAddress.length === 0) {
      Toast.show('Enter Address', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else if (content.length === 0) {
      Toast.show('Enter Post Content', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else if (tags.length === 0) {
      Toast.show('Enter Post Tag', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else if (postImage.length === 0) {
      Toast.show('Add Image to Post', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else {
      createPostAPI();
    }
    // } else {
    //   CreatePostModal(false);
  };

  // const onNavigateToProfile = () => {
  //   if (user?.id) {
  //     refetch().then(res => {
  //       const userData = userProfileParsedData(res?.data?.data);
  //       console.log('check1===', userData);
  //       dispatch(onSetUser(userData));
  //     });
  //   }
  //   navigation?.navigate(navigations.PROFILE);
  // };
  return (
    <>
      <Loader visible={isLoading} showOverlay />

      <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
        <TouchableOpacity onPress={onBackPress} style={{zIndex: 11111222222}}>
          <View style={styles.row2}>
            <ImageComponent source={arrowLeft} style={styles.arrowLeft} />
          </View>
        </TouchableOpacity>
        {/* <View style={styles.searchContainer}>
          <ImageComponent style={styles.searchIcon} source={Search}></ImageComponent>
          <TextInput value={searchQuery} placeholderTextColor="#FFFF" placeholder='Search' style={styles.searchInput} onChangeText={value => {
            console.log(value)
            setSearchQuery(value)
          }}></TextInput>
        </View> */}

        <View style={styles.oneContainer}>
          <ImageComponent
            style={styles.oneContainerImage}
            source={onelogo}></ImageComponent>
          <Text style={styles.oneContainerText}>NE</Text>
        </View>
        {/* <View style={styles.profileContainer}>
          <ImageComponent
            style={styles.bellIcon}
            source={bell}></ImageComponent>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNavigateToProfile}
            style={styles.profileView}>
            <ImageComponent
              resizeMode="cover"
              isUrl={!!user?.pic}
              source={dummy}
              uri={userprofile}
              style={styles.profile}
            />
          </TouchableOpacity>
        </View> */}
      </TouchableOpacity>

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={keyboardDismiss}
          activeOpacity={1}
          style={styles.createPostModal}>
          <View>
            <View style={styles.postFilter}>
              <TouchableOpacity
                style={styles.container3}
                activeOpacity={1}
                onPress={() => createPostSetType(1, 'offer')}>
                <ImageComponent
                  source={selecttype == 1 ? greenOffer : blackOffer}
                  style={styles.icon1}
                />
                <Text style={[selecttype == 1 ? styles.label3 : styles.label4]}>
                  Offer
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.container3}
                activeOpacity={0.8}
                onPress={() => createPostSetType(2, 'request')}>
                <ImageComponent source={request} style={styles.icon1} />
                <Text style={[selecttype == 2 ? styles.label3 : styles.label4]}>
                  Request
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.container3}
                activeOpacity={0.8}
                onPress={() => createPostSetType(3, 'gratis')}>
                <ImageComponent source={gratitudeBlack} style={styles.icon1} />
                <Text style={[selecttype == 3 ? styles.label3 : styles.label4]}>
                  Gratitude
                </Text>
              </TouchableOpacity> */}
            </View>
            <View style={styles.postClass}>
              <View style={styles.createPostCont}>
                <Text style={styles.textOne}>What</Text>
                <Image
                  resizeMode="cover"
                  source={{uri: typeIconWhat}}
                  style={styles.createImgOne}></Image>
                <Popover
                  isVisible={showWhatPopover}
                  placement={PopoverPlacement.BOTTOM}
                  onRequestClose={() => setWhatShowPopover(false)}
                  from={
                    <TouchableOpacity onPress={() => setWhatShowPopover(true)}>
                      <Image
                        resizeMode="cover"
                        source={arrowDown}
                        style={styles.arrowDown}></Image>
                    </TouchableOpacity>
                  }>
                  <FlatList
                    data={getResourceList}
                    renderItem={({item}) => (
                      <View style={{width: 120}}>
                        <TouchableOpacity
                          onPress={() =>
                            selectWhatTypePost(item?.icon, item?.value)
                          }
                          style={styles.container3}
                          activeOpacity={0.8}>
                          <Image
                            source={{uri: item?.icon}}
                            style={styles.icon1}
                          />
                          <Text style={styles.label2}>{item?.title}</Text>
                        </TouchableOpacity>
                        <View
                          style={{
                            height: 2,
                            backgroundColor: 'lightgray',
                            marginHorizontal: 10,
                          }}></View>
                      </View>
                    )}></FlatList>
                </Popover>
                <TextInput
                  placeholder="What do you want to offer?"
                  placeholderTextColor="darkgray"
                  value={whatName}
                  onChangeText={text => createPostwhatName(text)}
                  style={styles.postInputTwo}></TextInput>
              </View>
              <View style={styles.quntitiyCont}>
                <Text style={styles.textOne}>Quantity</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="how many?"
                  value={whatQuantity}
                  placeholderTextColor="darkgray"
                  onChangeText={text => createPostwhatQuantity(text)}
                  style={styles.quntitiyInput}></TextInput>
              </View>
              <View style={styles.createPostCont}>
                <Text style={styles.textOne}>For</Text>
                <Image
                  resizeMode="cover"
                  source={{uri: typeIconFor}}
                  style={styles.createImgOne}></Image>

                <Popover
                  isVisible={showForPopover}
                  placement={PopoverPlacement.BOTTOM}
                  onRequestClose={() => setForShowPopover(false)}
                  from={
                    <TouchableOpacity onPress={() => setForShowPopover(true)}>
                      <Image
                        resizeMode="cover"
                        source={arrowDown}
                        style={styles.arrowDown}></Image>
                    </TouchableOpacity>
                  }>
                  <FlatList
                    data={getResourceList}
                    renderItem={({item}) => (
                      <View style={{width: 120}}>
                        <TouchableOpacity
                          onPress={() =>
                            selectForTypePost(item?.icon, item?.value)
                          }
                          style={styles.container3}
                          activeOpacity={0.8}>
                          <Image
                            resizeMode="cover"
                            source={{uri: item?.icon}}
                            style={styles.icon1}
                          />
                          <Text style={styles.label2}>{item?.title}</Text>
                        </TouchableOpacity>
                        <View
                          style={{
                            height: 2,
                            backgroundColor: 'lightgray',
                            marginHorizontal: 10,
                          }}></View>
                      </View>
                    )}></FlatList>
                </Popover>

                <TextInput
                  value={forName}
                  placeholder="what reciprocity would you like?"
                  placeholderTextColor="darkgray"
                  onChangeText={text => createPostforName(text)}
                  style={styles.postInputTwo}></TextInput>
              </View>
              <View style={styles.quntitiyCont}>
                <Text style={styles.textOne}>Quantity</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="how many?"
                  value={forQuantity}
                  placeholderTextColor="darkgray"
                  onChangeText={text => createPostforQuantity(text)}
                  style={styles.quntitiyInput}></TextInput>
              </View>
              <View style={styles.createPostContTwo}>
                <Text style={styles.textTwoWhere}>Where</Text>
                <Image
                  resizeMode="cover"
                  source={pin}
                  style={styles.createImgTwo}></Image>

                {/* <View style={styles.postInputTwo}> */}
                <GooglePlacesAutocomplete
                  styles={{
                    textInput: {
                      backgroundColor: 'lightgray',
                      height: 35,
                      borderRadius: 10,
                      color: 'black',
                      fontSize: 14,
                    },
                    predefinedPlacesDescription: {
                      color: 'black',
                    },
                  }}
                  placeholder="what reciprocity would you like?"
                  onPress={(data: any, details = null) => {
                    createPostwhereAddress(data.description);
                    console.log(data); // description
                  }}
                  query={{
                    key: 'AIzaSyCobkVCxli93gBohNPhJhuHBoWThs1pZlo', // client
                  }}
                  currentLocation={true}
                  currentLocationLabel="Current location"
                />
              </View>
              <SizedBox height={verticalScale(10)}></SizedBox>
              <View style={styles.createPostCont}>
                <Text style={styles.textOne}>When</Text>
                <Image
                  resizeMode="cover"
                  source={postCalender}
                  style={styles.createImgOne}></Image>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => datePickerRef.current?.onOpenModal('start')}
                  style={styles.postInputTwo}>
                  <Text style={styles.time}>
                    {`${moment(when).format('DD MMM YYYY hh:mm A')}`}
                  </Text>

                  <DateRangePicker
                    selectStartDate={onConfirmStartDateTime}
                    ref={datePickerRef}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.postCont}>
                <Text style={styles.textOne}>Post Body</Text>
                <TextInput
                  multiline
                  placeholder="What do you want to say?"
                  placeholderTextColor="darkgray"
                  value={content}
                  onChangeText={text => createPostcontent(text)}
                  style={styles.postinput}></TextInput>
              </View>
              <View style={styles.tagCont}>
                <Text style={styles.textOne}>Tags</Text>
                <TextInput
                  placeholder="add tags or people"
                  placeholderTextColor="darkgray"
                  value={tags}
                  onChangeText={text => createPosttags(text)}
                  style={styles.tagInput}></TextInput>
              </View>
              <TouchableOpacity
                onPress={GallerySelect}
                style={styles.imagesCont}>
                <Text style={styles.textTwo}>Image</Text>
                <Text style={styles.textTwo}>+</Text>
                <Text style={styles.textThree}>add images</Text>
              </TouchableOpacity>

              <View style={styles.multipleImagecont}>
                <Image
                  source={{uri: postImage}}
                  style={styles.selectImage}></Image>
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
