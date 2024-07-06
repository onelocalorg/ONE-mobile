import { useMutation } from "@tanstack/react-query";
import React, { useContext, useEffect } from "react";
import { Text } from "react-native";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ButtonComponent } from "~/components/button-component";
import { Loader } from "~/components/loader";
import { AuthDispatchContext } from "~/navigation/AuthContext";
import { GuestStackScreenProps, Screens } from "~/navigation/types";
import {
  AuthMutations,
  VerifyEmailProps,
} from "~/network/api/services/useAuthService";
import { CurrentUser } from "~/types/current-user";

export const VerifyScreen = ({
  route,
}: GuestStackScreenProps<Screens.VERIFY>) => {
  const { email, token } = route.params;

  const { strings } = useStringsAndLabels();
  const { handleSignIn } = useContext(AuthDispatchContext);

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
    verifyEmail({
      email,
      token,
    });
  }, [email, token, verifyEmail]);

  const handleVerify = () => {
    if (currentUser) {
      handleSignIn(currentUser);
    }
  };

  return (
    <>
      <Loader visible={isPending} />
      {isPending ?? <Text>Verification in progress ...</Text>}
      {isSuccess ?? (
        <Text>Verification successful. Press the button to continue.</Text>
      )}
      {isError ?? <Text>Verification failed. Please try again.</Text>}
      <ButtonComponent
        onPress={handleVerify}
        hasIcon={false}
        disabled={!isSuccess}
        title="Continue"
      />
    </>
  );
};
