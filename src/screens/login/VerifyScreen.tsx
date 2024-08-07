import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useMutation } from "@tanstack/react-query";
import React, { useContext, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ButtonComponent } from "~/components/button-component";
import { Loader } from "~/components/loader";
import { SizedBox } from "~/components/sized-box";
import { AuthDispatchContext } from "~/navigation/AuthContext";
import { GuestStackScreenProps, Screens } from "~/navigation/types";
import {
  AuthMutations,
  LoginProps,
  VerifyEmailProps,
  useAuthService,
} from "~/network/api/services/useAuthService";
import { verticalScale } from "~/theme/device/normalize";
import { CurrentUser } from "~/types/current-user";
import { handleApiError } from "~/utils/common";
import { createStyleSheet } from "./style";

export const VerifyScreen = ({
  route,
}: GuestStackScreenProps<Screens.VERIFY>) => {
  const { email, password, token } = route.params;

  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const { handleSignIn } = useContext(AuthDispatchContext);
  const { resendEmailVerification } = useAuthService();

  const {
    isPending: isVerifyPending,
    isError: isVerifyError,
    mutate: verifyEmail,
  } = useMutation<CurrentUser, Error, VerifyEmailProps>({
    mutationKey: [AuthMutations.verifyEmail],
  });

  const {
    isPending: isLoginPending,
    isError: isLoginError,
    mutate: retryLogin,
  } = useMutation<CurrentUser, Error, LoginProps>({
    mutationKey: [AuthMutations.logIn],
  });

  useEffect(() => {
    if (email && token) {
      verifyEmail({
        email,
        token,
      });
    }
  }, [email, token, verifyEmail]);

  const handleResendVerification = () => {
    resendEmailVerification(email)
      .then(() =>
        Toast.show("Email sent", Toast.LONG, {
          backgroundColor: "black",
        })
      )
      .catch((e) => handleApiError("Resending verification", e as Error));
  };

  // const handleVerify = () => {
  //   if (currentUser) {
  //     handleSignIn(currentUser);
  //   }
  // };

  const handleRetryLogin = () => {
    if (email && password) {
      retryLogin({ email, password }, { onSuccess: handleSignIn });
    }
  };

  return (
    <View style={styles.container}>
      <Loader visible={isVerifyPending || isLoginPending} />
      <SizedBox height={verticalScale(24)} />

      {/* {isSuccess && (
        <Text>Verification successful. Press the button to continue.</Text>
      )} */}
      {(isVerifyError || isLoginError) && (
        <Text style={styles.texClass}>
          Verification failed. Please try again.
        </Text>
      )}
      {!token ? (
        <>
          <Text style={styles.texClass}>Waiting for email verification.</Text>
          <SizedBox height={verticalScale(12)} />
          <Text style={styles.texClass}>Check your email {email}.</Text>
          <SizedBox height={verticalScale(24)} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <ButtonComponent
              onPress={handleResendVerification}
              hasIcon={false}
              title="Resend verification email"
            />
            {email && password && (
              <>
                <Pressable onPress={handleRetryLogin}>
                  <FontAwesomeIcon
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    icon={faArrowsRotate}
                    color="white"
                    size={28}
                  />
                </Pressable>
              </>
            )}
          </View>
        </>
      ) : (
        <>
          <SizedBox height={verticalScale(24)} />
          {/* <ButtonComponent
            onPress={handleVerify}
            hasIcon={false}
            disabled={!isSuccess}
            title="Continue"
          /> */}
        </>
      )}
    </View>
  );
};
