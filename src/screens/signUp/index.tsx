import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  Linking,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {Header} from '@components/header';
import {SizedBox} from '@components/sized-box';
import {ImageComponent} from '@components/image-component';
import {
  Search,
  activeRadio,
  arrowLeft,
  calendarWhite,
  close,
  edit,
  inactiveRadio,
  loginLogo,
  onelogo,
  selectPic,
} from '@assets/images';
import {normalScale, verticalScale} from '@theme/device/normalize';
import {Input} from '@components/input';
import {TouchableOpacity} from 'react-native';
import {ButtonComponent} from '@components/button-component';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import Toast from 'react-native-simple-toast';
import {emailRegexEx} from '@assets/constants';
import {navigations} from '@config/app-navigation/constant';
import {NavigationContainerRef, ParamListBase} from '@react-navigation/native';
import {useToken} from '@app-hooks/use-token';
import {useCreateStripeCustomer} from '@network/hooks/payment-service-hooks/use-create-stripe-customer';
import {useSaveCustomerId} from '@network/hooks/user-service-hooks/use-save-customer-id';
import {useDispatch} from 'react-redux';
import {onSetUser} from '@network/reducers/user-profile-reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loader} from '@components/loader';
import {useLogin} from '@network/hooks/user-service-hooks/use-login';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import GestureRecognizer from 'react-native-swipe-gestures';
import {launchCamera} from 'react-native-image-picker';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {
  DatePickerRefProps,
  DateRangePicker,
} from '@components/date-range-picker';
import {width} from '@theme/device/device';
import moment from 'moment';
import {DatePickerModal} from 'react-native-paper-dates';
import {API_URL} from '@network/constant';
import {
  CalenderComponent,
  CalenderComponentModal,
  CalenderRefProps,
} from '@components/Calender/calenderComponent';

interface SignUpProps {
  navigation: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      email: any;
      password:any
    };
  };
}

export const SignUp = (props: SignUpProps) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    password: '',
    confirmPass: '',
    city: '',
    state: '',
    nick_name: '',
    catch_phrase: '',
  });
  const [isChecked, setIsChecked] = useState(false);
  const {strings} = useStringsAndLabels();
  const {navigation,route} = props || {};
  const {email,password} = route?.params ?? {};
  const {onSetToken} = useToken();
  const handleUserData = (value: string, key: string) => {
    setUser({...user, [key]: value});
  };
  const [isLoading, LodingData] = useState(false);
  const {mutateAsync: createStripeCustomer} = useCreateStripeCustomer();
  const {mutateAsync: saveCustomerId} = useSaveCustomerId();
  const [imageOption, ImageOptionModal] = useState(false);
  const [filename, assetsData] = useState('');
  const [base64string, setBase64Path] = useState('');
  const [profileUri, setProfileUri]: any = useState('');
  const [backgroundImageUri, setbackgroundUri]: any = useState('');
  const [setimageType, selectImage] = useState();
  const [when, createPostwhen] = useState(new Date());
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const datePickerRef: React.Ref<DatePickerRefProps> = useRef(null);
  const calenderShowRef: React.Ref<CalenderRefProps> = useRef(null);

  async function onSignUpAPI() {
    LodingData(true);
    const userData = {
      first_name: user.firstName,
      last_name: user.lastName,
      email: email,
      // "mobile_number": '',
      password: password,
      cpassword: password,
      // city: user.city,
      // state: user.state,
      // nick_name: user.nick_name,
      // catch_phrase: user.catch_phrase,
      birth_date: moment(when).format('YYYY-MM-DD'),
      pic: profileUri?.key,
      // cover_image: backgroundImageUri?.key,
    };
    console.log(userData);
    try {
      const response = await fetch(API_URL + '/v1/auth/signup', {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(userData),
      });
      const signData = await response.json();
      console.log('===========Sign UP API==============');
      console.log(signData);
      const res = await signData;
      LodingData(false);
      Toast.show(signData.message, Toast.LONG, {
        backgroundColor: 'black',
      });
      const {success, data} = res || {};
      if (success) {
        const {
          first_name,
          last_name,
          mobile_number,
          customer_id,
          access_token,
          id,
        } = data || {};

        await onSetToken(access_token);

        if (!customer_id) {
          const stripeRes = await createStripeCustomer({
            bodyParams: {
              name: `${first_name} ${last_name}`,
              phone: mobile_number,
              description: 'Test',
            },
          });
          let stripeCustomerId = '';
          if (stripeRes?.statusCode === 200) {
            stripeCustomerId = stripeRes?.data?.id;
          }
          dispatch(onSetUser({...data, stripeCustomerId}));

          await saveCustomerId({
            bodyParams: {userId: id, customerId: stripeCustomerId},
          });
        } else {
          dispatch(onSetUser({...data, stripeCustomerId: customer_id}));
        }

        navigation.reset({
          index: 0,
          routes: [{name: navigations.BOTTOM_NAVIGATION}],
        });

        // navigation.reset({
        //     index: 0,
        //     routes: [{ name: navigations.BOTTOM_NAVIGATION }],
        // });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const openAddBreakDownModal = () => {
    console.log('show calender');
    calenderShowRef.current?.onOpenModal();
  };

  const onSignUp = () => {

    
     if (user.firstName.length === 0) {
      Toast.show('Enter your First Name', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else if (user.lastName.length === 0) {
      Toast.show('Enter your Last Name', Toast.LONG, {
        backgroundColor: 'black',
      });
    } 
    else if (!when) {
      Toast.show('Enter your Birth Date', Toast.LONG, {
        backgroundColor: 'black',
      });
    }
  else if (profileUri === '') {
      Toast.show('Enter your profile image', Toast.LONG, {
        backgroundColor: 'black',
      });
 
    } else {
      onSignUpAPI();
    }
  };

  const GallerySelect = async () => {
    console.log('===============111111==================');
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropperRotateButtonsHidden: true,
      mediaType: 'photo',
      includeBase64: true,
      cropping: true,
    }).then(image => {
      console.log(image);
      console.log('===============222222==================');

      if (image) {
        console.log('---------------assets Gallery 222---------------');
        console.log(image);
        var fileNameTwo = image?.filename ?? '';
        LodingData(true);
        var output =
          fileNameTwo.substr(0, fileNameTwo.lastIndexOf('.')) || fileNameTwo;
        var base64Two = image?.data ?? '';

        assetsData(output);
        setBase64Path(base64Two);
        console.log('---------------output---------------');
        console.log(output);
        console.log('---------------base64Two---------------');
        console.log(base64Two);
        if (setimageType === 1) {
          ProfileImageUploadAPI(output, base64Two);
        }
        if (setimageType === 2) {
          BackgroundImageUploadAPI(output, base64Two);
        }
      }
    });
  };

  const ProfileImageUploadAPI = async (fileItem: any, base64Item: any) => {
    if(Platform.OS === 'ios'){
      var pic: any = {
        uploadKey: 'signup_pic',
        imageName: fileItem,
        base64String: 'data:image/jpeg;base64,' + base64Item,
      };
    } else {
      var isImg: any = '.JPG'
      var pic: any = {
        uploadKey: 'signup_pic',
        imageName: Math.random().toString() + isImg,
        base64String: 'data:image/jpeg;base64,' + base64Item,
      };
    }
    
    
    ImageOptionModal(false);
    console.log('=================Request=================', pic);
    console.log(API_URL + '/v1/users/upload/file');
    try {
      const response = await fetch(API_URL + '/v1/users/upload/file', {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(pic),
      });
      const dataItem = await response.json();
      LodingData(false);
      console.log('-----------------Response------------');
      setProfileUri(dataItem?.data);
      console.log(dataItem);
    } catch (error) {
      LodingData(false);
      console.log(error);
    }
  };
  const BackgroundImageUploadAPI = async (fileItem: any, base64Item: any) => {
    var isImg: any = '.JPG'
    var pic: any = {
      uploadKey: 'signup_cover_image',
      imageName: Math.random().toString() + isImg,
      // imageName: fileItem,
      base64String: 'data:image/jpeg;base64,' + base64Item,
    };
    ImageOptionModal(false);
    console.log('=================Request=================');
    console.log(pic);
    try {
      const response = await fetch(API_URL + '/v1/users/upload/file', {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(pic),
      });
      const dataItem = await response.json();
      LodingData(false);
      console.log('-----------------Response------------');
      setbackgroundUri(dataItem?.data);
      console.log(dataItem);
    } catch (error) {
      LodingData(false);
      console.log(error);
    }
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const onHandleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };
  const loadInBrowser = () => {
    const url = 'https://onelocal.one/privacy_policy.html';
    if (url) {
      console.log('11111111111');
      Linking.openURL(url);
    }
  };

  const imageOptionSelect = async (item: any) => {
    if (item === 1) {
      if (Platform.OS === 'ios') {
        GallerySelect();
      } else if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
            GallerySelect();
          } else {
            Alert.alert('Camera permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    } else if (item === 2) {
      if (Platform.OS === 'ios') {
        onUploadImage();
      } else if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
            onUploadImage();
          } else {
            Alert.alert('Camera permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    } else {
      ImageOptionModal(false);
    }
  };

  const onUploadImage = async () => {
    const {assets} = await launchCamera({
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 800,
      maxHeight: 800,
    });
    ImageOptionModal(false);
    if (assets) {
      const img = assets?.[0];
      console.log('---------------assets Gallery 222---------------');
      console.log(assets);
      var fileNameTwo = img?.fileName ?? '';
      LodingData(true);
      var output =
        fileNameTwo.substr(0, fileNameTwo.lastIndexOf('.')) || fileNameTwo;
      var base64Two = img?.base64 ?? '';

      assetsData(output);
      setBase64Path(base64Two);
      if (setimageType === 1) {
        ProfileImageUploadAPI(output, base64Two);
      }
      if (setimageType === 2) {
        BackgroundImageUploadAPI(output, base64Two);
      }
    }
  };

  const closeModal = () => {
    ImageOptionModal(false);
  };

  const imageSelection = async (no: any) => {
    selectImage(no);
    ImageOptionModal(true);
  };

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    (params: any) => {
      setOpen(false);
      createPostwhen(params.date);
    },
    [setOpen, createPostwhen],
  );

  return (
    <TouchableOpacity activeOpacity={1} onPress={keyboardDismiss}>
      <Loader visible={isLoading} showOverlay />

      <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
        <TouchableOpacity onPress={onBackPress} style={{zIndex: 11111222222}}>
          <View style={styles.row2}>
            <ImageComponent source={arrowLeft} style={styles.arrowLeft} />
          </View>
        </TouchableOpacity>
        <View style={styles.oneContainer}>
          <ImageComponent
            style={styles.oneContainerImage}
            source={onelogo}></ImageComponent>
          <View>
            <Text style={styles.oneContainerText}>NE</Text>
            <Text style={styles.localText}>L o c a l</Text>
          </View>
        </View>
      </TouchableOpacity>

      <SizedBox height={verticalScale(22)} />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.texClass}>{strings.firstName}</Text>
          <TextInput
            placeholderTextColor="#8B8888"
            style={styles.textInput}
            value={user.firstName}
            onChangeText={text => handleUserData(text, 'firstName')}
          />
          <SizedBox height={verticalScale(14)} />
          <Text style={styles.texClass}>{strings.lastName}</Text>
          <TextInput
            placeholderTextColor="#8B8888"
            style={styles.textInput}
            value={user.lastName}
            onChangeText={text => handleUserData(text, 'lastName')}
          />
          <SizedBox height={verticalScale(14)} />
          <Text style={styles.texClass}>{strings.birthday}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setOpen(true)}
            style={styles.postInputTwo}>
            <Text style={styles.time}>
              {`${moment(when).format('DD MMM YYYY')}`}
            </Text>

            <DatePickerModal
              locale="en"
              mode="single"
              visible={open}
              onDismiss={onDismissSingle}
              date={when}
              onConfirm={onConfirmSingle}
              closeIcon={close}
              calendarIcon={calendarWhite}
              editIcon={edit}
            />
          </TouchableOpacity>
         
          <SizedBox height={verticalScale(14)} />
        
          <Text style={styles.texClass}>{strings.profilepic}</Text>
          <TouchableOpacity
            style={styles.profileUser}
            activeOpacity={0.8}
            onPress={() => imageSelection(1)}>
            <ImageComponent
              resizeMode="stretch"
              style={
                profileUri != ''
                  ? styles.profilePicClassTwo
                  : styles.profilePicClass
              }
              source={
                profileUri != '' ? {uri: profileUri.imageUrl} : selectPic
              }></ImageComponent>
          </TouchableOpacity>
          <SizedBox height={verticalScale(20)} />
          <ButtonComponent
            style={styles.signUpBtn}
            onPress={onSignUp}
            title={strings.signUpTwo}
          />
        </View>
      </KeyboardAwareScrollView>

      <CalenderComponentModal ref={calenderShowRef}></CalenderComponentModal>

      <Modal transparent onDismiss={closeModal} visible={imageOption}>
        <GestureRecognizer onSwipeDown={closeModal} style={styles.gesture}>
          <TouchableOpacity
            style={styles.containerGallery}
            activeOpacity={1}
            onPress={closeModal}
          />
        </GestureRecognizer>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardViewTwo}>
          <View style={styles.imageActionSheet}>
            <TouchableOpacity onPress={() => imageOptionSelect(1)}>
              <Text style={styles.galleryText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => imageOptionSelect(2)}>
              <Text style={styles.cameraText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loginLogo: {
    height: normalScale(85),
    width: normalScale(85),
    alignSelf: 'center',
  },
  localText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    color: 'white',
  },
  texClass: {
    fontSize: 15,
    fontFamily: 'NotoSerif-Regular',
    color: 'black',
    fontWeight: '600',
  },
  container: {
    paddingHorizontal: normalScale(50),
  },
  tncStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    height: normalScale(18),
    width: normalScale(18),
    marginRight: normalScale(15),
  },
  agreeText: {
    fontSize: 14,
    fontFamily: 'NotoSerif-Regular',
    color: 'black',
  },
  bold: {
    fontFamily: 'bold',
  },
  forgot: {
    fontSize: 14,
    fontFamily: 'NotoSerif-Regular',
    color: 'black',
    alignSelf: 'center',
  },
  googleButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: normalScale(14),
    paddingVertical: verticalScale(15),
    alignItems: 'center',
    flexDirection: 'row',
  },
  google: {
    height: normalScale(24),
    width: normalScale(24),
  },
  loginGoogle: {
    fontSize: 14,
    fontFamily: 'NotoSerif-Regular',
    color: 'black',
    marginLeft: normalScale(18),
  },
  signUpBtn: {
    backgroundColor: '#684F85',
    borderRadius: 14,
    paddingVertical: verticalScale(14),
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: verticalScale(0),
    },
    elevation: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalScale(16),
    marginTop: 15,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    fontSize: 14,
    borderColor: '#8B8888',
    borderWidth: 1,
    padding: normalScale(10),
    fontFamily: 'NotoSerif-Regular',
    height: verticalScale(38),
    color: 'black',
  },
  HeaderContainerTwo: {
    backgroundColor: '#003333',
    height: 150,
    // position: 'relative',
  },
  row2: {
    position: 'absolute',
    top: 52,
    left: 10,
    height: normalScale(30),
    width: normalScale(30),
    zIndex: 11111222222,
    paddingLeft: 4,
    paddingTop: 4,
  },
  arrowLeft: {
    height: normalScale(22),
    width: normalScale(22),
  },
  searchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 35,
    width: 100,
    borderRadius: 10,
    flexDirection: 'row',
    marginLeft: 8,
    position: 'absolute',
    bottom: 20,
    color: '#FFFFFF',
  },
  searchInput: {
    flexShrink: 1,
    marginLeft: 7,
    marginRight: 5,
    height: 35,
    width: 120,
    color: '#FFFFFF',
  },
  searchIcon: {
    height: 15,
    width: 15,
    marginTop: 10,
    marginLeft: 5,
  },
  oneContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    top: 50,
  },
  oneContainerImage: {
    height: 60,
    width: 60,
    marginTop: 10,
    marginLeft: 5,
  },
  oneContainerText: {
    textAlign: 'center',
    fontSize: 60,
    fontFamily: 'NotoSerif-Regular',
    fontWeight: '400',
    color: '#FFFFFF',
    marginLeft: 2,
    marginBottom: -10,
  },
  temsCont: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(17, 56, 98, 0.83)',
  },
  boldtnc: {
    fontFamily: 'NotoSerif-Bold',
    color: 'rgba(17, 56, 98, 0.83)',
    fontWeight: '600',
  },
  scrollView: {
    paddingBottom: verticalScale(200),
  },
  profilePicClass: {
    alignSelf: 'center',
    height: 80,
    width: 80,
    margin: 20,
  },
  profilePicClassTwo: {
    alignSelf: 'center',
    height: 125,
    width: 125,
    borderRadius: 100,
  },
  backgroundPicClass: {
    alignSelf: 'center',
    height: 100,
    width: 100,
  },
  backgroundPicClassTwo: {
    alignSelf: 'center',
    height: normalScale(120),
    width: '100%',
    borderRadius: 14,
  },
  profileBackground: {
    borderColor: 'black',
    borderRadius: 14,
    padding: 10,
    borderWidth: 4,
    marginTop: 10,
  },
  profileUser: {
    borderColor: 'black',
    borderRadius: 100,
    padding: 10,
    height: 150,
    width: 150,
    alignSelf: 'center',
    borderWidth: 4,
    marginTop: 10,
  },
  gesture: {
    flex: 1,
  },
  keyboardViewTwo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // top:0
  },
  containerGallery: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  imageActionSheet: {
    position: 'absolute',
    // top: 310,
    bottom: 0,
    left: 0,
    right: 0,
    height: 'auto',
    // backgroundColor: theme.colors.modalOverlay,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    paddingVertical: verticalScale(20),
    maxHeight: verticalScale(600),
    borderColor: '#A493B7',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    flex: 1,
    marginHorizontal: 10,
  },
  galleryText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'NotoSerif-Medium',
    backgroundColor: '#A493B7',
    color: 'white',
    padding: 10,
    margin: 10,
  },
  cameraText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'NotoSerif-Medium',
    backgroundColor: '#A493B7',
    color: 'white',
    padding: 10,
    margin: 10,
  },
  postInputTwo: {
    // backgroundColor: 'white',
    // borderRadius: 10,
    // width: width - 200,
    // marginLeft: 10,
    // paddingHorizontal: 10,
    // height:35,
    // justifyContent:'center'

    backgroundColor: 'white',
    borderRadius: 8,
    fontSize: 16,
    borderColor: '#8B8888',
    borderWidth: 1,
    padding: normalScale(10),
    fontFamily: 'NotoSerif-Regular',
    height: verticalScale(38),
    color: 'black',
  },
  time: {
    fontFamily: 'NotoSerif-Light',
    fontSize: 12,
    color: 'black',
  },
});
