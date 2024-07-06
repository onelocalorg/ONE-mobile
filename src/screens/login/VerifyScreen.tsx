import { useMutation } from "@tanstack/react-query";
import React, { useContext, useEffect } from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ButtonComponent } from "~/components/button-component";
import { Loader } from "~/components/loader";
import { SizedBox } from "~/components/sized-box";
import { AuthDispatchContext } from "~/navigation/AuthContext";
import { GuestStackScreenProps, Screens } from "~/navigation/types";
import {
  AuthMutations,
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
  const { email, token } = route.params;

  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const { handleSignIn } = useContext(AuthDispatchContext);
  const { resendEmailVerification } = useAuthService();

  const {
    isPending,
    isSuccess,
    isError,
    mutate: verifyEmail,
    data: currentUser,
  } = useMutation<CurrentUser, Error, VerifyEmailProps>({
    mutationKey: [AuthMutations.verifyEmail],
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
    resendEmailVerification(email).catch((e) =>
      handleApiError("Resending verification", e as Error)
    );
  };

  const handleVerify = () => {
    if (currentUser) {
      handleSignIn(currentUser);
    }
  };

  return (
    <View style={styles.container}>
      <Loader visible={isPending} />
      <SizedBox height={verticalScale(24)} />

      {isPending && (
        <Text style={styles.texClass}>Verification in progress ...</Text>
      )}
      {isSuccess && (
        <Text>Verification successful. Press the button to continue.</Text>
      )}
      {isError && (
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

          <ButtonComponent
            onPress={handleResendVerification}
            hasIcon={false}
            title="Resend email"
          />
        </>
      ) : (
        <>
          <SizedBox height={verticalScale(24)} />
          <ButtonComponent
            onPress={handleVerify}
            hasIcon={false}
            disabled={!isSuccess}
            title="Continue"
          />
        </>
      )}
    </View>
  );
};
