/* eslint-disable react-hooks/exhaustive-deps */
import {useAppTheme} from '@app-hooks/use-app-theme';
import {NavigationContainerRef, ParamListBase} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {createStyleSheet} from './style';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {Header} from '@components/header';
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ImageComponent} from '@components/image-component';
import {TabComponent} from '@components/tab-component';
import {About} from './about';
import {MyEvents} from './my-events';
import {useDispatch, useSelector} from 'react-redux';
import {
  UserProfileState,
  onSetCoverImage,
} from '@network/reducers/user-profile-reducer';
import {StoreType} from '@network/reducers/store';
import {useLogout} from '@app-hooks/use-logout';
import {Loader} from '@components/loader';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Input} from '@components/input';
import {useEditProfile} from '@network/hooks/user-service-hooks/use-edit-profile';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Search, arrowLeft, bell, dummy, onelogo} from '@assets/images';
import {PERMISSIONS, request} from 'react-native-permissions';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToken} from '@app-hooks/use-token';
import {TextInput} from 'react-native-gesture-handler';
import {verticalScale} from '@theme/device/normalize';
import {getTopPadding} from '@utils/platform-padding';
import {Image} from 'react-native';
import {height} from '@theme/device/device';
import {BottomSheet} from 'react-native-elements';
import GestureRecognizer from 'react-native-swipe-gestures';
import ImagePicker from 'react-native-image-crop-picker';

interface UserData {
  id: string;
  bio: string;
  name: string;
  pic: string; 
  status: string;
  about: string;
  skills: string[];
  userType: string;
  isActiveSubscription: boolean;
  coverImage: string;
  profile_answers: string[];
}

interface ProfileScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const ProfileScreen = (props: ProfileScreenProps) => {
  const {theme} = useAppTheme();
  const {strings} = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const {navigation} = props || {};
  const [selectedTab, setSelectedTab] = useState(0);
  const [profileUri, setProfileUri] = useState('');
  const [updatedBio, setBio] = useState('');
  const [filename, assetsData] = useState('');
  const [base64string, setBase64Path] = useState('');
  const [imageOption, ImageOptionModal] = useState(false);
  const [isLoading, LodingData] = useState(false);
  const {user} = useSelector<StoreType, UserProfileState>(
    state => state.userProfileReducer,
  ) as {user: UserData};
  const {onLogout} = useLogout();
  const {about, bio, name, pic, skills, status, id, profile_answers} =
    user || {};
  const {mutateAsync} = useEditProfile();
  const dispatch = useDispatch();
  const {token} = useToken();
  const [searchQuery, setSearchQuery] = useState('');
  console.log(user, '--------------User Info--------------');
  console.log(skills, '888888888888');
  useEffect(() => {
    setBio(bio);
    setProfileUri(pic);
    console.log('------------pic----------', pic);
  }, [bio, pic]);

  useEffect(() => {
    return () => {
      dispatch(onSetCoverImage(''));
    };
  }, []);

  const onBackPress = () => {
    console.log('jdjkshdjkshdkhjakhdajk');
    navigation.goBack();
  };

  const imageSelection = async () => {
    ImageOptionModal(true);
  };

  // ======================imageUpload API=========================
  const imageUploadAPI = async (fileItem: any, base64Item: any) => {
    var pic: any = {
      uploadKey: 'pic',
      imageName: fileItem,
      base64String: 'data:image/jpeg;base64,' + base64Item,
    };
    ImageOptionModal(false);
    console.log('=================Request=================');
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
      LodingData(false);
      console.log('-----------------Response------------');
      setProfileUri(dataItem?.data?.imageUrl);
      console.log(dataItem);
    } catch (error) {
      LodingData(false);
      console.log(error);
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
      imageUploadAPI(output, base64Two);
    }
  };

  const GallerySelect = async () => {
    // const {assets} = await launchImageLibrary({
    //   mediaType: 'photo',
    //   includeBase64: true,
    //   maxWidth: 800,
    //   maxHeight: 800,
    // });
    console.log('===============111111==================');
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropperRotateButtonsHidden:true,
      mediaType: 'photo',
      includeBase64: true,
      cropping: true
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
        console.log(output)
        console.log('---------------base64Two---------------');
        console.log(base64Two)
        imageUploadAPI(output, base64Two);
      }
    });
    
  };

  const onSaveProfile = async (request: {
    about?: string;
    skills?: string[];
  }) => {
    console.log('============onSaveProfile===============');
    Keyboard.dismiss();
    let body = {
      ...request,
      bio: updatedBio,
      coverImage: user?.coverImage,
    } as {
      about?: string;
      skills?: string[];
      profile?: string;
    };
    LodingData(true)
    console.log('oooooo', profileUri);
    if (pic !== profileUri) {
      console.log('-------------11111---------');
      body.profile = profileUri;
    }

    const res = await mutateAsync({bodyParams: body, userId: user?.id});
    if (res?.success) {
      console.log('-------------2222---------');
      navigation.goBack();
    }
  };

  const closeModal = () => {
    ImageOptionModal(false);
  };

  return (
    <View style={styles.container}>
      <Loader visible={isLoading} showOverlay />

      <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
        <TouchableOpacity style={styles.row2} onPress={onBackPress}>
          <View>
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

        <TouchableOpacity
          activeOpacity={0.8}
          style={{position: 'absolute', right: 10, top: 60}}
          onPress={onLogout}>
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.white,
              fontWeight: '500',
              fontFamily: theme.fontType.medium,
            }}>
            {strings.logout}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={styles.profileContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={imageSelection}>
          <ImageComponent
            isUrl={!!profileUri}
            resizeMode="cover"
            uri={profileUri}
            source={dummy}
            style={styles.profile}
          />

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
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    fontFamily: theme.fontType.medium,
                    backgroundColor: '#A493B7',
                    color: 'white',
                    padding: 10,
                    margin: 10,
                  }}>
                  Gallery 
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => imageOptionSelect(2)}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    fontFamily: theme.fontType.medium,
                    backgroundColor: '#A493B7',
                    color: 'white',
                    padding: 10,
                    margin: 10,
                  }}>
                  Camera
                </Text>
              </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
          </Modal>
        </TouchableOpacity>
      </View>
      <View style={styles.center}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.circularView}>
          <Text style={styles.des}>{status}</Text>
        </View>
      </View>
      {/* <TouchableOpacity activeOpacity={0.8} style={styles.payView}>
        <Text style={styles.pay}>{strings.stripePayout}</Text>
      </TouchableOpacity> */}
      <View style={styles.aboutView}>
        <Input
          inputStyle={styles.input}
          value={updatedBio}
          onChangeText={setBio}
          multiline
        />
      </View>
      <View style={styles.line} />
      {/* <TabComponent
        tabs={[strings.about, strings.myEvents, strings.activity]}
        onPressTab={setSelectedTab}
      /> */}
      <TabComponent
        tabs={[strings.about, strings.myEvents]}
        onPressTab={setSelectedTab}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 0 && (
          <About
            about={about}
            idUser={user?.id}
            skills={skills}
            profileAnswers={profile_answers}
            onEditProfile={onSaveProfile}
            navigation={navigation}
            ref={undefined}
          />
        )}
        {selectedTab === 1 && <MyEvents userId={id} navigation={navigation} />}
      </ScrollView>
    </View>
  );
};
