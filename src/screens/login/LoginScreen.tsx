import {
  AppleRequestResponse,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import {
  GoogleSignin,
  User,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useMutation } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { apple, google } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Loader } from "~/components/loader";
import { SizedBox } from "~/components/sized-box";
import { LOG } from "~/config";
import { AuthDispatchContext } from "~/navigation/AuthContext";
import { GuestStackScreenProps, Screens } from "~/navigation/types";
import {
  AuthMutations,
  LoginProps,
  useAuthService,
} from "~/network/api/services/useAuthService";
import { verticalScale } from "~/theme/device/normalize";
import { ApiError } from "~/types";
import { CurrentUser } from "~/types/current-user";
import { handleApiError } from "~/utils/common";
import { ForgotPasswordScreen } from "./ForgotPasswordScreen";
import { createStyleSheet } from "./style";

export const LoginScreen = ({
  navigation,
}: GuestStackScreenProps<Screens.LOGIN>) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [isForgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  // FIXME This is needed to register the keys, need a better way to do this
  const _authService = useAuthService();
  const { handleSignIn, handleSignInUnverified } =
    useContext(AuthDispatchContext);

  const {
    data: loginData,
    mutate: logIn,
    isPending: isPasswordLoginPending,
  } = useMutation<CurrentUser, Error, LoginProps>({
    mutationKey: [AuthMutations.logIn],
  });

  const {
    data: appleLoginData,
    mutate: appleLogin,
    isPending: isAppleLoginPending,
  } = useMutation<CurrentUser, Error, AppleRequestResponse>({
    mutationKey: [AuthMutations.appleLogin],
  });

  const {
    data: googleLoginData,
    mutate: googleLogin,
    isPending: isGoogleLoginPending,
  } = useMutation<CurrentUser, Error, User>({
    mutationKey: [AuthMutations.googleLogin],
  });

  const isLoginPending =
    isPasswordLoginPending || isAppleLoginPending || isGoogleLoginPending;

  useEffect(() => {
    if (loginData || appleLoginData || googleLoginData) {
      // Force to CurrentUser because the above check takes care of the case
      // where loginData is just a UserProfile.
      handleSignIn(
        (loginData ?? appleLoginData ?? googleLoginData) as CurrentUser
      );
    }
  }, [loginData, appleLoginData, googleLoginData, handleSignIn, strings.ok]);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginProps>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInWithPassword = (data: LoginProps) => {
    logIn(data, {
      onError: (error) => {
        if ((error as ApiError)?.code === HttpStatusCode.Forbidden.valueOf()) {
          handleSignInUnverified(getValues("email"));
        } else {
          Alert.alert("Login error", error.message);
        }
      },
    });
  };

  const signInWithGoogle = async () => {
    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      LOG.debug("hasPlayServices", hasPlayServices);
      const googleUser = await GoogleSignin.signIn();
      LOG.debug("GoogleSignIn user info", googleUser);
      googleLogin(googleUser);
    } catch (error) {
      if (error instanceof Error && "code" in error) {
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
        }
      } else {
        handleApiError("Could not sign in with Google", error as Error);
      }
    }
  };

  const signInWithApple = async () => {
    const resp = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    appleLogin(resp);
  };

  const onSignUp = () => {
    navigation.push(Screens.SIGNUP);
  };

  const loadInBrowser = () => {
    const url = "https://onelocal.one/privacypolicy";
    if (url) {
      Linking.openURL(url);
    }
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={keyboardDismiss}
      style={styles.container}
    >
      <Loader visible={isLoginPending} showOverlay={true} />
      <SizedBox height={verticalScale(12)} />
      <Text style={styles.texClass}>{strings.email}</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholderTextColor="#8B8888"
            style={styles.textInput}
            autoCapitalize="none"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        name="email"
      />
      {errors.email && <Text style={styles.errorText}>This is required.</Text>}

      <SizedBox height={verticalScale(10)} />
      <Text style={styles.texClass}>{strings.password}</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            secureTextEntry
            placeholderTextColor="#8B8888"
            style={styles.textInput}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        name="password"
      />
      {errors.password && (
        <Text style={styles.errorText}>This is required.</Text>
      )}

      <SizedBox height={verticalScale(10)} />
      {/* <ButtonComponent
          disabled={onCheckValidation()}
          onPress={onSubmit}
          title={strings.login}
        /> */}
      <TouchableOpacity
        // disabled={onCheckValidation()}
        activeOpacity={0.8}
        onPress={handleSubmit(signInWithPassword)}
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
          <ForgotPasswordScreen
            onDismiss={() => setForgotPasswordVisible(false)}
          />
        </Modal>
      </Portal>
      <SizedBox height={verticalScale(18)} />
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.googleButton}
        onPress={signInWithGoogle}
      >
        <ImageComponent source={google} style={styles.google} />
        <Text style={styles.loginGoogle}>{strings.loginGoogle}</Text>
      </TouchableOpacity>
      <SizedBox height={verticalScale(10)} />
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.appleButton}
        onPress={signInWithApple}
      >
        <ImageComponent source={apple} style={styles.apple} />
        <Text style={styles.loginApple}>{strings.loginApple}</Text>
      </TouchableOpacity>
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
    </TouchableOpacity>
  );
};
