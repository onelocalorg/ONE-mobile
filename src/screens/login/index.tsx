import { LOG } from "~/config";
import {
  Search,
  activeRadio,
  apple,
  arrowLeft,
  buttonArrow,
  google,
  inactiveRadio,
  loginLogo,
  onelogo,
  pin,
} from "~/assets/images";
import { Header } from "~/components/header";
import { ImageComponent } from "~/components/image-component";
import { SizedBox } from "~/components/sized-box";
import { verticalScale } from "~/theme/device/normalize";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createStyleSheet } from "./style";
import { Input } from "~/components/input";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { ButtonComponent } from "~/components/button-component";
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import { navigations } from "~/config/app-navigation/constant";
import { useLogin } from "~/network/hooks/user-service-hooks/use-login";
import { Loader } from "~/components/loader";
import { emailRegexEx } from "~/assets/constants";
import { getDeviceName, getUniqueId } from "react-native-device-info";
import { useToken } from "~/app-hooks/use-token";
import { useDispatch } from "react-redux";
import { onSetUser } from "~/network/reducers/user-profile-reducer";
import { useCreateStripeCustomer } from "~/network/hooks/payment-service-hooks/use-create-stripe-customer";
import { useSaveCustomerId } from "~/network/hooks/user-service-hooks/use-save-customer-id";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import {
  AppleButton,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import { jwtDecode } from "jwt-decode";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Linking } from "react-native";
import { getData } from "~/network/constant";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

GoogleSignin.configure({
  iosClientId: process.env.GOOGLE_SIGNIN_IOS_CLIENT_ID,
  webClientId: process.env.GOOGLE_SIGNIN_WEB_CLIENT_ID,
  offlineAccess: true,
});

interface LoginScreenProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const LoginScreen = (props: LoginScreenProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const { navigation } = props || {};
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, LodingData] = useState(false);
  const { mutateAsync } = useLogin();
  const { onSetToken } = useToken();
  const dispatch = useDispatch();
  const [user, setUser] = useState({ emailOrMobile: "", password: "" });
  const { mutateAsync: createStripeCustomer } = useCreateStripeCustomer();
  const { mutateAsync: saveCustomerId } = useSaveCustomerId();
  const [searchQuery, setSearchQuery] = useState("");
  const [googleUserGmail, setGoogleEmail]: any = useState();
  const [googleAuth, setGoogleAuth]: any = useState();
  const [userToken, setUserToken] = useState();
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);

  useEffect(() => {}, []);

  // const onHandleCheckBox = () => {
  //   setIsChecked(!isChecked);
  // };

  const signInWithGoogle = async () => {
    LOG.debug("> signInWithGoogle");
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      LOG.debug(userInfo);
      if (userInfo) {
        onGoogleSignUpAPI(
          userInfo?.user?.email,
          userInfo?.serverAuthCode,
          userInfo?.user?.givenName,
          userInfo?.user?.familyName
        );
        // setGoogleEmail(userInfo?.user?.email)
        // setGoogleAuth(userInfo?.serverAuthCode)
      }
      LOG.debug("< signInWithGoogle");
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        // ignore
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        // ignore
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        // TODO Display error
        LOG.error("signInWithGoogle:", error);
      } else {
        // some other error happened
        LOG.error("signInWithGoogle:", error);
      }
    }
  };

  const signInWithApple = async () => {
    LOG.debug("> signInWithApple");

    try {
      const appleAuthRequestResponse: any = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      LOG.debug("signInWithApple:", appleAuthRequestResponse);
      if (appleAuthRequestResponse?.email !== null) {
        await onAppleSignUpAPI(
          appleAuthRequestResponse?.email,
          appleAuthRequestResponse?.user,
          appleAuthRequestResponse?.fullName?.givenName,
          appleAuthRequestResponse?.fullName?.familyName
        );
      } else {
        getAppleIdCredAPI(appleAuthRequestResponse);
      }
      LOG.debug("< signInWithApple");
    } catch (error: any) {
      LOG.error("signInWithApple", error);
    }
  };

  async function onGoogleSignUpAPI(
    googleUserGmail: any,
    googleAuth: any,
    firstName: any,
    lastName: any
  ) {
    const userData: any = {
      // "email":"vipul.tuvoc@gmail.com",
      // //"mobile_number": "9104773896",
      // "googleAuth": "4/0AfJohXnFnJwpmnCTvCf87S8EFj8nr41VvW1ld_8TDC4w3oZM-xLplsS_GhRQnDawehonMA"

      email: googleUserGmail,
      googleAuth: googleAuth,
      first_name: firstName,
      last_name: lastName,
    };
    console.log("==========on Google Sign Up API Request==============");
    console.log(userData);
    LodingData(true);
    try {
      const response = await fetch(
        process.env.API_URL + "/v1/auth/googleSignupLogin",
        {
          method: "post",
          headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          body: Object.keys(userData)
            .map((key) => key + "=" + userData[key])
            .join("&"),
        }
      );
      const signData = await response.json();
      console.log("==========on Google Sign Up API Response==============");
      console.log(signData);

      if (signData?.success === false) {
        Toast.show(signData.message, Toast.LONG, {
          backgroundColor: "black",
        });
        LodingData(false);
      }
      const { success, data } = signData || {};
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

        AsyncStorage.setItem("token", data.access_token);

        if (!customer_id) {
          const stripeRes = await createStripeCustomer({
            bodyParams: {
              name: `${first_name} ${last_name}`,
              phone: mobile_number,
              description: "Test",
            },
          });
          let stripeCustomerId = "";
          if (stripeRes?.statusCode === 200) {
            stripeCustomerId = stripeRes?.data?.id;
          }
          dispatch(onSetUser({ ...data, stripeCustomerId }));

          await saveCustomerId({
            bodyParams: { userId: id, customerId: stripeCustomerId },
          });
        } else {
          dispatch(onSetUser({ ...data, stripeCustomerId: customer_id }));
        }
        LodingData(false);
        navigation.reset({
          index: 0,
          routes: [{ name: navigations.BOTTOM_NAVIGATION }],
        });
      }
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function onAppleSignUpAPI(
    appleUsermail: any,
    appleAuth: any,
    firstName: any,
    lastName: any
  ) {
    const userData: any = {
      email: appleUsermail,
      authorizationCode: appleAuth,
      givenName: firstName,
      familyName: lastName,
    };
    try {
      LodingData(true);
      const response = await fetch(
        process.env.API_URL + "/v1/auth/appleSignupLogin",
        {
          method: "post",
          headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          body: Object.keys(userData)
            .map((key) => key + "=" + userData[key])
            .join("&"),
        }
      );
      const signData = await response.json();
      console.log("==========on Apple Sign Up API Response==============");
      console.log(signData);
      LodingData(false);
      if (signData?.success === false) {
        Toast.show(signData.message, Toast.LONG, {
          backgroundColor: "black",
        });
        LodingData(false);
      }
      const { success, data } = signData || {};
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

        AsyncStorage.setItem("token", data.access_token);

        if (!customer_id) {
          const stripeRes = await createStripeCustomer({
            bodyParams: {
              name: `${first_name} ${last_name}`,
              phone: mobile_number,
              description: "Test",
            },
          });
          let stripeCustomerId = "";
          if (stripeRes?.statusCode === 200) {
            stripeCustomerId = stripeRes?.data?.id;
          }
          dispatch(onSetUser({ ...data, stripeCustomerId }));

          await saveCustomerId({
            bodyParams: { userId: id, customerId: stripeCustomerId },
          });
        } else {
          dispatch(onSetUser({ ...data, stripeCustomerId: customer_id }));
        }

        navigation.reset({
          index: 0,
          routes: [{ name: navigations.BOTTOM_NAVIGATION }],
        });
      }
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function getAppleIdCredAPI(userid: any) {
    const userData: any = {
      authorizationCode: userid.user,
    };
    try {
      LodingData(true);
      const response = await fetch(
        process.env.API_URL + "/v1/auth/appleSignupLogin",
        {
          method: "post",
          headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          body: Object.keys(userData)
            .map((key) => key + "=" + userData[key])
            .join("&"),
        }
      );
      const userinfo = await response.json();
      console.log(
        "==========get user Apple Cred two API Response=============="
      );
      console.log(userinfo);

      if (userinfo?.success === false) {
        Toast.show(userinfo?.message, Toast.LONG, {
          backgroundColor: "black",
        });
        LodingData(false);
      }
      const { success, data } = userinfo || {};
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

        AsyncStorage.setItem("token", data.access_token);

        if (!customer_id) {
          const stripeRes = await createStripeCustomer({
            bodyParams: {
              name: `${first_name} ${last_name}`,
              phone: mobile_number,
              description: "Test",
            },
          });
          let stripeCustomerId = "";
          if (stripeRes?.statusCode === 200) {
            stripeCustomerId = stripeRes?.data?.id;
          }
          dispatch(onSetUser({ ...data, stripeCustomerId }));

          await saveCustomerId({
            bodyParams: { userId: id, customerId: stripeCustomerId },
          });
        } else {
          dispatch(onSetUser({ ...data, stripeCustomerId: customer_id }));
        }
        LodingData(false);
        navigation.reset({
          index: 0,
          routes: [{ name: navigations.BOTTOM_NAVIGATION }],
        });
      }
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  const onSubmit = async () => {
    LodingData(true);
    console.log("1111111");
    const deviceToken = await getUniqueId();
    const deviceInfo = `${Platform.OS === "ios"} ${await getDeviceName()}`;
    const body = {
      emailOrMobile: user?.emailOrMobile,
      password: user?.password,
      loginType: "password",
      deviceToken,
      version: "1.0.0",
      deviceInfo,
      googleToken: "fasdfasdfdsasdfad",
    };
    console.log(body);
    const res = await mutateAsync(body);
    const { success, data } = res || {};
    if (!success) {
      Toast.show(res?.message, Toast.LONG, {
        backgroundColor: "black",
      });
      LodingData(false);
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

      AsyncStorage.setItem("token", data.access_token);
      AsyncStorage.setItem("userProfileId", data.id);

      if (!customer_id) {
        const stripeRes = await createStripeCustomer({
          bodyParams: {
            name: `${first_name} ${last_name}`,
            phone: mobile_number,
            description: "Test",
          },
        });
        let stripeCustomerId = "";
        if (stripeRes?.statusCode === 200) {
          stripeCustomerId = stripeRes?.data?.id;
        }
        dispatch(onSetUser({ ...data, stripeCustomerId }));

        await saveCustomerId({
          bodyParams: { userId: id, customerId: stripeCustomerId },
        });
        LodingData(false);
      } else {
        LodingData(false);
        dispatch(onSetUser({ ...data, stripeCustomerId: customer_id }));
      }

      LodingData(false);
      navigation.reset({
        index: 0,
        routes: [{ name: navigations.BOTTOM_NAVIGATION }],
      });
    }
  };

  const onSignUp = async () => {
    if (!emailRegexEx.test(String(user?.emailOrMobile).toLowerCase())) {
      Toast.show("Enter your Valid Email", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (user?.password.length < 8) {
      Toast.show("Password Must be 8 Digit", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      navigation.navigate(navigations.SIGNUP, {
        email: user?.emailOrMobile,
        password: user?.password,
      });
    }
  };

  const handleUserData = (value: string, key: string) => {
    setUser({ ...user, [key]: value });
  };
  const onCheckValidation = () => {
    return !(
      (emailRegexEx.test(String(user.emailOrMobile).toLowerCase()) ||
        user.emailOrMobile.length === 10) &&
      user.password.length >= 8
    );
  };

  const loadInBrowser = () => {
    const url = "https://onelocal.one/privacy_policy.html";
    if (url) {
      console.log("11111111111");
      Linking.openURL(url);
    }
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const onCheckReleaseHideShow = () => {
    if (Platform.OS === "ios") {
      const isShowPaymentCheck = getData("isShowPaymentFlow");
      return isShowPaymentCheck;
    } else {
      const isShowPaymentCheckAndroid = getData("isShowPaymentFlowAndroid");
      return isShowPaymentCheckAndroid;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={keyboardDismiss}
      style={styles.container}
    >
      <Loader visible={isLoading} showOverlay />

      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={{ marginTop: 100, marginBottom: 40 }}
          activeOpacity={1}
        >
          <View style={styles.oneContainer}>
            <ImageComponent
              style={styles.oneContainerImage}
              source={onelogo}
            ></ImageComponent>
            <View>
              <Text style={styles.oneContainerText}>NE</Text>
              <Text style={styles.localText}>L o c a l</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.texClass}>{strings.email}</Text>
        {/* <TextInput
      // placeholder={strings.mobileOrEmail}
      /> */}
        <TextInput
          placeholderTextColor="#8B8888"
          style={styles.textInput}
          autoCapitalize="none"
          onChangeText={(text) => handleUserData(text, "emailOrMobile")}
        />
        <SizedBox height={verticalScale(10)} />
        <Text style={styles.texClass}>{strings.password}</Text>
        <TextInput
          secureTextEntry
          placeholderTextColor="#8B8888"
          style={styles.textInput}
          onChangeText={(text) => handleUserData(text, "password")}
        />
        {/* <Input
        placeholder={strings.password}
        secureTextEntry
        
      /> */}
        <SizedBox height={verticalScale(10)} />

        {/* <ButtonComponent
          disabled={onCheckValidation()}
          onPress={onSubmit}
          title={strings.login}
        /> */}

        <TouchableOpacity
          disabled={onCheckValidation()}
          activeOpacity={0.8}
          onPress={onSubmit}
          style={styles.loginBtn}
        >
          <Text style={styles.signUpText}>{strings.login}</Text>
        </TouchableOpacity>

        {/* <ButtonComponent
          style={styles.signUpBtn}
          onPress={onSignUp}
          title={strings.signUp}
        /> */}
        <SizedBox height={verticalScale(8)} />
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.forgot}>{`${strings.forgotPassword}?`}</Text>
        </TouchableOpacity>

        {onCheckReleaseHideShow() ? (
          <>
            <SizedBox height={verticalScale(18)} />
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.googleButton}
              onPress={() => signInWithGoogle()}
            >
              <ImageComponent source={google} style={styles.google} />
              <Text style={styles.loginGoogle}>{strings.loginGoogle}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <></>
        )}

        {onCheckReleaseHideShow() && Platform.OS === "ios" ? (
          <>
            <SizedBox height={verticalScale(10)} />
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.appleButton}
              onPress={() => signInWithApple()}
            >
              <ImageComponent source={apple} style={styles.apple} />
              <Text style={styles.loginApple}>{strings.loginApple}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <></>
        )}

        <SizedBox height={verticalScale(12)} />

        <Text style={styles.orText}>or</Text>
        {/* <SizedBox height={verticalScale(20)} /> */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSignUp}
          style={styles.signUpBtn}
        >
          <Text style={styles.signUpText}>{strings.signUp}</Text>
        </TouchableOpacity>

        <SizedBox height={verticalScale(12)} />

        <TouchableOpacity style={styles.tncStyle} activeOpacity={0.8}>
          {/* <TouchableOpacity onPress={onHandleCheckBox}>
          <ImageComponent
            source={isChecked ? activeRadio : inactiveRadio}
            style={styles.radio}
          />
        </TouchableOpacity> */}
          <TouchableOpacity activeOpacity={0.8} onPress={loadInBrowser}>
            <Text style={styles.agreeText}>
              {strings.iAgree}

              <Text style={styles.bold}>{` ${strings.tnc}`}</Text>
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <SizedBox height={verticalScale(10)} />
      </KeyboardAwareScrollView>
    </TouchableOpacity>
  );
};
