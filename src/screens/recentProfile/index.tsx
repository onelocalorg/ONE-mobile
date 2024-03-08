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
import {Recentabout} from './about';
import {RecentMyEvents} from './my-events';
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
import { API_URL } from '@network/constant';

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

interface RecentProfileScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const RecentProfileScreen = (props: RecentProfileScreenProps) => {
  const {theme} = useAppTheme();
  const {strings} = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const {navigation} = props || {};
  const [selectedTab, setSelectedTab] = useState(0);
  const [profileUri, setProfileUri] = useState('');
  const [updatedBio, setBio] = useState('');
  const [isLoading, LodingData] = useState(false);
  var [recentUser, submitAnsState] = useState();
  var [ansQueDataTwo, submitAnsStateTwo] = useState();
  const {user} = useSelector<StoreType, UserProfileState>(
    state => state.userProfileReducer,
  ) as {user: UserData};
  const {about, bio, name, pic, skills, status, id, profile_answers} =
    user || {};
  const dispatch = useDispatch();
  const {token} = useToken();
  console.log(user, '--------------User Info--------------');
  console.log(skills, '888888888888');
  useEffect(() => {
    setBio(bio);
    setProfileUri(pic);
    console.log('------------pic----------', pic);
  }, [bio, pic]);

  useEffect(() => {
    userProfileUpdate();
    return () => {
      dispatch(onSetCoverImage(''));
    };
  }, []);

  const onBackPress = () => {
    navigation.goBack();
  };


  async function userProfileUpdate() {
    console.log(token)
    try {
      const response = await fetch(API_URL + '/v1/users/userprofile/5f61a3b16f61450a2bb888e8', {
        method: 'get',
        headers: new Headers({
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        })
      });
      const dataItem = await response.json();
      console.log('===========User Profile data Response==============') 
      submitAnsState(dataItem?.data)

      const {success, data} = dataItem || {};
      if (success) {
        const {
          about, bio, name, pic, skills, status, id, profile_answers
        } = data || {};
        
      }
      console.log(dataItem?.data);
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <View style={styles.container}>
      <Loader visible={isLoading} showOverlay />
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 0 && (
          <Recentabout
            about={about}
            idUser={user?.id}
            skills={skills}
            profileAnswers={profile_answers}
            navigation={navigation}
            ref={undefined}
          />
        )}
        {selectedTab === 1 && <RecentMyEvents userId={id} navigation={navigation} />}
      </ScrollView>
    </View>
  );
};
