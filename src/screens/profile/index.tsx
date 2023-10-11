/* eslint-disable react-hooks/exhaustive-deps */
import {useAppTheme} from '@app-hooks/use-app-theme';
import {NavigationContainerRef, ParamListBase} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {createStyleSheet} from './style';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {Header} from '@components/header';
import {Keyboard, ScrollView, Text, TouchableOpacity, View} from 'react-native';
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
import {launchCamera} from 'react-native-image-picker';
import {Input} from '@components/input';
import {useEditProfile} from '@network/hooks/user-service-hooks/use-edit-profile';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {dummy} from '@assets/images';

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
  const {user} = useSelector<StoreType, UserProfileState>(
    state => state.userProfileReducer,
  ) as {user: UserData};
  const {onLogout} = useLogout();
  const {about, bio, name, pic, skills, status, id} = user || {};

  const {mutateAsync, isLoading: editLoading} = useEditProfile();
  const dispatch = useDispatch();

  useEffect(() => {
    setBio(bio);
    setProfileUri(pic);
  }, [bio, pic]);

  useEffect(() => {
    return () => {
      dispatch(onSetCoverImage(''));
    };
  }, []);

  const onBackPress = () => {
    navigation.goBack();
  };

  const renderLogoutIcon = () => {
    return (
      <TouchableOpacity onPress={onLogout} activeOpacity={0.8}>
        <Text style={styles.logout}>{strings.logout}</Text>
      </TouchableOpacity>
    );
  };

  const onUploadImage = async () => {
    const {assets} = await launchCamera({
      mediaType: 'photo',
    });
    if (assets) {
      const img = assets?.[0];
      setProfileUri(img?.uri ?? '');
    }
  };

  const onSaveProfile = async (request: {
    about?: string;
    skills?: string[];
  }) => {
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

    if (pic !== profileUri) {
      body.profile = profileUri;
    }

    const res = await mutateAsync({bodyParams: body, userId: user?.id});
    if (res?.success) {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Loader visible={editLoading} showOverlay={editLoading} />
      <Header
        hasBackButton
        rightIcon={renderLogoutIcon()}
        onBackPress={onBackPress}
        fromProfile={true}
      />
      <View style={styles.profileContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={onUploadImage}>
          <ImageComponent
            isUrl={!!profileUri}
            resizeMode="cover"
            uri={profileUri}
            source={dummy}
            style={styles.profile}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.center}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.circularView}>
          <Text style={styles.des}>{status}</Text>
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.8} style={styles.payView}>
        <Text style={styles.pay}>{strings.stripePayout}</Text>
      </TouchableOpacity>
      <View style={styles.aboutView}>
        <Input
          inputStyle={styles.input}
          value={updatedBio}
          onChangeText={setBio}
          multiline
        />
      </View>
      <View style={styles.line} />
      <TabComponent
        tabs={[strings.about, strings.myEvents, strings.activity]}
        onPressTab={setSelectedTab}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 0 && (
          <About
            about={about}
            skills={skills}
            onEditProfile={onSaveProfile}
            navigation={navigation}
          />
        )}
        {selectedTab === 1 && <MyEvents userId={id} />}
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};
