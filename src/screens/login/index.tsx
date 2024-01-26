import {
  Search,
  activeRadio,
  arrowLeft,
  buttonArrow,
  google,
  inactiveRadio,
  loginLogo,
  onelogo,
  pin,
} from '@assets/images';
import {Header} from '@components/header';
import {ImageComponent} from '@components/image-component';
import {SizedBox} from '@components/sized-box';
import {verticalScale} from '@theme/device/normalize';
import React, {useState} from 'react';
import {
  Button,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {createStyleSheet} from './style';
import {Input} from '@components/input';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {useAppTheme} from '@app-hooks/use-app-theme';
import {ButtonComponent} from '@components/button-component';
import {NavigationContainerRef, ParamListBase} from '@react-navigation/native';
import {navigations} from '@config/app-navigation/constant';
import {useLogin} from '@network/hooks/user-service-hooks/use-login';
import {Loader} from '@components/loader';
import {emailRegexEx} from '@assets/constants';
import {getDeviceName, getUniqueId} from 'react-native-device-info';
import {useToken} from '@app-hooks/use-token';
import {useDispatch} from 'react-redux';
import {onSetUser} from '@network/reducers/user-profile-reducer';
import {useCreateStripeCustomer} from '@network/hooks/payment-service-hooks/use-create-stripe-customer';
import {useSaveCustomerId} from '@network/hooks/user-service-hooks/use-save-customer-id';
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '758195278101-qroulgfid8ufuiqlvcfhm5ndnno2jr90.apps.googleusercontent.com',
});

interface LoginScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const LoginScreen = (props: LoginScreenProps) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {strings} = useStringsAndLabels();
  const {navigation} = props || {};
  const [isChecked, setIsChecked] = useState(false);
  const {isLoading, mutateAsync} = useLogin();
  const {onSetToken} = useToken();
  const dispatch = useDispatch();
  const [user, setUser] = useState({emailOrMobile: '', password: ''});
  const {mutateAsync: createStripeCustomer} = useCreateStripeCustomer();
  const {mutateAsync: saveCustomerId} = useSaveCustomerId();
  const [searchQuery, setSearchQuery] = useState('');
  const [googleUserGmail, setGoogleEmail]: any = useState();
  const [googleAuth, setGoogleAuth]: any = useState();

  const onHandleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  const signIn = async () => {
    console.log('google signin clicked');
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      if (userInfo) {
        onGoogleSignUpAPI(
          userInfo?.user?.email,
          userInfo?.serverAuthCode,
          userInfo?.user?.givenName,
          userInfo?.user?.familyName,
        );
        // setGoogleEmail(userInfo?.user?.email)
        // setGoogleAuth(userInfo?.serverAuthCode)
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log(error.code);
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(error.code);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(error.code);
      } else {
        console.log('error.codddsdsde');
      }
    }
  };

  async function onGoogleSignUpAPI(
    googleUserGmail: any,
    googleAuth: any,
    firstName: any,
    LastName: any,
  ) {
    const userData: any = {
      // "email":"vipul.tuvoc@gmail.com",
      // //"mobile_number": "9104773896",
      // "googleAuth": "4/0AfJohXnFnJwpmnCTvCf87S8EFj8nr41VvW1ld_8TDC4w3oZM-xLplsS_GhRQnDawehonMA"

      email: googleUserGmail,
      googleAuth: googleAuth,
      first_name: firstName,
      last_name: LastName,
    };
    console.log('==========on Google Sign Up API Request==============');
    console.log(userData);
    try {
      const response = await fetch(
        'https://app.onelocal.one/api/v1/auth/googleSignupLogin',
        {
          method: 'post',
          headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          body: Object.keys(userData)
            .map(key => key + '=' + userData[key])
            .join('&'),
        },
      );
      const signData = await response.json();
      console.log('==========on Google Sign Up API Response==============');
      console.log(signData);

      if (signData?.success === false) {
        Toast.show(signData.message, Toast.LONG, {
          backgroundColor: 'black',
        });
      }
      const {success, data} = signData || {};
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

        AsyncStorage.setItem('token', data.access_token);

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
      }
    } catch (error) {
      console.error(error);
    }
  }

  const onSubmit = async () => {
    const deviceToken = await getUniqueId();
    const deviceInfo = `${Platform.OS === 'ios'} ${await getDeviceName()}`;
    const body = {
      emailOrMobile: user?.emailOrMobile,
      password: user?.password,
      loginType: 'password',
      deviceToken,
      version: '1.0.0',
      deviceInfo,
      googleToken: 'fasdfasdfdsasdfad',
    };

    const res = await mutateAsync(body);
    const {success, data} = res || {};
    if(!success){
      Toast.show(res?.message, Toast.LONG, {
        backgroundColor: 'black',
      });
    }
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

      AsyncStorage.setItem('token', data.access_token);

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
    }
  };

  const onSignUp = async () => {
    navigation.navigate(navigations.SIGNUP);
  };

  const handleUserData = (value: string, key: string) => {
    setUser({...user, [key]: value});
  };
  const onCheckValidation = () => {
    return !(
      (emailRegexEx.test(String(user.emailOrMobile).toLowerCase()) ||
        user.emailOrMobile.length === 10) &&
      user.password.length >= 8 &&
      isChecked
    );
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={keyboardDismiss}>
      <Loader visible={isLoading} showOverlay />

      <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
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
      </TouchableOpacity>

      <SizedBox height={verticalScale(22)} />
      <ImageComponent source={loginLogo} style={styles.loginLogo} />
      <SizedBox height={verticalScale(22)} />
      <View style={styles.container}>
        <Input
          placeholder={strings.mobileOrEmail}
          onChangeText={text => handleUserData(text, 'emailOrMobile')}
        />
        <SizedBox height={verticalScale(22)} />
        <Input
          placeholder={strings.password}
          secureTextEntry
          onChangeText={text => handleUserData(text, 'password')}
        />
        <SizedBox height={verticalScale(20)} />
        <TouchableOpacity
          style={styles.tncStyle}
          activeOpacity={0.8}
          onPress={onHandleCheckBox}>
          <ImageComponent
            source={isChecked ? activeRadio : inactiveRadio}
            style={styles.radio}
          />
          <Text style={styles.agreeText}>
            {strings.iAgree}
            <Text style={styles.bold}>{` ${strings.tnc}`}</Text>
          </Text>
        </TouchableOpacity>
        <SizedBox height={verticalScale(14)} />
        <ButtonComponent
          disabled={onCheckValidation()}
          onPress={onSubmit}
          title={strings.login}
        />

        <ButtonComponent
          style={styles.signUpBtn}
          onPress={onSignUp}
          title={strings.signUp}
        />

        <SizedBox height={verticalScale(14)} />
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.forgot}>{`${strings.forgotPassword}?`}</Text>
        </TouchableOpacity>
        <SizedBox height={verticalScale(20)} />
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.googleButton}
          onPress={() => signIn()}>
          <ImageComponent source={google} style={styles.google} />
          <Text style={styles.loginGoogle}>{strings.loginGoogle}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
