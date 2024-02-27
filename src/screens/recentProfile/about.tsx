import {useAppTheme} from '@app-hooks/use-app-theme';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  Image,
  ListRenderItem,
  Modal,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ScrollView,
  LogBox,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {createStyleSheet} from './style';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {Pill} from '@components/pill';
import {
  eventWhite,
  gratitude,
  save,
  explorer,
  operator,
  serviceProvider,
  postImage,
  bucket,
  loginLogo,
  arrowLeft,
  pin,
  arrowDown,
  buttonArrow,
  addCard,
  buttonArrowBlue,
  downImg,
  closeCard,
  addGreen,
  onelogo,
  dummy,
} from '@assets/images';
import {ModalRefProps} from '@components/modal-component';
import {ImageComponent} from '@components/image-component';
import {Input} from '@components/input';
import {FlatListComponent} from '@components/flatlist-component';
import {
  NavigationContainerRef,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
import {usePackagePlans} from '@network/hooks/home-service-hooks/use-package-plans';
import {Subscription} from '@components/subcription';
import GestureRecognizer from 'react-native-swipe-gestures';
import {useToken} from '@app-hooks/use-token';
import {normalScale, verticalScale} from '@theme/device/normalize';
import {useSelector} from 'react-redux';
import {StoreType} from '@network/reducers/store';
import {UserProfileState} from '@network/reducers/user-profile-reducer';
import {navigations} from '@config/app-navigation/constant';
import {Loader} from '@components/loader';
import {ButtonComponent} from '@components/button-component';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL, persistKeys} from '@network/constant';
import {height, width} from '@theme/device/device';
import {useEditProfile} from '@network/hooks/user-service-hooks/use-edit-profile';
import {ActivityIndicator} from 'react-native';

interface RecentaboutDataProps {
  ref: React.Ref<unknown> | undefined;
  about: string;
  skills: string[];
  profileAnswers: any[];
  idUser: string;
  onEditProfile?: (data: {about?: string; skills?: string[]}) => void;
  navigation: NavigationContainerRef<ParamListBase>;
  route?: {
    params: {
      id: string;
    };
  };
}

export const Recentabout = (props: RecentaboutDataProps) => {
  const {theme} = useAppTheme();
  const {strings} = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const {about, skills, profileAnswers, idUser, route, navigation} =
    props || {};
  const [updatedAbout, setAbout] = useState(about);
  const [allSkills, setSkills] = useState(skills);
  const [skillValue, setSkillValue]: any = useState('');
  const [isLoading, LodingData] = useState(false);
  const [profileUri, setProfileUri] = useState('');
  const [updatedBio, setBio] = useState('');
  const [recentUser, recentUserDetail]: any = useState([]);
  const {token} = useToken();
  const {id} = route?.params ?? {};
  const [openQues, quesAnsModal] = useState(false);
  console.log('==============usersId==========', idUser);
  var [ansQueData, submitAnsState] = useState(profileAnswers);
  var [ansQueDataTwo, submitAnsStateTwo] = useState(profileAnswers);
  const {} = props || {};
  useEffect(() => {
    LodingData(true)
    userRecentProfileUpdate();
    setAbout(about);
    setSkills(skills);
  }, [about, skills]);

  // =================Update Answer API====================


  async function userRecentProfileUpdate() {
    const token = await AsyncStorage.getItem('token');
    const userID = await AsyncStorage.getItem('recentUserId');
    console.log(token);
    console.log(userID);
    try {
      const response = await fetch(
        API_URL + '/v1/users/userprofile/'+userID,
        {
          method: 'get',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          }),
        },
      );
      const dataItem = await response.json();
      console.log('===========User Profile data Response==============');
      submitAnsState(dataItem?.data?.profile_answers);
      recentUserDetail(dataItem?.data);
      setAbout(dataItem?.about);
      setSkills(dataItem?.skills);
      console.log(
        API_URL + '/v1/users/userprofile/'+userID,
      );
      LodingData(false)
      console.log(dataItem);
    } catch (error) {
      LodingData(false)
      console.error(error);
    }
  }

  const updateAnsBack = () => {
    quesAnsModal(false);
  };

  

  const handleRemove = (id: any) => {
    const newPeople = allSkills.filter(person => person !== id);
    console.log('--------newPeople---------', newPeople);

    setSkills(newPeople);
  };

  const onAddSkill = (text: any) => {
    if (text !== '' && text !== undefined) {
      setSkills([...allSkills, text]);
      console.log('onSubmitEditing onSubmitEditing', allSkills, text);
      setSkillValue('');
    }
  };

  const renderItem: ListRenderItem<string> = ({item}) => (
    <Pill
      pillStyle={styles.marginBottom}
      key={item}
      label={item}
    />
  );

  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

  function handleToggleYourList(name: any, jindex: any) {
    let newArr = ansQueDataTwo.map((item, index) => {
      const target: Partial<typeof item> = {...item};
      delete target['question'];

      if (index == jindex) {
        return {...target, answer: name};
      } else {
        return target;
      }
    });
    let newArrs = ansQueDataTwo.map((item, index) => {
      const target: Partial<typeof item> = {...item};

      if (index == jindex) {
        return {...target, answer: name};
      } else {
        return target;
      }
    });
    submitAnsState(newArr);
    submitAnsStateTwo(newArrs);
    console.log('===========ansQueData 22==========', ansQueData);
  }

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
        <Loader visible={isLoading} showOverlay />

        <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
          <TouchableOpacity style={styles.row2} onPress={onBackPress}>
            <View>
              <ImageComponent source={arrowLeft} style={styles.arrowLeft} />
            </View>
          </TouchableOpacity>
          <View style={styles.oneContainer}>
              <ImageComponent
                style={styles.oneContainerImage}
                source={onelogo}></ImageComponent>
              <View>
                <Text style={styles.oneContainerText}>NE</Text>
                <Text style={styles.localText}>L  o  c  a  l</Text>
              </View>
            </View>
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <TouchableOpacity activeOpacity={1}>
            <ImageComponent
              isUrl={!!recentUser?.pic}
              resizeMode="cover"
              uri={recentUser?.pic}
              // source={dummy}
              style={styles.profile}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text style={styles.name}>
            {recentUser?.first_name} {recentUser?.last_name}
          </Text>
          <View style={styles.circularView}>
            <Text style={styles.des}>{recentUser?.status}</Text>
          </View>
        </View>
        <View style={styles.aboutView}>
          <Text style={styles.input}>{recentUser?.bio}</Text>
        </View>
        <View style={styles.line} />
      </View>
      <View style={styles.innerConatiner}>
        <Loader visible={false} showOverlay />
        <Text style={styles.membership}>About</Text>
        <Text style={styles.input}>{recentUser?.about}</Text> 
        <Text style={styles.membership}>{strings.skills}</Text>

        <View style={styles.row}>
          <FlatListComponent
            data={recentUser?.skills}
            keyExtractor={item => item.toString()}
            renderItem={renderItem}
            numColumns={100}
            showsHorizontalScrollIndicator={false}
            columnWrapperStyle={styles.flexWrap}
          />
        </View>

        {/* ==========================Question Answer========================  */}

        <View>
          <View>
            <TouchableOpacity activeOpacity={1}>
              <Text style={styles.ProfileUpdateCont}>
                Question & Answer List 
              </Text>
            </TouchableOpacity>
            <View style={{marginBottom: 30}}>
              <FlatList
                data={recentUser?.profile_answers}
                renderItem={({item}) => (
                  <View>
                    {item.length != 0 ? (
                      <View>
                        <Text style={styles.questionsDisplayLbl}>
                          {item.question}
                        </Text>
                        <Text style={styles.answerDisplayCont}>
                          {item.answer}
                        </Text>
                      </View>
                    ) : (
                      <View></View>
                    )}
                  </View>
                )}></FlatList>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
