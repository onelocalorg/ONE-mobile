import { appleAuth } from "@invertase/react-native-apple-authentication";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useMutation } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import {
  Keyboard,
  Linking,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Modal, Portal } from "react-native-paper";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { apple, google } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { SizedBox } from "~/components/sized-box";
import { LOG } from "~/config";
import { AuthDispatchContext } from "~/navigation/AuthContext";
import { GuestStackScreenProps, Screens } from "~/navigation/types";
import {
  AuthMutations,
  LoginProps,
  useAuthService,
} from "~/network/api/services/useAuthService";
import { getData } from "~/network/constant";
import { verticalScale } from "~/theme/device/normalize";
import { CurrentUser } from "~/types/current-user";
import { UserProfile } from "~/types/user-profile";
import { handleApiError } from "~/utils/common";
import { ForgotPassword } from "./ForgotPassword";
import { createStyleSheet } from "./style";

GoogleSignin.configure({
  iosClientId: process.env.GOOGLE_SIGNIN_IOS_CLIENT_ID,
  webClientId: process.env.GOOGLE_SIGNIN_WEB_CLIENT_ID,
  offlineAccess: true,
});

export const LoginScreen = ({
  navigation,
}: GuestStackScreenProps<Screens.LOGIN>) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [user, setUser] = useState({ emailOrMobile: "", password: "" });
  const [isForgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  // FIXME This is needed to register the keys, need a better way to do this
  const _authService = useAuthService();

  const {
    data: loginData,
    mutate: logIn,
    isPending: isLoginPending,
  } = useMutation<LoginProps, Error, UserProfile>({
    mutationKey: [AuthMutations.logIn],
  });

  const { handleSignIn } = useContext(AuthDispatchContext);

  const handleLoginResponse = (currentUser?: CurrentUser) => {
    if (currentUser) {
      handleSignIn(currentUser);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      LOG.debug("hasPlayServices", hasPlayServices);
      const googleUser = await GoogleSignin.signIn();
      LOG.debug("GoogleSignIn user info", googleUser);

      const userData = {
        id: googleUser.user.id,
        email: googleUser.user.email,
        first_name: googleUser.user.givenName ?? undefined,
        last_name: googleUser.user.familyName ?? undefined,
        pic: googleUser.user.photo ?? undefined,
        googleAuth: googleUser.serverAuthCode ?? undefined,
      };
      const loggedInUser = await googleLogin(userData);

      handleLoginResponse(loggedInUser);
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
        handleApiError("Could not sign in with Google", error);
      }
    }
  };

  const signInWithApple = async () => {
    try {
      const resp = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      LOG.debug("signInWithApple:", resp);
      if (!resp.authorizationCode) {
        throw new Error("Apple login did not return authorization code");
      }

      const userData = {
        nonce: resp.nonce,
        user: resp.user,
        email: resp.email ?? undefined,
        identityToken: resp.identityToken ?? undefined,
        authorizationCode: resp.authorizationCode,
        givenName: resp.fullName?.givenName ?? undefined,
        familyName: resp.fullName?.familyName ?? undefined,
        nickname: resp.fullName?.nickname ?? undefined,
      };

      const loggedInUser = await appleLogin(userData);
      handleLoginResponse(loggedInUser);
    } catch (error) {
      handleApiError("Could not sign in with Apple", error);
    }
  };

  const onSubmit = async () => {
    LodingData(true);
    const body = {
      emailOrMobile: user?.emailOrMobile,
      password: user?.password,
      loginType: "password",
      version: DeviceInfo.getReadableVersion(),
      deviceInfo: DeviceInfo.getDeviceId(),
    };
    try {
      const currentUser = await logIn(body);
      handleLoginResponse(currentUser);
    } catch (e: any) {
      handleApiError("Error signing in", e);
    }
  };

  const onSignUp = () => {
    navigation.push(Screens.SIGNUP);
  };

  const handleUserData = (value: string, key: string) => {
    setUser({ ...user, [key]: value });
  };

  const loadInBrowser = () => {
    const url = "https://onelocal.one/privacypolicy";
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
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.texClass}>{strings.email}</Text>
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
          // disabled={onCheckValidation()}
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
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setForgotPasswordVisible(true)}
        >
          <Text style={styles.forgot}>{`${strings.forgotPassword}?`}</Text>
        </TouchableOpacity>
        <Portal>
          <Modal
            visible={isForgotPasswordVisible}
            onDismiss={() => setForgotPasswordVisible(false)}
            contentContainerStyle={styles.modal}
          >
            <ForgotPassword onDismiss={() => setForgotPasswordVisible(false)} />
          </Modal>
        </Portal>
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
